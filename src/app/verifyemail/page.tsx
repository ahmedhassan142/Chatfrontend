'use client';
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyEmailContent = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) router.push("/");
  }, [isAuthenticated, router, checkAuth]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        if (!userId || !token) {
          throw new Error("Missing verification parameters");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/verify`,
          { params: { userId, token } }
        );

        setVerificationStatus('success');
        setLoading(false);
        toast.success(response.data.message);
        setTimeout(() => router.push('/login'), 2000);
      } catch (error) {
        setVerificationStatus('error');
        setLoading(false);
        toast.error("Verification failed");
        setTimeout(() => router.push('/register'), 2000);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center text-white p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-center max-w-md"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
            <p className="text-gray-400">Please wait while we verify your account</p>
          </>
        ) : verificationStatus === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <svg
                className="w-20 h-20 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Verification Complete!</h2>
            <p className="text-gray-400 mb-6">Your email has been successfully verified</p>
            {!isAuthenticated && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-medium text-white shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all"
                >
                  Continue to Login
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <svg
                className="w-20 h-20 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-400 mb-6">The verification link is invalid or expired</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-500 rounded-lg font-medium text-white shadow-lg hover:from-red-700 hover:to-pink-600 transition-all"
              >
                Return to Registration
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;