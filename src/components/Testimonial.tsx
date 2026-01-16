import React from 'react';

export interface TestimonialItem {
  name: string;
  role?: string;
  content: string;
  rating?: number;
  image?: string;
}

export interface TestimonialProps {
  testimonials: TestimonialItem[];
  title?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({ 
  testimonials, 
  title = 'What Our Students Say' 
}) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          {title}
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Join hundreds of successful drivers who passed with our help
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {testimonial.rating && (
                  <div className="flex gap-1 text-yellow-400 text-xl">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
