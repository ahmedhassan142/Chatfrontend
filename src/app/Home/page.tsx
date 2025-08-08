// pages/index.tsx
import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '@/app/components/Hero';
import LandingNav from "@/app/components/LandingNav"
import Footer from '@/app/components/Footer';
import Features from '@/app/components/Features';
import Payments from '@/app/components/Payments';
import CustomerLogos from '@/app/components/CustomerLogos';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SwiftChat - Modern Communication Platform</title>
        <meta name="description" content="SwiftChat is a modern communication platform for teams and businesses" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <LandingNav />
        <main>
          <Hero />
          <Features />
          <Payments />
          <CustomerLogos />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;