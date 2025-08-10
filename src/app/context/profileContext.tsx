"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./authContext";
import axios from "axios";
import Cookies from 'js-cookie';

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

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = useCallback(async () => {
    if (!isAuthenticated) {
      setUserDetails(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from cookie if available
      const cookieToken = Cookies.get("authToken");
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL||'https://chatbackend-fk4i.onrender.com'}/api/user/profile`,
        {
          headers: {
            Authorization: cookieToken ? `Bearer ${cookieToken}` : undefined
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
      
      // If it's a 401 error, try again with just cookies (no Bearer token)
      if (err.response?.status === 401) {
        try {
          const fallbackResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL||'https://chatbackend-fk4i.onrender.com'}/api/user/profile`,
            { withCredentials: true } // Rely on cookies only
          );
          
          setUserDetails({
            _id: fallbackResponse.data._id,
            firstName: fallbackResponse.data.firstName,
            lastName: fallbackResponse.data.lastName,
            email: fallbackResponse.data.email,
            avatarLink: fallbackResponse.data.avatarLink
          });
          return;
        } catch (fallbackError) {
          console.error("Fallback profile fetch failed:", fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

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