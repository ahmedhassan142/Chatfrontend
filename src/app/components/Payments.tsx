// components/Payments.tsx
import React from 'react';

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: {
    text: string;
    highlighted?: string;
  }[];
  featured?: boolean;
}

const Payments = () => {
  const plans: PricingPlan[] = [
    {
      title: "Starter",
      price: "$29",
      description: "Best option for personal use & for your next project.",
      features: [
        { text: "Individual configuration" },
        { text: "No setup, or hidden fees" },
        { text: "Team size: ", highlighted: "1 developer" },
        { text: "Premium support: ", highlighted: "6 months" },
        { text: "Free updates: ", highlighted: "6 months" }
      ]
    },
    {
      title: "Company",
      price: "$99",
      description: "Relevant for multiple users, extended & premium support.",
      featured: true,
      features: [
        { text: "Individual configuration" },
        { text: "No setup, or hidden fees" },
        { text: "Team size: ", highlighted: "10 developers" },
        { text: "Premium support: ", highlighted: "24 months" },
        { text: "Free updates: ", highlighted: "24 months" }
      ]
    },
    {
      title: "Enterprise",
      price: "$499",
      description: "Best for large scale uses and extended redistribution rights.",
      features: [
        { text: "Individual configuration" },
        { text: "No setup, or hidden fees" },
        { text: "Team size: ", highlighted: "100+ developers" },
        { text: "Premium support: ", highlighted: "36 months" },
        { text: "Free updates: ", highlighted: "36 months" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="mb-4 text-4xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Designed for business teams like yours
          </h2>
          <p className="text-lg text-gray-300">
            Here at Swift we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-10">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative flex flex-col p-8 mx-auto max-w-lg text-center rounded-xl border border-gray-700 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${plan.featured ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/50' : 'bg-gray-800/50'}`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
              )}
              <h3 className="mb-4 text-2xl font-semibold text-white">{plan.title}</h3>
              <p className="font-light text-gray-400">{plan.description}</p>
              
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              
              <ul className="mb-8 space-y-4 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <svg className="flex-shrink-0 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-white">
                      {feature.text}
                      {feature.highlighted && <span className="font-semibold"> {feature.highlighted}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              
              <a
                href="#"
                className={`mt-auto text-white font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-300 ${plan.featured ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:ring-blue-900`}
              >
                Get started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Payments;