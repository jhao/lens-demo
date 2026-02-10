import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      {children}
    </div>
  );
};

export default Card;