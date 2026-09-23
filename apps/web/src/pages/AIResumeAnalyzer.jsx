import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, UploadCloud } from 'lucide-react';
export const AIResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const handleAnalyzeText = async () => {
        if (!resumeText.trim())
            return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/resume-analyzer', { resumeText });
            setAnalysis(res.data.data.insight);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze resume text.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAnalyzeFile = async () => {
        if (!file)
            return;
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('resumePdf', file);
            const res = await apiClient.post('/ai/resume-analyzer/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysis(res.data.data.insight);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(FileText, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "AI Resume Structure Analyzer" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Paste your plain-text resume content or upload a PDF to analyze formatting, keyword matches, and strengths." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-xl border border-brand-200 shadow-sm space-y-3", children: [_jsx("h3", { className: "text-xs font-bold uppercase text-brand-500 tracking-wider", children: "Option 1: Upload PDF" }), _jsx("input", { type: "file", accept: ".pdf", className: "hidden", ref: fileInputRef, onChange: (e) => setFile(e.target.files?.[0] || null) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Button, { variant: "outline", onClick: () => fileInputRef.current?.click(), className: "text-xs flex gap-2", children: [_jsx(UploadCloud, { className: "h-4 w-4" }), "Select PDF"] }), _jsx("span", { className: "text-xs text-brand-600 truncate", children: file ? file.name : 'No file selected' })] }), _jsxs(Button, { onClick: handleAnalyzeFile, disabled: !file, isLoading: loading && !!file, className: "w-full py-2 flex gap-2 justify-center bg-indigo-600 hover:bg-indigo-700 text-white", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), _jsx("span", { children: "Analyze PDF" })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-brand-400", children: [_jsx("div", { className: "h-px bg-brand-200 flex-1" }), _jsx("span", { className: "text-[10px] font-bold uppercase", children: "OR" }), _jsx("div", { className: "h-px bg-brand-200 flex-1" })] }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-brand-200 shadow-sm space-y-3", children: [_jsx("h3", { className: "text-xs font-bold uppercase text-brand-500 tracking-wider", children: "Option 2: Paste Text" }), _jsx("textarea", { value: resumeText, onChange: (e) => setResumeText(e.target.value), rows: 8, placeholder: "Paste your resume markdown or plain-text contents here...", className: "w-full p-3 border border-brand-200 rounded-lg bg-gray-50 text-xs font-mono text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500" }), _jsxs(Button, { onClick: handleAnalyzeText, disabled: !resumeText.trim(), isLoading: loading && !file, className: "w-full py-2 flex gap-2 justify-center", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), _jsx("span", { children: "Analyze Text" })] })] })] }), _jsxs("div", { className: "space-y-6", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg", children: error })), !analysis && !loading && (_jsx(Card, { className: "h-full flex items-center justify-center p-12 text-center text-xs text-brand-500", children: _jsxs(CardContent, { className: "space-y-2", children: [_jsx(FileText, { className: "h-8 w-8 mx-auto text-brand-300" }), _jsx("p", { children: "Paste resume contents and click Analyze to view feedback." })] }) })), analysis && (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "flex items-center justify-between p-5", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-bold text-brand-900", children: "Overall ATS Readability Score" }), _jsx("p", { className: "text-xs text-brand-500 mt-0.5", children: "Estimated based on standard industry templates." })] }), _jsxs("div", { className: `p-4 rounded-xl text-lg font-black ${analysis.score >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`, children: [analysis.score, "/100"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 text-xs", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsxs(CardTitle, { className: "flex items-center gap-1 text-green-700 font-semibold text-xs", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Strengths Detected" })] }) }), _jsx(CardContent, { className: "space-y-1.5 py-3", children: analysis.strengths.map((str, i) => (_jsxs("p", { className: "text-brand-700 leading-relaxed", children: ["\u2022 ", str] }, i))) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsxs(CardTitle, { className: "flex items-center gap-1 text-red-700 font-semibold text-xs", children: [_jsx(XCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Formatting Weaknesses" })] }) }), _jsx(CardContent, { className: "space-y-1.5 py-3", children: analysis.weaknesses.map((w, i) => (_jsxs("p", { className: "text-brand-700 leading-relaxed", children: ["\u2022 ", w] }, i))) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsxs(CardTitle, { className: "flex items-center gap-1 text-brand-700 font-semibold text-xs", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx("span", { children: "Target Missing Keywords" })] }) }), _jsx(CardContent, { className: "flex flex-wrap gap-1.5 py-3", children: analysis.missingKeywords.map((k) => (_jsx(Badge, { variant: "danger", children: k }, k))) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsx(CardTitle, { className: "text-brand-800 font-semibold text-xs", children: "Recommendations" }) }), _jsx(CardContent, { className: "space-y-1.5 py-3 text-xs", children: analysis.suggestions.map((s, i) => (_jsxs("p", { className: "text-brand-700 leading-relaxed", children: [i + 1, ". ", s] }, i))) })] })] }))] })] })] }));
};
