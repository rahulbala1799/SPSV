import React from 'react';

export interface Stat {
  number: string;
  label: string;
  description?: string;
}

export interface StatsProps {
  stats: Stat[];
  title?: string;
}

export const Stats: React.FC<StatsProps> = ({ stats, title }) => {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h3 className="text-2xl font-bold text-center mb-8">{title}</h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              {stat.description && (
                <div className="text-green-100 text-sm">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
