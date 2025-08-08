'use client'; // Required for client-side interactivity

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Next.js 13+ navigation
import { 
  FiUsers, 
  FiZap, 
  FiLock, 
  FiCode, 
  FiSmartphone 
} from 'react-icons/fi';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function AboutSection() {
  const router = useRouter();

  const features: FeatureCard[] = [
    {
      icon: <FiUsers className="text-4xl mb-4 text-purple-400" />,
      title: "Real-Time Collaboration",
      description: "Chat instantly with friends, family, or colleagues with our lightning-fast messaging system."
    },
    {
      icon: <FiZap className="text-4xl mb-4 text-blue-400" />,
      title: "Blazing Fast Performance",
      description: "Optimized for speed with WebSockets and efficient data handling for seamless communication."
    },
    {
      icon: <FiLock className="text-4xl mb-4 text-green-400" />,
      title: "End-to-End Encryption",
      description: "Your conversations are secure with military-grade encryption protecting every message."
    },
    {
      icon: <FiCode className="text-4xl mb-4 text-yellow-400" />,
      title: "Developer Friendly",
      description: "Built with modern tech stack: React, Node.js, and WebSockets for maximum reliability."
    },
    {
      icon: <FiSmartphone className="text-4xl mb-4 text-pink-400" />,
      title: "Cross-Platform",
      description: "Access your chats from any device - desktop, tablet, or mobile with responsive design."
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 px-4 overflow-hidden">
      {/* Floating 3D elements */}
      <motion.div
        initial={{ x: -100, y: -100, rotate: 0 }}
        animate={{ x: 0, y: 0, rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-purple-600/20 filter blur-xl opacity-70"
      />
      
      <motion.div
        initial={{ x: 100, y: 100, rotate: 0 }}
        animate={{ x: 0, y: 0, rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-blue-600/20 filter blur-xl opacity-70"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Our Chat</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing communication with cutting-edge technology and user-focused design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="text-center">
                {feature.icon}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 md:p-12 border border-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Experience the Future of Messaging
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border border-purple-500 text-purple-400 font-medium rounded-lg shadow-lg transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}