"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import ChatMessages from '@/app/components/Chat/ChatMessages';
import MessageInputForm from '@/app/components/Chat/MessageInputForm';
import Nav from '@/app/components/Chat/Nav';
import OnlineUsersList from '@/app/components/Chat/OnlineUserList';
import TopBar from '@/app/components/Chat/Topbar';
import { useAuth } from '@/app/context/authContext';
import { useProfile } from '@/app/context/profileContext';
import ProtectedRoute from '@/app/components/Protectedroute';

export interface Message {
  _id: string;
  text: string;
  sender: string;
  recipient: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'failed';
}

interface Person {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarLink?: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

const ChatHome = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlinePeople, setOnlinePeople] = useState<Record<string, { username: string; avatarLink?: string }>>({});
  const [offlinePeople, setOfflinePeople] = useState<Record<string, Person>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const { userDetails } = useProfile();
  const { isAuthenticated, checkAuth, logout, token } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  const fetchPeople = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingPeople(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/people`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const peopleData = response.data.map((p: Person) => ({
        _id: p._id,
        firstName: p.firstName,
        lastName: p.lastName,
        avatarLink: p.avatarLink,
      }));

      const offlinePeopleArr = peopleData
        .filter((p: Person) => p._id !== userDetails?._id)
        .filter((p: Person) => !onlinePeople[p._id]);

      setOfflinePeople(prev => ({
        ...prev,
        ...offlinePeopleArr.reduce((acc: Record<string, Person>, p: Person) => {
          acc[p._id] = p;
          return acc;
        }, {})
      }));
    } catch (error) {
      console.error('Error fetching people:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoadingPeople(false);
    }
  }, [isAuthenticated, onlinePeople, userDetails?._id, logout, token]);

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId || !token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/messages/${selectedUserId}`,
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const processedMessages = response.data.map((msg: Message) => ({
        ...msg,
        _id: msg._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: msg.createdAt || new Date().toISOString(),
        status: 'sent'
      }));
      
      setMessages(processedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    }
  }, [selectedUserId, logout, token]);

  const isSameMessage = (a: Message, b: Message) => {
    return (
      a.text === b.text &&
      a.sender === b.sender &&
      a.recipient === b.recipient &&
      Math.abs(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) < 1000
    );
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !ws || !userDetails) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message: Message = {
      text: newMessage,
      recipient: selectedUserId,
      sender: userDetails._id,
      _id: tempId,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          text: newMessage,
          recipient: selectedUserId
        }));
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => prev.map(m => 
          m._id === tempId ? { ...m, status: 'failed' } : m
        ));
      }
    } else {
      console.error('WebSocket is not open');
      setMessages(prev => prev.map(m => 
        m._id === tempId ? { ...m, status: 'failed' } : m
      ));
    }
  };

  const connectToWebSocket = useCallback(() => {
    if (!isAuthenticated || !token) return;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL|| ""
    const wsUrl = baseUrl.replace(/^https/, 'wss');
    const fullUrl = `${wsUrl}?token=${token}`;

    setConnectionStatus('connecting');
    const socket = new WebSocket(fullUrl);

    socket.onopen = () => {
      setWs(socket);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0;
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
    };
    const MAX_RECONNECT_ATTEMPTS = 5;


    socket.onclose = (event) => {
      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
    console.error("Max reconnection attempts reached");
    return;
  }
      console.log('WebSocket closed:', event.code, event.reason);
      setConnectionStatus('disconnected');
      
      const delay = Math.min(5000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current += 1;
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (isAuthenticated) {
          connectToWebSocket();
        }
      }, delay);
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        
        if ('online' in messageData) {
          const people: Record<string, { username: string; avatarLink?: string }> = {};
          messageData.online.forEach(({ userId, username, avatarLink }: any) => {
            if (userId !== userDetails?._id) {
              people[userId] = { username, avatarLink };
            }
          });
          setOnlinePeople(people);
        } 
        else if ('text' in messageData) {
          setMessages(prev => {
            const existingIndex = prev.findIndex((msg:Message) => 
              msg._id === messageData._id || 
              (msg._id.includes('temp-') && 
              msg.text === messageData.text &&
              msg.sender === messageData.sender &&
              msg.recipient === messageData.recipient
            ));

            if (existingIndex >= 0) {
              const newMessages = [...prev];
              newMessages[existingIndex] = {
                ...messageData,
                status: 'sent'
              };
              return newMessages;
            }
            
            return [...prev, {
              ...messageData,
              status: 'sent'
            }];
          });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    wsRef.current = socket;
    return socket;
  }, [isAuthenticated, token, userDetails?._id]);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        fetchPeople();
        if (isMobile) {
          setShowContacts(true);
        }
      }
    };
    verifyAuth();
  }, [isAuthenticated, checkAuth, router, fetchPeople, isMobile]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = connectToWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isAuthenticated, connectToWebSocket]);

  useEffect(() => {
    fetchMessages();
  }, [selectedUserId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowContacts(false);
    }
  };

  const handleBackToContacts = () => {
    setSelectedUserId(null);
    if (isMobile) {
      setShowContacts(true);
    }
  };

  const handleSmartReplySelect = (reply: string) => {
    setNewMessage(reply);
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      input?.focus();
    }, 50);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-900">
        {/* Navigation Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Nav 
            connectionStatus={connectionStatus}
            onMobileMenuToggle={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700 z-20">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {selectedUserId ? (
              <TopBar
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                offlinePeople={offlinePeople}
                onlinePeople={onlinePeople}
                connectionStatus={connectionStatus}
                onBack={handleBackToContacts}
                isMobile={true}
              />
            ) : (
              <h1 className="text-white font-semibold">Chats</h1>
            )}

            {!selectedUserId && (
              <button 
                onClick={() => setShowContacts(true)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop TopBar */}
          {selectedUserId && !isMobile && (
            <div className="hidden lg:block sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
              <TopBar
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                offlinePeople={offlinePeople}
                onlinePeople={onlinePeople}
                connectionStatus={connectionStatus}
                onBack={handleBackToContacts}
                isMobile={false}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Contacts List */}
            <div className={`${isMobile ? (showContacts ? 'fixed inset-0 z-30' : 'hidden') : 'flex-shrink-0 w-64'} bg-gray-800 border-r border-gray-700 transition-transform duration-300 ease-in-out`}>
              <OnlineUsersList
                onlinePeople={onlinePeople}
                offlinePeople={offlinePeople}
                selectedUserId={selectedUserId}
                setSelectedUserId={handleUserSelect}
                loading={loadingPeople}
                onCloseContacts={() => setShowContacts(false)}
              />
            </div>

            {/* Chat Area */}
          <div className={`flex-1 min-h-0 flex flex-col ${isMobile && !selectedUserId ? 'hidden' : 'flex'}`}>


              {selectedUserId ? (
                <>
                  <ChatMessages
                    messages={messages}
                    userDetails={userDetails || { _id: '', firstName: '', lastName: '' }}
                    selectedUserId={selectedUserId}
                    messagesEndRef={messagesEndRef}
                    setMessages={setMessages}
                    ws={ws}
                    onSmartReplySelect={handleSmartReplySelect}
                  > <MessageInputForm
                      newMessage={newMessage}
                      setNewMessage={setNewMessage}
                      sendMessage={sendMessage}
                      selectedUserId={selectedUserId}
                    />
                    </ChatMessages>

                  
                  {/* <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-md p-4 border-t border-gray-700"> */}
                   
                  {/* </div> */}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center text-gray-400">
                    <h2 className="text-xl font-semibold mb-2">Select a chat to start messaging</h2>
                    <p>Or wait for someone to message you</p>
                    {connectionStatus !== 'connected' && (
                      <div className={`mt-4 p-2 rounded ${
                        connectionStatus === 'connecting' ? 'bg-yellow-900/50' : 'bg-red-900/50'
                      }`}>
                        {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatHome;