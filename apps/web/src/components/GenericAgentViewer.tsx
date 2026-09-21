import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Bot, RefreshCw } from 'lucide-react';
import { DynamicJSONViewer } from './ui/DynamicJSONViewer';

interface Props {
  agentName: string;
  title: string;
  description: string;
}

export const GenericAgentViewer: React.FC<Props> = ({ agentName, title, description }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post(`/agents/execute/${agentName}`, {});
      setInsight(res.data.data?.insight ?? res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || `Failed to execute ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-950/10">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            AI agent workspace
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-200" />
            <span>{title}</span>
          </h1>
          <p className="text-sm text-indigo-100/75 mt-1 max-w-xl">{description}</p>
        </div>
        <Button onClick={handleExecute} isLoading={loading} className="shrink-0 flex gap-2 bg-white text-indigo-950 hover:bg-indigo-50">
          <RefreshCw className="h-4 w-4" />
          <span>{insight ? 'Refresh analysis' : 'Run analysis'}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {!insight && !loading && (
        <Card className="text-center p-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-brand-900">Your intelligence workspace is ready</h2>
            <p className="text-brand-500 text-sm max-w-md mx-auto">
              Run the agent to turn your verified CampusGent profile data into a clear, actionable recommendation.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-semibold text-brand-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Profile-grounded</span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">Audited output</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Actionable next steps</span>
            </div>
          </CardContent>
        </Card>
      )}

      {insight && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Agent Output</CardTitle>
                <p className="mt-1 text-xs text-brand-500">Generated from your latest profile snapshot.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Analysis complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="bg-gray-50 p-6 rounded-b-xl">
            {typeof insight === 'object' ? (
              <DynamicJSONViewer data={insight} defaultExpanded={true} />
            ) : (
              <p className="text-gray-800">{String(insight)}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
