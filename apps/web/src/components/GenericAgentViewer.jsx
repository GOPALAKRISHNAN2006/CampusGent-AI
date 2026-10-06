import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Bot, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { DynamicJSONViewer } from './ui/DynamicJSONViewer.jsx';

export const GenericAgentViewer = ({ agentName, title, description }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post(`/agents/execute/${agentName}`, {});
      setInsight(res.data.data?.insight ?? res.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || `Failed to execute ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in font-sans text-xs">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 p-6 sm:p-8 text-white border border-amber-900/30 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-stone-900/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            AI Agent Intelligence Workspace
          </div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-amber-400" />
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-normal leading-relaxed">
            {description}
          </p>
        </div>
        <Button
          onClick={handleExecute}
          isLoading={loading}
          variant="primary"
          className="shrink-0 flex gap-2 font-bold shadow-md bg-amber-600 hover:bg-amber-700 text-white border-none"
        >
          <RefreshCw className="h-4 w-4" />
          <span>{insight ? 'Refresh Analysis' : 'Run Agent Analysis'}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-2xl animate-fade-in">
          {error}
        </div>
      )}

      {!insight && !loading && (
        <Card className="text-center p-12 border-dashed border-2 border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20 shadow-none">
          <CardContent className="space-y-4 p-0">
            <div className="mx-auto w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center shadow-xs">
              <Bot className="h-7 w-7" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Agent Workspace is Ready for Execution
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs max-w-md mx-auto leading-relaxed">
              Click 'Run Agent Analysis' to execute this cognitive agent against your latest verified campus data.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-semibold">
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-emerald-800 dark:text-emerald-300">
                ✓ Profile-Grounded
              </span>
              <span className="rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1 text-stone-700 dark:text-stone-300">
                ✓ Audited Reasoning
              </span>
              <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1 text-amber-800 dark:text-amber-300">
                ✓ Actionable Strategy
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {insight && (
        <Card className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md animate-fade-in">
          <CardHeader className="border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-stone-900 dark:text-stone-100">Agent Output Intelligence</CardTitle>
                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400 font-normal">
                  Generated from verified profile snapshot.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Analysis Complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {typeof insight === 'object' ? (
              <DynamicJSONViewer data={insight} defaultExpanded={true} />
            ) : (
              <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-mono text-xs">{String(insight)}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GenericAgentViewer;
