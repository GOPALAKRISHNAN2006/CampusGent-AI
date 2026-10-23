import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-stone-200 dark:border-[#403426] rounded-2xl bg-stone-50/50 dark:bg-[#17120D]/60 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-[#21180F] flex items-center justify-center mb-4 text-stone-600 dark:text-[#C49A5A]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-[#F5F0E8] mb-1">{title}</h3>
      <p className="text-sm text-stone-600 dark:text-[#C8BFAF] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
