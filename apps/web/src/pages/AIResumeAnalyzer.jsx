import React, { useState, useRef } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    FileText, CheckCircle, XCircle, AlertCircle, RefreshCw,
    UploadCloud, Sparkles, ArrowRight, ShieldCheck, FileCheck, Layers
} from 'lucide-react';

export const AIResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleAnalyzeText = async () => {
        if (!resumeText.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/resume-analyzer', { resumeText });
            setAnalysis(res.data.data?.insight || res.data.data);
        } catch (err) {
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
            setAnalysis(res.data.data?.insight || res.data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto text-xs animate-fade-in font-sans text-palette-espresso">
            {/* Header Hero Banner with Double-Bezel ambient look */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze p-6 sm:p-8 text-white border border-palette-bronze/40 shadow-bezel-dark">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-palette-sandstone/10 blur-3xl" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-espresso/90 border border-palette-sandstone/30 text-[10px] font-bold uppercase tracking-[0.16em] text-palette-sandstone shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-palette-sandstone animate-pulse" />
                        <span>Autonomous ATS Optimizer</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
                        <FileText className="h-7 w-7 text-palette-sandstone" />
                        <span>AI Resume & ATS Structure Analyzer</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-palette-sandstone/85 max-w-2xl font-normal leading-relaxed">
                        Upload your PDF resume or paste markdown to evaluate recruiter ATS compatibility, keyword density, section weighting, and compliance benchmarks.
                    </p>
                </div>
            </div>

            {/* 2 Column Grid: Upload on Left, Feedback on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: PDF Upload or Paste */}
                <div className="space-y-5">
                    {/* Option 1: PDF Upload Card */}
                    <div className="double-bezel p-1">
                        <div className="double-bezel-inner p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold uppercase text-palette-espresso/60 tracking-[0.16em]">
                                    Option 1: Upload Resume PDF
                                </h3>
                                <Badge variant="sandstone" size="xs">Recommended</Badge>
                            </div>

                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-palette-sandstone hover:border-palette-bronze p-7 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-palette-sandstone-canvas/40 hover:bg-palette-sandstone-light/50 group"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-palette-sandstone-light text-palette-bronze flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-palette-sandstone/80 shadow-xs">
                                    <UploadCloud className="h-6 w-6 text-palette-bronze" />
                                </div>
                                <p className="font-bold text-palette-espresso text-xs">
                                    {file ? file.name : "Click to browse or drop resume PDF"}
                                </p>
                                <p className="text-[11px] text-palette-espresso/50 mt-1">
                                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports standard PDF documents up to 10MB"}
                                </p>
                            </div>

                            <Button
                                onClick={handleAnalyzeFile}
                                disabled={!file}
                                isLoading={loading && !!file}
                                variant="primary"
                                trailingIcon={ArrowRight}
                                className="w-full py-2.5 justify-center shadow-bezel-inner"
                            >
                                Analyze Resume PDF
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-palette-espresso/40">
                        <div className="h-px bg-palette-sandstone/70 flex-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-palette-espresso/60">OR PASTE TEXT</span>
                        <div className="h-px bg-palette-sandstone/70 flex-1" />
                    </div>

                    {/* Option 2: Paste Content */}
                    <div className="double-bezel p-1">
                        <div className="double-bezel-inner p-5 space-y-4">
                            <h3 className="text-[10px] font-bold uppercase text-palette-espresso/60 tracking-[0.16em]">
                                Option 2: Paste Resume Content
                            </h3>
                            <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                rows={7}
                                placeholder="Paste plain-text or markdown resume summary here..."
                                className="w-full p-4 border border-palette-sandstone/90 rounded-2xl bg-white text-xs font-mono text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] transition-all leading-relaxed"
                            />
                            <Button
                                onClick={handleAnalyzeText}
                                disabled={!resumeText.trim()}
                                isLoading={loading && !file}
                                variant="secondary"
                                trailingIcon={ArrowRight}
                                className="w-full py-2.5 justify-center"
                            >
                                Analyze Text Content
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Analysis Feedback */}
                <div className="space-y-4">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl shadow-sm">
                            {error}
                        </div>
                    )}

                    {!analysis && !loading && (
                        <div className="double-bezel p-1 h-full min-h-[380px]">
                            <div className="double-bezel-inner h-full flex flex-col items-center justify-center p-8 text-center text-palette-espresso/60">
                                <div className="h-14 w-14 rounded-2xl bg-palette-sandstone-light text-palette-bronze flex items-center justify-center mb-3 border border-palette-sandstone">
                                    <FileCheck className="h-7 w-7 text-palette-bronze" />
                                </div>
                                <h3 className="font-black text-palette-espresso text-sm">
                                    No Analysis Generated Yet
                                </h3>
                                <p className="text-xs text-palette-espresso/60 max-w-xs mt-1 leading-relaxed">
                                    Upload your PDF or paste resume text on the left to view ATS compatibility scores, keyword density, and optimization suggestions.
                                </p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="double-bezel p-1">
                            <div className="double-bezel-inner flex flex-col items-center justify-center p-14 space-y-4 text-center">
                                <RefreshCw className="h-8 w-8 animate-spin text-palette-bronze" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-palette-espresso">
                                        Parsing & Auditing Resume
                                    </p>
                                    <p className="text-xs text-palette-espresso/60">
                                        Scanning against enterprise ATS filters and keyword matrices...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {analysis && !loading && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Overall Score Card */}
                            <div className="double-bezel p-1">
                                <div className="double-bezel-inner p-5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                            <ShieldCheck className="h-3 w-3" />
                                            <span>ATS Compatibility Score</span>
                                        </div>
                                        <h3 className="text-sm font-black text-palette-espresso">
                                            Parser Compatibility Result
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-3xl font-black tabular-nums ${
                                            (analysis.score || 85) >= 80 ? 'text-emerald-700' : 'text-amber-700'
                                        }`}>
                                            {analysis.score || 85}
                                            <span className="text-xs font-normal text-palette-espresso/40"> / 100</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Strengths Card */}
                            {analysis.strengths && analysis.strengths.length > 0 && (
                                <Card bezel={true} className="bg-white/95">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                                            <span>Resume Strengths</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 py-3.5">
                                        {analysis.strengths.map((str, i) => (
                                            <div key={i} className="text-palette-espresso/85 leading-relaxed text-xs flex items-start gap-2">
                                                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                                                <span>{str}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Weaknesses Card */}
                            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                                <Card bezel={true} className="bg-white/95">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="flex items-center gap-1.5 text-rose-800 text-xs font-bold">
                                            <XCircle className="h-4 w-4 text-rose-600" />
                                            <span>Formatting Weaknesses</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 py-3.5">
                                        {analysis.weaknesses.map((w, i) => (
                                            <div key={i} className="text-palette-espresso/85 leading-relaxed text-xs flex items-start gap-2">
                                                <span className="text-rose-600 font-bold mt-0.5">!</span>
                                                <span>{w}</span>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Missing Keywords Card */}
                            {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                                <Card bezel={true} className="bg-white/95">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="flex items-center gap-1.5 text-palette-espresso text-xs font-bold">
                                            <AlertCircle className="h-4 w-4 text-palette-bronze" />
                                            <span>Target Missing Keywords</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-1.5 py-3.5">
                                        {analysis.missingKeywords.map((k) => (
                                            <Badge key={k} variant="bronze" size="sm">
                                                {k}
                                            </Badge>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Suggestions / Action items */}
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <Card bezel={true} className="bg-white/95">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="text-palette-espresso text-xs font-bold flex items-center gap-1.5">
                                            <Sparkles className="h-4 w-4 text-palette-bronze" />
                                            <span>Proactive AI Recommendations</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2.5 py-3.5 text-xs">
                                        {analysis.suggestions.map((s, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-palette-espresso/85 leading-relaxed">
                                                <span className="h-5 w-5 rounded-full bg-palette-sandstone-light text-palette-bronze font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-palette-sandstone tabular-nums">
                                                    {i + 1}
                                                </span>
                                                <p>{s}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIResumeAnalyzer;
