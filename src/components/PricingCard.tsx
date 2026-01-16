import React from 'react';
import { Button } from './Button';

export interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  onSelect?: () => void;
}

export interface PricingCardProps {
  plans: PricingPlan[];
  title?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  plans, 
  title = 'Choose Your Plan' 
}) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          {title}
        </h2>
        <p className="text-xl text-center text-gray-300 mb-12">
          Flexible options to fit your needs
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-2xl ${
                plan.popular 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 transform scale-105 shadow-2xl' 
                  : 'bg-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-5xl font-bold mb-2">{plan.price}</div>
                {plan.period && (
                  <div className="text-gray-300 text-sm">{plan.period}</div>
                )}
                <p className="text-gray-300 mt-4">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <span className="text-green-300 text-xl mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "primary" : "outline"}
                size="large"
                onClick={plan.onSelect}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-white text-green-700 hover:bg-gray-100' 
                    : 'border-white text-white hover:bg-white hover:text-gray-900'
                }`}
              >
                {plan.ctaText || 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
