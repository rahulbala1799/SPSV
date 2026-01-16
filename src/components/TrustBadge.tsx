import React from 'react';

export interface TrustBadgeProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  icon,
  text,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && <div className="text-2xl">{icon}</div>}
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
};
