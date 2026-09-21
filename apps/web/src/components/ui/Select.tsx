import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">{label}</label>}
        <select
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-shadow bg-white text-brand-900',
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-brand-200 focus:ring-brand-500 focus:border-brand-500',
              className
            )
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="block mt-1 text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
