"use client"
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false, 
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {

  // Base styles applied to all buttons
  const baseStyles = "gap-2 cursor-pointer inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg";

  // Variants mapping
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 focus:ring-primary",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-secondary",
    outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground focus:ring-ring",
    destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive shadow-sm",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
    link: "bg-transparent text-primary hover:underline underline-offset-4 p-0 h-auto shadow-none",
  };

  // Sizes mapping
  const sizes: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2.5 h-10",
    lg: "text-base px-6 py-3 h-12",
    icon: "p-2 h-10 w-10", // Square for icon-only buttons
  };

  // Combine classes manually to avoid external dependencies like clsx/tailwind-merge for this snippet
  const combinedClassName = `
    ${baseStyles} 
    ${variants[variant]} 
    ${sizes[size]} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}

      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
