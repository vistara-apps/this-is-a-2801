import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
}) => {
  // Variant styles
  const variantClasses = {
    default: 'bg-white/10 border border-white/20',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10',
  }[variant];

  return (
    <div
      className={`
        ${variantClasses}
        rounded-lg p-4 sm:p-6
        ${onClick ? 'cursor-pointer hover:bg-white/15 transition-colors duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

