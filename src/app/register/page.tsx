'use client';
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const Register = () => {
  const [data, setData] = useState<RegisterData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/register`,
        data
      );
      toast.success(res.message, {
        position: 'top-center',
        duration: 4000,
      });
      setRegisteredEmail(data.email);
      setRegistrationSuccess(true);
      setData({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
      });
    } catch (error: any) {
      if (error.response?.status >= 300 && error.response?.status <= 500) {
        toast.error(error.response.data.message, {
          position: 'top-center',
        });
      }
      setRegistrationSuccess(false); // Ensure form stays visible on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/resend-verification`,
        { email: registeredEmail }
      );
      toast.success(res.message, {
        position: 'top-center',
        duration: 4000,
      });
    } catch (error: any) {
      if (error.response?.status >= 300 && error.response?.status <= 500) {
        toast.error(error.response.data.message, {
          position: 'top-center',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen flex items-center justify-center p-4"
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              {registrationSuccess ? "Verify Your Email" : "Create Account"}
            </h1>
            <p className="text-gray-400">
              {registrationSuccess ? "Almost there! Check your email" : "Join our community today"}
            </p>
          </motion.div>

          {registrationSuccess ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-300">
                  We've sent a verification link to
                </p>
                <p className="font-medium text-white">{registeredEmail}</p>
                <p className="text-gray-400 text-sm">
                  Check your inbox and click the link to activate your account.
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full py-2 px-4 bg-purple-600/50 hover:bg-purple-600/70 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>

                <div className="text-center text-sm text-gray-400">
                  Wrong email?{' '}
                  <button
                    onClick={() => setRegistrationSuccess(false)}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Go back
                  </button>
                </div>

                <div className="pt-2 text-center text-sm text-gray-400">
                  Already verified?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Login here
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={data.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={data.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>
          )}

          {!registrationSuccess && (
            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Login here
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Register;