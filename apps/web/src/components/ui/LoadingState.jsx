import React from 'react';

export const LoadingState = ({ count = 3, type = 'card', className = '' }) => {
  if (type === 'table') {
    return (
      <div className={`w-full space-y-3 animate-pulse ${className}`}>
        <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-lg w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-14 bg-stone-100 dark:bg-stone-900/60 rounded-lg w-full flex items-center px-4 gap-4">
            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className={`space-y-6 animate-pulse ${className}`}>
        {/* Banner Skeleton */}
        <div className="h-40 bg-stone-200 dark:bg-stone-800 rounded-2xl w-full" />
        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-3">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
              <div className="h-7 bg-stone-300 dark:bg-stone-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-stone-100 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-full" />
          <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};
