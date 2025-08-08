'use client';
import { motion } from 'framer-motion';
import { FiCode, FiLock, FiDollarSign, FiGift } from 'react-icons/fi';

export default function LicensingPage() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen py-20 px-4 overflow-hidden">
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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <FiCode className="text-5xl text-purple-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Licensing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Options</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the right license for your needs. Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* License Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiGift className="text-3xl text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Free License</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-400"> / forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span className="text-gray-300">Basic chat functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span className="text-gray-300">Up to 100 messages/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">✓</span>
                <span className="text-gray-300">Community support</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">×</span>
                <span className="text-gray-500">Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">×</span>
                <span className="text-gray-500">Advanced features</span>
              </li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border-2 border-purple-500/50 hover:border-purple-500 transition-all duration-300 transform hover:scale-[1.02] relative"
          >
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <div className="flex items-center gap-3 mb-6">
              <FiLock className="text-3xl text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Pro License</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-gray-400"> / month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span className="text-gray-300">All Free features</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span className="text-gray-300">Unlimited messages</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span className="text-gray-300">Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span className="text-gray-300">Custom themes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span className="text-gray-300">Advanced analytics</span>
              </li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg shadow-lg transition-all duration-300"
            >
              Upgrade Now
            </motion.button>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiDollarSign className="text-3xl text-green-400" />
              <h3 className="text-2xl font-bold text-white">Enterprise</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">All Pro features</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Dedicated server</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">White-label options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">24/7 premium support</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Custom integrations</span>
              </li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300"
            >
              Contact Sales
            </motion.button>
          </motion.div>
        </div>

        {/* License Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-white mb-6">License Terms</h3>
            
            <h4 className="text-xl font-bold text-white mb-4 mt-6">1. General Terms</h4>
            <p className="text-gray-300 mb-4">
              By using our software, you agree to comply with these license terms. All licenses are non-transferable unless otherwise specified in writing.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">2. Free License</h4>
            <p className="text-gray-300 mb-4">
              The free license grants you limited access to basic features for personal, non-commercial use. You may not use the free license for commercial purposes.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">3. Pro License</h4>
            <p className="text-gray-300 mb-4">
              The Pro license is billed monthly and automatically renews until canceled. You may cancel at any time through your account settings. Pro licenses are valid for commercial use.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">4. Enterprise License</h4>
            <p className="text-gray-300 mb-4">
              Enterprise licenses require a custom agreement. Contact our sales team for pricing and terms tailored to your organization's needs.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">5. Refund Policy</h4>
            <p className="text-gray-300 mb-4">
              We offer a 30-day money-back guarantee for Pro licenses. Enterprise licenses may have different refund terms specified in your contract.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">6. Modifications</h4>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify our licensing terms and pricing at any time. Significant changes will be communicated to existing customers with at least 30 days notice.
            </p>

            <h4 className="text-xl font-bold text-white mb-4 mt-6">7. Questions</h4>
            <p className="text-gray-300">
              For any questions about licensing, please contact us at <span className="text-purple-400">ah770643@gmail.com</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}