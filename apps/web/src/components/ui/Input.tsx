import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">{label}</label>}
        <input
          ref={ref}
          type={type}
          className={twMerge(
            clsx(
              'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-shadow bg-white text-brand-900',
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-brand-200 focus:ring-brand-500 focus:border-brand-500',
              className
            )
          )}
          {...props}
        />
        {error && <span className="block mt-1 text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
