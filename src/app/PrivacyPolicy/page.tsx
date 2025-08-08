'use client';
import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
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
            <FiShield className="text-5xl text-purple-400 mr-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Policy</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
        >
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-white mb-6">1. Introduction</h3>
            <p className="text-gray-300 mb-6">
              Welcome to Realtime Chat ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">2. Information We Collect</h3>
            <p className="text-gray-300 mb-4">
              We may collect the following types of information:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Personal Information: Name, email address, phone number when you contact us</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Usage Data: Information about how you use our website and services</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Technical Data: IP address, browser type, device information</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Cookies and Tracking Data: We use cookies to enhance your experience</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white mb-6">3. How We Use Your Information</h3>
            <p className="text-gray-300 mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To provide and maintain our service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To notify you about changes to our service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To allow you to participate in interactive features</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To provide customer support</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To gather analysis or valuable information to improve our service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To monitor the usage of our service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                <span>To detect, prevent and address technical issues</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white mb-6">4. Data Security</h3>
            <p className="text-gray-300 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage is ever completely secure, so we cannot guarantee absolute security.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">5. Data Retention</h3>
            <p className="text-gray-300 mb-6">
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">6. Your Data Protection Rights</h3>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right to access, update or delete your information</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right of rectification if your data is inaccurate</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right to object to our processing of your data</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right to request restriction of processing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right to data portability</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span>The right to withdraw consent</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white mb-6">7. Changes to This Privacy Policy</h3>
            <p className="text-gray-300 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">8. Contact Us</h3>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at <span className="text-purple-400">ah770643@gmail.com</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}