import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500/50',
    secondary: 'bg-slate-800/50 text-slate-200 border border-slate-700 hover:bg-slate-700/50 hover:border-slate-600 backdrop-blur-sm',
    danger: 'bg-rose-900/40 text-rose-200 border border-rose-800 hover:bg-rose-900/60 shadow-[0_0_10px_rgba(225,29,72,0.2)]',
    ghost: 'text-slate-400 hover:bg-slate-800/50 hover:text-white',
    neon: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl text-slate-50 shadow-xl", className)} {...props} />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight text-slate-100", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'neon' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    neutral: 'bg-slate-700/30 text-slate-300 border border-slate-700',
    neon: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles[variant])}>
      {children}
    </span>
  );
};
