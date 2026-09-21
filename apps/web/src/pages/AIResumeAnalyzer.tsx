import React, { useState, useRef } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, UploadCloud } from 'lucide-react';

export const AIResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeText = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/ai/resume-analyzer', { resumeText });
      setAnalysis(res.data.data.insight);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze resume text.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resumePdf', file);
      const res = await apiClient.post('/ai/resume-analyzer/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(res.data.data.insight);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-indigo-500" />
          <span>AI Resume Structure Analyzer</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Paste your plain-text resume content or upload a PDF to analyze formatting, keyword matches, and strengths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase text-brand-500 tracking-wider">Option 1: Upload PDF</h3>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()} 
                className="text-xs flex gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                Select PDF
              </Button>
              <span className="text-xs text-brand-600 truncate">{file ? file.name : 'No file selected'}</span>
            </div>
            <Button
              onClick={handleAnalyzeFile}
              disabled={!file}
              isLoading={loading && !!file}
              className="w-full py-2 flex gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Analyze PDF</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 text-brand-400">
            <div className="h-px bg-brand-200 flex-1"></div>
            <span className="text-[10px] font-bold uppercase">OR</span>
            <div className="h-px bg-brand-200 flex-1"></div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-brand-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase text-brand-500 tracking-wider">Option 2: Paste Text</h3>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              placeholder="Paste your resume markdown or plain-text contents here..."
              className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50 text-xs font-mono text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button
              onClick={handleAnalyzeText}
              disabled={!resumeText.trim()}
              isLoading={loading && !file}
              className="w-full py-2 flex gap-2 justify-center"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Analyze Text</span>
            </Button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          {!analysis && !loading && (
            <Card className="h-full flex items-center justify-center p-12 text-center text-xs text-brand-500">
              <CardContent className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-brand-300" />
                <p>Paste resume contents and click Analyze to view feedback.</p>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Score Card */}
              <Card>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-sm font-bold text-brand-900">Overall ATS Readability Score</h3>
                    <p className="text-xs text-brand-500 mt-0.5">Estimated based on standard industry templates.</p>
                  </div>
                  <div className={`p-4 rounded-xl text-lg font-black ${analysis.score >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {analysis.score}/100
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 gap-4 text-xs">
                <Card>
                  <CardHeader className="py-2.5">
                    <CardTitle className="flex items-center gap-1 text-green-700 font-semibold text-xs">
                      <CheckCircle className="h-4 w-4" />
                      <span>Strengths Detected</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 py-3">
                    {analysis.strengths.map((str: string, i: number) => (
                      <p key={i} className="text-brand-700 leading-relaxed">• {str}</p>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2.5">
                    <CardTitle className="flex items-center gap-1 text-red-700 font-semibold text-xs">
                      <XCircle className="h-4 w-4" />
                      <span>Formatting Weaknesses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 py-3">
                    {analysis.weaknesses.map((w: string, i: number) => (
                      <p key={i} className="text-brand-700 leading-relaxed">• {w}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Missing Keywords */}
              <Card>
                <CardHeader className="py-2.5">
                  <CardTitle className="flex items-center gap-1 text-brand-700 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <span>Target Missing Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5 py-3">
                  {analysis.missingKeywords.map((k: string) => (
                    <Badge key={k} variant="danger">{k}</Badge>
                  ))}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader className="py-2.5">
                  <CardTitle className="text-brand-800 font-semibold text-xs">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 py-3 text-xs">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <p key={i} className="text-brand-700 leading-relaxed">{i + 1}. {s}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
