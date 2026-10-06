import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center shadow-lg border border-brand-200/50 dark:border-brand-900/50">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>
        
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">404 — Page Not Found</span>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">Lost in Campus?</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => window.history.back()} className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </button>
        </div>
      </div>
    </div>
  );
};
