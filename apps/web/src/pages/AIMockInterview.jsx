import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    BrainCircuit, Send, CheckCircle2, Sparkles, ArrowRight,
    Mic, Video, CheckCircle, RefreshCw, Layers, Award, Terminal
} from 'lucide-react';

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
        if (!role.trim() || loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/interview-prep', { role, jobDescription });
            setQuestions(res.data.data?.questions || []);
            setQaList([]);
            setCurrentIdx(0);
            setStep('interview');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to start interview prep.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!answer.trim() || loading) return;
        const currentQuestion = questions[currentIdx].question;
        const newQaList = [...qaList, { question: currentQuestion, answer }];
        setQaList(newQaList);
        setAnswer('');
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            setLoading(true);
            setStep('evaluation');
            try {
                const res = await apiClient.post('/ai/mock-interview/evaluate', { qaList: newQaList });
                setEvaluation(res.data.data?.insight || res.data.data);
            } catch (err) {
                setError(err.response?.data?.error?.message || 'Failed to evaluate interview.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto text-xs animate-fade-in font-sans text-palette-espresso">
            {/* Header Hero Banner with Double-Bezel ambient look */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze p-6 sm:p-8 text-white border border-palette-bronze/40 shadow-bezel-dark">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-palette-sandstone/10 blur-3xl" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-espresso/90 border border-palette-sandstone/30 text-[10px] font-bold uppercase tracking-[0.16em] text-palette-sandstone shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-palette-sandstone animate-pulse" />
                        <span>AI Technical & HR Simulator</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
                        <BrainCircuit className="h-7 w-7 text-palette-sandstone" />
                        <span>AI Conversational Mock Interview</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-palette-sandstone/85 max-w-2xl font-normal leading-relaxed">
                        Practice realistic technical, architectural, and behavioral rounds tailored to your target job profile. Get automated grading and actionable recruiter scorecards.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50/90 border border-rose-200/80 text-rose-800 font-semibold rounded-2xl animate-fade-in shadow-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    <span>{error}</span>
                </div>
            )}

            {/* Step 1: Setup */}
            {step === 'setup' && (
                <Card bezel={true} className="bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-4">
                        <CardTitle className="text-palette-espresso text-sm font-bold flex items-center gap-2">
                            <Layers className="h-4 w-4 text-palette-bronze" />
                            <span>Interview Configuration & Role Parameters</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 p-6">
                        <Input
                            label="Target Job Role / Title"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Full Stack Developer, SDE-1, Cloud Architecture Associate"
                            required={true}
                        />

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-palette-espresso tracking-wide">
                                Target Job Description or Key Tech Requirements (Optional)
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                rows={5}
                                placeholder="Paste required tech stack, responsibilities, or company criteria to tailor questions..."
                                className="w-full p-4 border border-palette-sandstone/90 rounded-2xl bg-palette-sandstone-canvas/50 text-xs text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] transition-all"
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={startInterview}
                                disabled={!role.trim()}
                                isLoading={loading}
                                variant="primary"
                                trailingIcon={ArrowRight}
                                className="w-full py-3 justify-center shadow-bezel-inner"
                            >
                                Generate Questions & Begin Interview
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Live Interview Session */}
            {step === 'interview' && questions.length > 0 && (
                <div className="space-y-5 animate-fade-in">
                    {/* Status Ribbon */}
                    <div className="double-bezel p-1">
                        <div className="double-bezel-inner p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-palette-espresso">
                            <div className="flex items-center gap-2">
                                <span className="text-palette-espresso/60 text-[10px] uppercase tracking-wider">Target:</span>
                                <span className="bg-palette-sandstone-light px-2.5 py-1 rounded-lg border border-palette-sandstone/60">{role}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-palette-espresso/60 text-[10px] uppercase tracking-wider">Progress:</span>
                                <Badge variant="bronze" size="sm" className="tabular-nums">
                                    Question {currentIdx + 1} of {questions.length}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <Card bezel={true} className="bg-palette-sandstone-light/30">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="bronze" size="xs" dot={true}>
                                    {`${questions[currentIdx].type || 'TECHNICAL'} ROUND`}
                                </Badge>
                                <span className="text-[10px] uppercase font-bold text-palette-bronze tracking-widest">
                                    Simulated Evaluator
                                </span>
                            </div>

                            <p className="text-palette-espresso font-black text-base sm:text-lg leading-relaxed">
                                {questions[currentIdx].question}
                            </p>

                            {questions[currentIdx].criteria && (
                                <div className="p-3 bg-white/80 rounded-xl border border-palette-sandstone/60 text-[11px] text-palette-espresso/70 italic">
                                    <span className="font-bold text-palette-bronze not-italic mr-1">Evaluation Focus:</span>
                                    {questions[currentIdx].criteria}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Answer Response Area */}
                    <div className="double-bezel p-1">
                        <div className="double-bezel-inner p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-palette-espresso tracking-wide flex items-center gap-1.5">
                                    <Terminal className="h-4 w-4 text-palette-bronze" />
                                    <span>Your Technical Answer / Explanation</span>
                                </label>
                                <span className="text-[10px] text-palette-espresso/50 font-mono">
                                    {answer.length} characters
                                </span>
                            </div>

                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows={7}
                                placeholder="Structure your answer clearly: 1. Core Principle, 2. Practical Implementation, 3. Trade-offs..."
                                className="w-full p-4 border border-palette-sandstone/80 rounded-2xl bg-white text-xs font-mono text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)] transition-all leading-relaxed"
                            />

                            <div className="flex justify-end pt-1">
                                <Button
                                    onClick={handleAnswerSubmit}
                                    disabled={!answer.trim()}
                                    variant="primary"
                                    trailingIcon={Send}
                                    className="px-6 py-2.5"
                                >
                                    {currentIdx < questions.length - 1 ? 'Submit & Next Question' : 'Complete & Generate AI Scorecard'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Evaluation */}
            {step === 'evaluation' && (
                <div className="space-y-6 animate-fade-in">
                    {loading && (
                        <div className="double-bezel p-1">
                            <div className="double-bezel-inner flex flex-col items-center justify-center p-14 space-y-4 text-center">
                                <div className="h-14 w-14 rounded-2xl bg-palette-sandstone-light text-palette-bronze flex items-center justify-center border border-palette-sandstone shadow-sm">
                                    <RefreshCw className="h-7 w-7 animate-spin text-palette-bronze" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-black text-palette-espresso">
                                        Synthesizing Interview Performance
                                    </h3>
                                    <p className="text-xs text-palette-espresso/60 max-w-sm">
                                        AI Recruiter Agent is evaluating clarity, depth, and structured problem solving...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {evaluation && (
                        <div className="space-y-5 animate-fade-in">
                            {/* Score Overview Card */}
                            <div className="double-bezel p-1">
                                <div className="double-bezel-inner p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                            <Award className="h-3 w-3" />
                                            <span>Session Scorecard</span>
                                        </div>
                                        <h3 className="text-palette-espresso font-black text-xl">
                                            Interview Evaluation Summary
                                        </h3>
                                        <p className="text-xs text-palette-espresso/60">
                                            Evaluated across structured reasoning, technical precision, and communication.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 self-end sm:self-center">
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-palette-espresso/50 block">Score</span>
                                            <span className={`text-4xl font-black tabular-nums ${(evaluation.overallScore || 82) >= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                {evaluation.overallScore || 82}
                                                <span className="text-xs font-normal text-palette-espresso/40">/100</span>
                                            </span>
                                        </div>
                                        <div className="h-10 w-px bg-palette-sandstone" />
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-palette-espresso/50 block">Grade</span>
                                            <Badge variant="bronze" size="sm" className="font-mono text-sm px-3 py-1">
                                                {evaluation.grade || 'A'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Evaluation Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <Card bezel={true} className="bg-white/90">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="text-xs font-bold text-palette-espresso">
                                            Communication & Delivery
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-palette-espresso/80 leading-relaxed py-4">
                                        {evaluation.communication || "Clear articulate delivery with confident structure."}
                                    </CardContent>
                                </Card>

                                <Card bezel={true} className="bg-white/90">
                                    <CardHeader className="py-3 border-b border-palette-sandstone/30">
                                        <CardTitle className="text-xs font-bold text-palette-espresso">
                                            Technical Depth & Accuracy
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-palette-espresso/80 leading-relaxed py-4">
                                        {evaluation.accuracy || "Strong foundation in principles with good real-world reasoning."}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recommendations Card */}
                            <Card bezel={true} className="bg-white/90">
                                <CardHeader className="py-3.5 border-b border-palette-sandstone/30">
                                    <CardTitle className="text-xs font-bold text-palette-espresso flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <span>Actionable Recommendations for Real Rounds</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs text-palette-espresso/80 leading-relaxed py-4">
                                    {evaluation.feedback || "Continue emphasizing quantitative business impact and architectural trade-offs during system design discussions."}
                                </CardContent>
                            </Card>

                            <Button
                                onClick={() => setStep('setup')}
                                variant="secondary"
                                trailingIcon={ArrowRight}
                                className="w-full py-3 mt-2 justify-center"
                            >
                                Practice Another Mock Interview Session
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIMockInterview;
