'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
interface Avatar {
  _id: string;
  link: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarLink: string;
}

const DEFAULT_AVATARS = [
  "avatar1.jpg",
  "avatar2.jpg",
  "avatar3.jpg",
];

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    avatarLink: ""
  });
  const [avatarCategories, setAvatarCategories] = useState<{
    name: string;
    avatars: Avatar[];
  }[]>([
    { name: "Default Avatars", avatars: [] },
    { name: "Your Avatars", avatars: [] }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("/avatar3.jpg");
  const token = useAuth();
  const router=useRouter()
  // Fetch user profile and available avatar3
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, avatarsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/avatar/all`)
        ]);
        
        setProfile(profileRes.data);
        setSelectedAvatar(profileRes.data.avatarLink || "/default-avatar.jpg");
        
        const defaultAvatars = avatarsRes.data.avatars
          .filter((a: Avatar) => DEFAULT_AVATARS.includes(a.link));
        
        const userAvatars = avatarsRes.data.avatars
          .filter((a: Avatar) => !DEFAULT_AVATARS.includes(a.link));
        
        setAvatarCategories([
          { name: "Default Avatars", avatars: defaultAvatars },
          { name: "Your Avatars", avatars: userAvatars }
        ]);
      } catch (error) {
        showErrorToast("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "bottom-center",
      style: {
        background: "#7f1d1d",
        color: "#fff",
        borderRadius: "12px"
      }
    });
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "bottom-center",
      style: {
        background: "#1f2937",
        color: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.25)"
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatarModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile/update`, {
        ...profile,
        avatarLink: selectedAvatar
      });
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      showErrorToast("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <button
          onClick={() => router.push('/chathome')} // Navigate to Chat Home
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Chat
        </button>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ rotateY: -5, rotateX: 5 }}
          animate={{ rotateY: 0, rotateX: 0 }}
          whileHover={{ 
            rotateY: -2,
            rotateX: 2,
            boxShadow: "0 25px 50px -12px rgba(125, 45, 255, 0.25)"
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-900 rounded-full opacity-10 mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-900 rounded-full opacity-10 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <h2 className="mb-8 text-4xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Profile Settings
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <motion.div whileHover={{ scale: 1.05 }} className="relative group mb-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-lg">
                  <Image
                    src={selectedAvatar || "/default-avatar.jpg"}
                    alt="Profile Avatar"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    onError={() => setSelectedAvatar("/default-avatar.jpg")}
                  />
                </div>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all shadow-lg"
                >
                  Change Avatar
                </button>
              </motion.div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block mb-2 text-sm font-medium text-gray-300">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block mb-2 text-sm font-medium text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Select Avatar</h2>

              {/* Avatar Categories */}
              {avatarCategories.map((category) => (
                <div key={category.name} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    {category.name}
                  </h3>
                  {category.avatars.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {category.avatars.map((avatar) => (
                        <motion.div
                          key={avatar._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square ${
                            selectedAvatar === avatar.link
                              ? 'ring-4 ring-purple-500'
                              : 'hover:ring-2 hover:ring-gray-500'
                          } transition-all`}
                          onClick={() => handleAvatarSelect(avatar.link)}
                        >
                          <Image
                            src={avatar.link}
                            alt="Avatar"
                            width={120}
                            height={120}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.jpg";
                            }}
                          />
                          {selectedAvatar === avatar.link && (
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-700/30 rounded-xl">
                      No avatars available
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gray-700/50 px-6 py-4 flex justify-end">
              <motion.button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;