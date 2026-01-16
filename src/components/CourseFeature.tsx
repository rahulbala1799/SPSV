import React from 'react';
import { FaChalkboardTeacher, FaBook, FaBullseye, FaBuilding, FaMapMarkedAlt, FaBookOpen } from 'react-icons/fa';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface CourseFeatureProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
}

export const CourseFeature: React.FC<CourseFeatureProps> = ({ 
  features, 
  title = 'Why Choose SPSV Mastery Class?',
  subtitle 
}) => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 text-green-600 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
