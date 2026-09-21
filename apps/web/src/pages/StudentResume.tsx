import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  FileDown,
  Edit,
  Sparkles
} from 'lucide-react';

export const StudentResume: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/students/profile');
        setProfile(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

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
      
      // Update student profile with mockup resume URL if saved successfully
      if (res.data.data.resumeUrl) {
        setProfile(prev => prev ? { ...prev, resumeUrl: res.data.data.resumeUrl } : null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-500" />
            <span>AI Resume Optimization Workspace</span>
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            Optimize your resume structure, test parser-friendliness, and scan for target keyword alignments.
          </p>
        </div>

        {/* Existing Resume Stats */}
        {profile?.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-200 hover:bg-brand-50 text-xs font-semibold rounded-lg text-brand-700 transition-colors bg-white shadow-sm"
          >
            <FileDown className="h-4 w-4 text-brand-500" />
            <span>Download Active Resume</span>
          </a>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side: Upload & Input (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Option A: Upload Resume PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-brand-200 hover:border-indigo-400 bg-brand-50/20 hover:bg-indigo-50/10 p-6 rounded-xl text-center cursor-pointer transition-colors space-y-2.5"
              >
                <UploadCloud className="h-8 w-8 text-brand-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-brand-900">
                    {file ? file.name : 'Choose file or drag & drop'}
                  </p>
                  <p className="text-[10px] text-brand-400">PDF documents only, max size 5MB.</p>
                </div>
              </div>

              <Button
                onClick={handleAnalyzeFile}
                disabled={!file || loading}
                isLoading={loading && !!file}
                className="w-full text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Analyze PDF File</span>
              </Button>
            </CardContent>
          </Card>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-200"></div>
            </div>
            <span className="relative bg-brand-50 px-3 text-[10px] font-bold uppercase text-brand-400">OR</span>
          </div>

          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Option B: Paste Plain Text Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                placeholder="Paste your plain-text resume description, layout sections, or markdown here..."
                className="w-full p-3 border border-brand-200 rounded-lg bg-gray-50 text-[11px] font-mono text-brand-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
              <Button
                onClick={handleAnalyzeText}
                disabled={!resumeText.trim() || loading}
                isLoading={loading && !file}
                className="w-full text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Analyze Paste Text</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Feedback Scorecard (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {!analysis && !loading && (
            <Card className="border border-brand-200/60 shadow-sm p-12 text-center text-xs text-brand-500">
              <CardContent className="space-y-3">
                <FileText className="h-10 w-10 mx-auto text-brand-300" />
                <h3 className="font-bold text-brand-900 text-sm">Feedback Scorecard Ready</h3>
                <p className="max-w-md mx-auto text-brand-500 leading-relaxed">
                  Provide your resume PDF or text to trigger structural checking. The AI will scan formatting, calculate keyword matches, and yield ATS readability recommendations.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="border border-brand-200/60 shadow-sm p-12 text-center">
              <CardContent className="space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-xs font-semibold text-brand-600">AI Resume Analyzer is parsing section hierarchies...</p>
              </CardContent>
            </Card>
          )}

          {analysis && !loading && (
            <div className="space-y-6 animate-fade-in text-xs">
              {/* Score card banner */}
              <Card className="border-indigo-100 bg-indigo-50/10 shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-brand-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      <span>ATS Compatibility Score</span>
                    </h3>
                    <p className="text-brand-500 text-[11px] mt-0.5">Calculated using industry-standard parsing criteria.</p>
                  </div>
                  <div className={`p-4 rounded-xl text-lg font-black shrink-0 ${
                    analysis.score >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {analysis.score || '78'}/100
                  </div>
                </CardContent>
              </Card>

              {/* Strengths / Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-green-50/20 border border-green-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-green-700 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-brand-700 leading-relaxed">
                    {(analysis.strengths || []).map((str: string, idx: number) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-50/20 border border-red-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-red-700 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Formatting Weaknesses</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-brand-700 leading-relaxed">
                    {(analysis.weaknesses || []).map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords */}
              <Card className="border border-brand-200/60 shadow-sm">
                <CardHeader className="py-2.5">
                  <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Recommended Keywords Gaps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5 py-3">
                  {(analysis.missingKeywords || []).length > 0 ? (
                    (analysis.missingKeywords || []).map((k: string) => (
                      <Badge key={k} variant="danger" className="text-[10px] uppercase">
                        {k}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-brand-400 italic">No missing keywords found. Excelent!</span>
                  )}
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border border-brand-200/60 shadow-sm">
                <CardHeader className="py-2.5">
                  <CardTitle className="text-xs font-bold text-brand-900">Tailoring Suggestions & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 py-3 leading-relaxed text-brand-700">
                  {(analysis.suggestions || []).map((s: string, idx: number) => (
                    <p key={idx}>{idx + 1}. {s}</p>
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
export default StudentResume;
