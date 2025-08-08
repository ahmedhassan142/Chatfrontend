"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./authContext";
import axios from "axios";

interface UserDetails {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarLink?: string;
}

interface ProfileContextType {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

// Add this missing context creation
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setUserDetails(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      setUserDetails({
        _id: response.data._id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        avatarLink: response.data.avatarLink
      });
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.response?.data?.error || "Failed to load profile");
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <ProfileContext.Provider value={{ 
      userDetails, 
      isLoading, 
      error,
      refreshProfile: fetchUserDetails 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};