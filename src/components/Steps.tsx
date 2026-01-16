import React from 'react';

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface StepsProps {
  title?: string;
  steps: Step[];
}

export const Steps: React.FC<StepsProps> = ({ 
  title = 'Step by Step', 
  steps 
}) => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-700 leading-relaxed">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-12 w-full h-0.5 bg-green-200 -z-10" 
                     style={{ width: 'calc(100% - 3rem)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
