"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Avatar from './Avatar';
import { useAuth } from '@/app/context/authContext';

interface Message {
  _id: string;
  text: string;
  sender: string;
  recipient: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'failed';
}

interface UserDetails {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatarLink?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  userDetails: UserDetails;
  selectedUserId: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  ws?: WebSocket | null;
  messagesEndRef: React.RefObject<HTMLDivElement|null>;
  onSmartReplySelect: (reply: string) => void;
  children: React.ReactNode; // Message input form component
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  userDetails, 
  selectedUserId,
  setMessages,
  ws,
  onSmartReplySelect,
  children
}) => {
  const { token } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [longPressActive, setLongPressActive] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [userClosedReplies, setUserClosedReplies] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Generate unique keys for messages
  const messagesWithKeys = useMemo(() => {
    const keyMap = new Map<string, number>();
    return messages.map(message => {
      const count = (keyMap.get(message._id) || 0) + 1;
      keyMap.set(message._id, count);
      const uniqueKey = count > 1 ? `${message._id}-${count}` : message._id;
      return { ...message, _uniqueKey: uniqueKey };
    });
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        if (isNearBottom) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }, 50);
        }
      }
    };
    scrollToBottom();
  }, [messages]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [selectedUserId]);

  // Fetch smart replies when receiving a new message
  useEffect(() => {
    if (!selectedUserId || messages.length === 0 || userClosedReplies) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender === userDetails._id || lastMessage.text.startsWith('temp-')) return;

    const fetchSmartReplies = async () => {
      setIsLoadingReplies(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SMART_REPLY_API}/smart-reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: lastMessage.text })
        });

        if (!response.ok) throw new Error('Failed to get smart replies');

        const data = await response.json();
        setSmartReplies(data.replies);
        setShowSmartReplies(true);
        setUserClosedReplies(false);
      } catch (error) {
        console.error("Error fetching smart replies:", error);
        setShowSmartReplies(false);
      } finally {
        setIsLoadingReplies(false);
      }
    };

    fetchSmartReplies();
  }, [messages, selectedUserId, userDetails._id, userClosedReplies]);

  const handleSmartReplyClick = (reply: string) => {
    onSmartReplySelect(reply);
    setShowSmartReplies(false);
  };

  const handleCloseSmartReplies = () => {
    setShowSmartReplies(false);
    setUserClosedReplies(true);
  };

  const sendMessage = (text: string) => {
    if (!selectedUserId || !ws || !userDetails) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message: Message = {
      text: text,
      recipient: selectedUserId,
      sender: userDetails._id,
      _id: tempId,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setShowSmartReplies(false);
    setSmartReplies([]);

    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          text: text,
          recipient: selectedUserId,
          _id: undefined,
          createdAt: undefined
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

  const startPressTimer = (messageId: string) => {
    setSelectedMessageId(messageId);
    pressTimer.current = setTimeout(() => {
      setLongPressActive(true);
    }, 500);
  };

  const cancelPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!longPressActive) {
      setSelectedMessageId(null);
    }
  };

  const handleTouchEnd = () => {
    if (longPressActive) {
      return;
    }
    cancelPressTimer();
  };

  const handleDelete = async (messageId: string) => {
    setDeletingId(messageId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete message');

      const result = await response.json();
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
      setLongPressActive(false);
      setSelectedMessageId(null);
    }
  };

  const handleCloseDelete = () => {
    setLongPressActive(false);
    setSelectedMessageId(null);
  };

  const handleDeleteAllMessages = async () => {
    if (!selectedUserId || isDeletingAll) return;
    
    setIsDeletingAll(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/messages/clear-conversation?recipientId=${selectedUserId}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Operation failed on server');
      }

      setMessages([]);
    } catch (error: any) {
      console.error("Clear conversation failed:", error);
      alert(`Failed to clear conversation: ${error.message}`);
    } finally {
      setIsDeletingAll(false);
      setShowDeleteAllModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <style jsx>{`
        .chat-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: #4b5563 transparent;
        }
        
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 3px;
        }
        
        .input-form-container {
          flex-shrink: 0;
          padding: 16px;
          background: #1a202c;
          border-top: 1px solid #2d3748;
        }

        .message-bubble {
          max-width: 85%;
          min-width: 50px;
          padding: 8px 12px;
          border-radius: 18px;
          position: relative;
        }
        
        .sent-message {
          background-color: #2563eb;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          color: white;
        }
        
        .received-message {
          background-color: #374151;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          color: white;
        }
      `}</style>

      {/* Top Bar */}
      {selectedUserId && (
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2">
            <Avatar
              userId={selectedUserId}
              username={selectedUserId}
              size="sm"
            />
            <span className="font-medium text-white">
              {userDetails.firstName || userDetails.lastName 
                ? `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim()
                : 'User'}
            </span>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={() => setShowDeleteAllModal(true)}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Clear Chat
            </button>
          )}
        </div>
      )}

      {/* Scrollable Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="messages-container"
      >
        <div className="flex flex-col gap-3">
          {selectedUserId ? (
            <>
              {messagesWithKeys.map((message) => {
                const isMe = message.sender === userDetails._id;
                const showDelete = longPressActive && selectedMessageId === message._id && isMe;

                return (
                  <div key={message._uniqueKey}>
                    <div
                      className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      onTouchStart={() => startPressTimer(message._id)}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={cancelPressTimer}
                      onMouseDown={() => startPressTimer(message._id)}
                      onMouseUp={cancelPressTimer}
                      onMouseLeave={cancelPressTimer}
                    >
                      {!isMe && (
                        <div className="flex-shrink-0 self-end">
                          <Avatar
                            userId={message.sender}
                            username={message.sender}
                            size="sm"
                          />
                        </div>
                      )}
                      
                      <div className={`message-bubble ${isMe ? 'sent-message' : 'received-message'}`}>
                        <p className="break-words">
                          {message.text}
                        </p>
                        
                        {showDelete && (
                          <div className="absolute -top-2 right-0 flex gap-1">
                            <button 
                              onClick={() => handleDelete(message._id)}
                              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Smart Replies */}
                    {!isMe && message._id === messages[messages.length - 1]?._id && showSmartReplies && (
                      <div className="flex justify-start mt-2">
                        <div className="bg-gray-800 rounded-lg p-2 flex flex-wrap gap-2">
                          {smartReplies.map((reply, index) => (
                            <button
                              key={index}
                              onClick={() => handleSmartReplyClick(reply)}
                              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm text-white"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="text-5xl mb-4">👋</div>
                <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                <p className="text-gray-500">Start chatting with your connections</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Input Form Container */}
      <div className="input-form-container">
        {children}
      </div>

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 text-white">Clear this chat?</h3>
            <p className="mb-6 text-gray-300">All messages in this chat will be deleted for you.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllMessages}
                disabled={isDeletingAll}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white"
              >
                {isDeletingAll ? 'Clearing...' : 'Clear Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;