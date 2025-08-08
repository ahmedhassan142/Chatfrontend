// components/Chat/Avatar.tsx
import React from 'react';

interface AvatarProps {
  username: string;
  userId: string;
  isOnline?: boolean;
  avatarLink?: string;
  size?:  "sm" | "md" | "lg"; 
}

const Avatar: React.FC<AvatarProps> = ({ username, userId, isOnline, avatarLink, size = 'md' }) => {
  const colors = [
    "#90CDF4",
    "#F56565",
    "#D6BCFA",
    "#BC85E0",
    "#7F9CF5",
    "#F6AD55",
    "#F687B3",
    "#68D391",
    "#FBBF24",
    "#4299E1",
  ];

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div 
        className="rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-700 shadow-lg"
        style={{ backgroundColor: color }}
      >
        {avatarLink ? (
          <img
            src={avatarLink}
            className="w-full h-full object-cover"
            alt={username}
          />
        ) : (
          <span className="font-bold text-white">
            {username[0].toUpperCase()}
          </span>
        )}
      </div>
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
      )}
    </div>
  );
};

export default Avatar;