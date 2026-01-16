import React from 'react';

export interface TestInfoProps {
  title: string;
  description: string;
  sections: Array<{
    title: string;
    content: string;
    items?: string[];
  }>;
}

export const TestInfo: React.FC<TestInfoProps> = ({ title, description, sections }) => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">{description}</p>
        
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{section.content}</p>
              {section.items && (
                <ul className="space-y-2 mt-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="text-green-600 text-xl mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
