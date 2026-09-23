import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { GraduationCap, BrainCircuit, RefreshCw, Send, CheckCircle } from 'lucide-react';
export const AIMockInterview = () => {
    const [step, setStep] = useState('setup');
    const [role, setRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState('');
    const [qaList, setQaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [error, setError] = useState(null);
    const startInterview = async () => {
        if (!role.trim() || loading)
            return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/interview-prep', { role, jobDescription });
            setQuestions(res.data.data.questions);
            setQaList([]);
            setCurrentIdx(0);
            setStep('interview');
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to start interview prep.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAnswerSubmit = async () => {
        if (!answer.trim() || loading)
            return;
        const currentQuestion = questions[currentIdx].question;
        const newQaList = [...qaList, { question: currentQuestion, answer }];
        setQaList(newQaList);
        setAnswer('');
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
        else {
            // Evaluate interview
            setLoading(true);
            setStep('evaluation');
            try {
                const res = await apiClient.post('/ai/mock-interview/evaluate', { qaList: newQaList });
                setEvaluation(res.data.data.insight);
            }
            catch (err) {
                setError(err.response?.data?.error?.message || 'Failed to evaluate interview.');
            }
            finally {
                setLoading(false);
            }
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-3xl mx-auto", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "AI Conversational Mock Interview" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Simulate a technical or HR interview session for your target vacancy and receive structural scorecards." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg", children: error })), step === 'setup' && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Interview Parameters Configuration" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Input, { label: "Target Job Role / Title", value: role, onChange: (e) => setRole(e.target.value), placeholder: "e.g. Frontend Engineer, Graduate Trainee, Java Dev", required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1", children: "Target Job Description (Optional)" }), _jsx("textarea", { value: jobDescription, onChange: (e) => setJobDescription(e.target.value), rows: 5, placeholder: "Paste key duties, tech skills, and criteria here to generate highly aligned questions...", className: "w-full p-3 border border-brand-200 rounded-lg text-sm bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm" })] }), _jsxs(Button, { onClick: startInterview, disabled: !role.trim(), isLoading: loading, className: "w-full py-2.5 flex gap-2 justify-center", children: [_jsx(BrainCircuit, { className: "h-4 w-4" }), _jsx("span", { children: "Generate Questions & Start Interview" })] })] })] })), step === 'interview' && questions.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-brand-500", children: [_jsxs("span", { children: ["ROLE: ", role] }), _jsxs("span", { children: ["QUESTION ", currentIdx + 1, " OF ", questions.length] })] }), _jsx(Card, { className: "border-indigo-100 bg-indigo-50/20", children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("span", { className: "text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded", children: [questions[currentIdx].type, " QUESTION"] }), _jsx("p", { className: "text-brand-900 font-semibold text-base mt-2", children: questions[currentIdx].question }), questions[currentIdx].criteria && (_jsxs("p", { className: "text-xs text-brand-400 italic mt-1.5", children: ["Guidance: ", questions[currentIdx].criteria] }))] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-xs font-semibold text-brand-700 uppercase tracking-wider", children: "Your Answer / Response" }), _jsx("textarea", { value: answer, onChange: (e) => setAnswer(e.target.value), rows: 6, placeholder: "Type your response explanation in detail...", className: "w-full p-4 border border-brand-200 rounded-xl bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm" }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { onClick: handleAnswerSubmit, disabled: !answer.trim(), className: "px-6 flex gap-2", children: [_jsx("span", { children: currentIdx < questions.length - 1 ? 'Next Question' : 'Submit for Evaluation' }), _jsx(Send, { className: "h-4 w-4" })] }) })] })] })), step === 'evaluation' && (_jsxs("div", { className: "space-y-6", children: [loading && (_jsxs("div", { className: "flex flex-col items-center justify-center p-12 space-y-4", children: [_jsx(RefreshCw, { className: "h-10 w-10 animate-spin text-brand-600" }), _jsx("p", { className: "text-sm font-semibold text-brand-700", children: "Recruiter Agent compiling scorecards..." })] })), evaluation && (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "border-green-100 bg-green-50/20", children: _jsxs(CardContent, { className: "flex items-center justify-between p-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-brand-900 font-bold text-lg", children: "Interview Evaluation Completed" }), _jsx("p", { className: "text-xs text-brand-500 mt-0.5", children: "Scored by AI Platform Recruiter Service." })] }), _jsxs("div", { className: "text-right", children: [_jsxs("span", { className: "text-2xl font-black text-green-700", children: [evaluation.overallScore, "/100"] }), _jsxs("p", { className: "text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1", children: ["GRADE: ", evaluation.grade] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsx(CardTitle, { className: "font-semibold text-brand-800 text-xs", children: "Communication Review" }) }), _jsx(CardContent, { className: "text-brand-700 leading-relaxed py-3", children: evaluation.communication })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsx(CardTitle, { className: "font-semibold text-brand-800 text-xs", children: "Technical Accuracy Review" }) }), _jsx(CardContent, { className: "text-brand-700 leading-relaxed py-3", children: evaluation.accuracy })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "py-2.5", children: _jsxs(CardTitle, { className: "font-semibold text-brand-800 text-xs flex items-center gap-1", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx("span", { children: "Suggestions & Actionable Next Steps" })] }) }), _jsx(CardContent, { className: "text-xs text-brand-700 leading-relaxed py-3", children: evaluation.feedback })] }), _jsx(Button, { onClick: () => setStep('setup'), variant: "secondary", className: "w-full py-2.5 mt-2", children: "Practice Another Mock Session" })] }))] }))] }));
};
