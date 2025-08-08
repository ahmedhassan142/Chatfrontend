"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-hot-toast";

interface Avatar {
  _id: string;
  link: string;
}

interface SelectAvatarProps {
  selectedLink: string;
  onSelect: (link: string) => void;
  onAddClick?: () => void;
}

const SelectAvatar: React.FC<SelectAvatarProps> = ({ 
  selectedLink, 
  onSelect,
  onAddClick 
}) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/avatar/all`);
        setAvatars(response.data.avatars);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        toast.error("Failed to load avatars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Choose Profile Picture</h3>
          <button className="text-blue-400 text-sm font-medium">
            Add Avatar
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-7">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Choose Profile Picture</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-pointer"
          onClick={onAddClick}
        >
          Add Avatar
        </motion.button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-7">
        {avatars.map((avatar:any) => (
          <motion.div
            key={avatar._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center"
          >
            <div
              onClick={() => onSelect(avatar.link)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all cursor-pointer ${
                selectedLink === avatar.link
                  ? "ring-4 ring-blue-500 bg-blue-500/20"
                  : "bg-gray-700/50 hover:bg-gray-600/50"
              }`}
            >
              <Image
                src={avatar.link}
                alt={`Avatar ${avatar._id}`}
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover border border-gray-600"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SelectAvatar;