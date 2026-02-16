import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-card backdrop-blur-xl border border-border rounded-2xl p-6
        shadow-xl shadow-black/10
        ${hover ? 'transition-transform duration-200 hover:scale-[1.02]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
