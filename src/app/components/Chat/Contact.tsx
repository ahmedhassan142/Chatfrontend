"use client";
import React from 'react';
import Avatar from './Avatar';

interface ContactProps {
  userId: string;
  username: string;
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  isOnline: boolean;
  avatarLink?: string;
  onSelect?: () => void;
}

const Contact: React.FC<ContactProps> = ({ 
  userId, 
  username, 
  selectedUserId, 
  setSelectedUserId, 
  isOnline,
  avatarLink,
  onSelect
}) => {
  const handleClick = () => {
    setSelectedUserId(userId);
    if (onSelect) onSelect();
  };

  return (
    <li
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-pointer 
        transition-all duration-200
        ${selectedUserId === userId 
          ? 'bg-blue-600/20 border border-blue-500/50' 
          : 'hover:bg-gray-700/50'
        }
        active:scale-95 active:bg-blue-600/30
      `}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        <Avatar 
          userId={userId} 
          username={username} 
          isOnline={isOnline}
          avatarLink={avatarLink}
          size="sm"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{username}</p>
        <p className="text-xs text-gray-400">
          {isOnline ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              Offline
            </span>
          )}
        </p>
      </div>
      
      <div className="hidden sm:block">
        {isOnline && (
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        )}
      </div>
    </li>
  );
};

export default Contact;