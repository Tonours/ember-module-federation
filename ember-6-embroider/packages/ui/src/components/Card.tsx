import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, padding = 'md', className, ...props }: CardProps) => {
  const baseStyles = 'bg-white rounded-lg shadow-md border border-gray-200';

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={clsx(baseStyles, paddingStyles[padding], className)} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const CardTitle = ({ children, className, ...props }: CardTitleProps) => {
  return (
    <h3 className={clsx('text-xl font-semibold text-gray-900', className)} {...props}>
      {children}
    </h3>
  );
};
