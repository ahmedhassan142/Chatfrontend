"use client";
import React from 'react';

interface MessageInputFormProps {
  selectedUserId: string | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const MessageInputForm: React.FC<MessageInputFormProps> = ({ 
  selectedUserId, 
  newMessage, 
  setNewMessage, 
  sendMessage 
}) => {
  if (!selectedUserId) return null;

  return (
    <form onSubmit={sendMessage} className="flex gap-2 w-full">
      <input
        type="text"
        className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={!newMessage.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInputForm;