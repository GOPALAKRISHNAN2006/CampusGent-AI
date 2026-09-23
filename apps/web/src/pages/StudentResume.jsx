import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, UploadCloud, FileDown, Sparkles } from 'lucide-react';
export const StudentResume = () => {
    const [profile, setProfile] = useState(null);
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get('/students/profile');
                setProfile(res.data.data);
            }
            catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);
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
            // Update student profile with mockup resume URL if saved successfully
            if (res.data.data.resumeUrl) {
                setProfile(prev => prev ? { ...prev, resumeUrl: res.data.data.resumeUrl } : null);
            }
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(FileText, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "AI Resume Optimization Workspace" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Optimize your resume structure, test parser-friendliness, and scan for target keyword alignments." })] }), profile?.resumeUrl && (_jsxs("a", { href: profile.resumeUrl, target: "_blank", rel: "noopener noreferrer", className: "self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-200 hover:bg-brand-50 text-xs font-semibold rounded-lg text-brand-700 transition-colors bg-white shadow-sm", children: [_jsx(FileDown, { className: "h-4 w-4 text-brand-500" }), _jsx("span", { children: "Download Active Resume" })] }))] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 shrink-0" }), _jsx("p", { children: error })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6 items-start", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: "Option A: Upload Resume PDF" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("input", { type: "file", accept: ".pdf", className: "hidden", ref: fileInputRef, onChange: (e) => setFile(e.target.files?.[0] || null) }), _jsxs("div", { onClick: () => fileInputRef.current?.click(), className: "border-2 border-dashed border-brand-200 hover:border-indigo-400 bg-brand-50/20 hover:bg-indigo-50/10 p-6 rounded-xl text-center cursor-pointer transition-colors space-y-2.5", children: [_jsx(UploadCloud, { className: "h-8 w-8 text-brand-400 mx-auto" }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-bold text-brand-900", children: file ? file.name : 'Choose file or drag & drop' }), _jsx("p", { className: "text-[10px] text-brand-400", children: "PDF documents only, max size 5MB." })] })] }), _jsxs(Button, { onClick: handleAnalyzeFile, disabled: !file || loading, isLoading: loading && !!file, className: "w-full text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), _jsx("span", { children: "Analyze PDF File" })] })] })] }), _jsxs("div", { className: "relative text-center", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-brand-200" }) }), _jsx("span", { className: "relative bg-brand-50 px-3 text-[10px] font-bold uppercase text-brand-400", children: "OR" })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: "Option B: Paste Plain Text Resume" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx("textarea", { value: resumeText, onChange: (e) => setResumeText(e.target.value), rows: 10, placeholder: "Paste your plain-text resume description, layout sections, or markdown here...", className: "w-full p-3 border border-brand-200 rounded-lg bg-gray-50 text-[11px] font-mono text-brand-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" }), _jsxs(Button, { onClick: handleAnalyzeText, disabled: !resumeText.trim() || loading, isLoading: loading && !file, className: "w-full text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), _jsx("span", { children: "Analyze Paste Text" })] })] })] })] }), _jsxs("div", { className: "lg:col-span-3 space-y-6", children: [!analysis && !loading && (_jsx(Card, { className: "border border-brand-200/60 shadow-sm p-12 text-center text-xs text-brand-500", children: _jsxs(CardContent, { className: "space-y-3", children: [_jsx(FileText, { className: "h-10 w-10 mx-auto text-brand-300" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "Feedback Scorecard Ready" }), _jsx("p", { className: "max-w-md mx-auto text-brand-500 leading-relaxed", children: "Provide your resume PDF or text to trigger structural checking. The AI will scan formatting, calculate keyword matches, and yield ATS readability recommendations." })] }) })), loading && (_jsx(Card, { className: "border border-brand-200/60 shadow-sm p-12 text-center", children: _jsxs(CardContent, { className: "space-y-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto" }), _jsx("p", { className: "text-xs font-semibold text-brand-600", children: "AI Resume Analyzer is parsing section hierarchies..." })] }) })), analysis && !loading && (_jsxs("div", { className: "space-y-6 animate-fade-in text-xs", children: [_jsx(Card, { className: "border-indigo-100 bg-indigo-50/10 shadow-sm", children: _jsxs(CardContent, { className: "p-5 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-bold text-brand-900 flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "h-4 w-4 text-indigo-500" }), _jsx("span", { children: "ATS Compatibility Score" })] }), _jsx("p", { className: "text-brand-500 text-[11px] mt-0.5", children: "Calculated using industry-standard parsing criteria." })] }), _jsxs("div", { className: `p-4 rounded-xl text-lg font-black shrink-0 ${analysis.score >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`, children: [analysis.score || '78', "/100"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { className: "p-4 bg-green-50/20 border border-green-100 rounded-xl space-y-2", children: [_jsxs("h4", { className: "font-bold text-green-700 flex items-center gap-1.5", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx("span", { children: "Identified Strengths" })] }), _jsx("ul", { className: "list-disc pl-4 space-y-1 text-brand-700 leading-relaxed", children: (analysis.strengths || []).map((str, idx) => (_jsx("li", { children: str }, idx))) })] }), _jsxs("div", { className: "p-4 bg-red-50/20 border border-red-100 rounded-xl space-y-2", children: [_jsxs("h4", { className: "font-bold text-red-700 flex items-center gap-1.5", children: [_jsx(XCircle, { className: "h-4 w-4 text-red-600" }), _jsx("span", { children: "Formatting Weaknesses" })] }), _jsx("ul", { className: "list-disc pl-4 space-y-1 text-brand-700 leading-relaxed", children: (analysis.weaknesses || []).map((w, idx) => (_jsx("li", { children: w }, idx))) })] })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "py-2.5", children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-amber-500" }), _jsx("span", { children: "Recommended Keywords Gaps" })] }) }), _jsx(CardContent, { className: "flex flex-wrap gap-1.5 py-3", children: (analysis.missingKeywords || []).length > 0 ? ((analysis.missingKeywords || []).map((k) => (_jsx(Badge, { variant: "danger", className: "text-[10px] uppercase", children: k }, k)))) : (_jsx("span", { className: "text-brand-400 italic", children: "No missing keywords found. Excelent!" })) })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "py-2.5", children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-900", children: "Tailoring Suggestions & Recommendations" }) }), _jsx(CardContent, { className: "space-y-2 py-3 leading-relaxed text-brand-700", children: (analysis.suggestions || []).map((s, idx) => (_jsxs("p", { children: [idx + 1, ". ", s] }, idx))) })] })] }))] })] })] }));
};
export default StudentResume;
