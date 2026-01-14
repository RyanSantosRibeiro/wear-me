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
    primary: "bg-[#1ca0b5] hover:bg-primary/80 text-white shadow-sm hover:shadow focus:ring-[#1ca0b5]",
    secondary: "bg-[#e9edef] hover:bg-[#d1d7db] text-[#111b21] focus:ring-[#8696a0]",
    outline: "border border-[#d1d7db] bg-transparent hover:bg-[#f0f2f5] text-[#54656f] focus:ring-[#8696a0]",
    destructive: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm",
    ghost: "bg-transparent hover:bg-[#f0f2f5] text-[#54656f] hover:text-[#111b21]",
    link: "bg-transparent text-[#1ca0b5] hover:underline underline-offset-4 p-0 h-auto shadow-none",
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
