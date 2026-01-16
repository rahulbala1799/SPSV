import React from 'react';

export interface Requirement {
  icon?: string;
  text: string;
}

export interface RequirementsProps {
  title: string;
  requirements: Requirement[];
}

export const Requirements: React.FC<RequirementsProps> = ({ title, requirements }) => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {req.icon && (
                <div className="text-3xl flex-shrink-0">{req.icon}</div>
              )}
              <div className="text-lg font-medium text-gray-900">{req.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
