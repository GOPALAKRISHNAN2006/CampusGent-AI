import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowRight, ShieldAlert, Award } from 'lucide-react';

export const FacultyAIInsights: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900 flex items-center gap-2">
          <Sparkles className="h-5.5 w-5.5 text-indigo-500 shrink-0" />
          <span>Faculty AI Insights Advisor</span>
        </h1>
        <p className="text-xs text-brand-500 mt-1">AI-driven success roadmaps, performance triggers, and evidence-grounded recommendations.</p>
      </div>

      <div className="space-y-6">
        <Card className="border border-brand-200/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-brand-50">
            <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit block">
              Performance Insight
            </span>
            <CardTitle className="text-sm font-bold text-brand-950 mt-1">Section B Database average scores drop warnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            <div className="space-y-1">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450">Insight summary</p>
              <p className="text-brand-850 leading-relaxed">
                Database Systems (Section B) students average has declined by 8% over the past 3 assessment evaluations.
              </p>
            </div>
            
            <div className="space-y-1 bg-brand-50/50 border border-brand-100 p-3 rounded-xl">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                <span>Evidence data</span>
              </p>
              <p className="text-[10px] text-brand-700 font-semibold mt-0.5">
                Mid Term Quiz 1: 78% average | Mid Term Quiz 2: 70% average | Normalization Quiz: 62% average
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450">Suggested intervention</p>
              <p className="text-brand-650">
                Host a brief remedial class reviewing SQL database normalizations and joins ahead of the upcoming final semester assessments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-brand-50">
            <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit block">
              Placement Readiness Insight
            </span>
            <CardTitle className="text-sm font-bold text-brand-950 mt-1">Eligible student placements gaps warning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            <div className="space-y-1">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450">Insight summary</p>
              <p className="text-brand-850 leading-relaxed">
                3 mentees are currently ineligible for placements due to CGPA metrics below 6.0 thresholds.
              </p>
            </div>

            <div className="space-y-1 bg-brand-50/50 border border-brand-100 p-3 rounded-xl">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                <span>Evidence data</span>
              </p>
              <p className="text-[10px] text-brand-700 font-semibold mt-0.5">
                Rahul Sharma (5.4 CGPA) | Sneha Patel (5.9 CGPA) | Amit Verma (6.2 CGPA - Warning risk)
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-[9px] uppercase tracking-wider text-brand-450">Suggested intervention</p>
              <p className="text-brand-650">
                Promote resume checks and skills declarations to help students unlock matching jobs and increase overall scorecards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default FacultyAIInsights;
