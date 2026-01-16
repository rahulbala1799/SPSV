import React, { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export const FAQ: React.FC<FAQProps> = ({ items, title = 'Frequently Asked Questions' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {title}
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-center md:text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-8">
                  {item.question}
                </h3>
                <span className="text-2xl text-gray-500 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
