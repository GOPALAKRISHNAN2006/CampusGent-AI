import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { GraduationCap, ArrowRight, BrainCircuit, RefreshCw, Send, CheckCircle } from 'lucide-react';

export const AIMockInterview: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'interview' | 'evaluation'>('setup');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/ai/interview-prep', { role, jobDescription });
      setQuestions(res.data.data.questions);
      setQaList([]);
      setCurrentIdx(0);
      setStep('interview');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to start interview prep.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return;

    const currentQuestion = questions[currentIdx].question;
    const newQaList = [...qaList, { question: currentQuestion, answer }];
    setQaList(newQaList);
    setAnswer('');

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Evaluate interview
      setLoading(true);
      setStep('evaluation');
      try {
        const res = await apiClient.post('/ai/mock-interview/evaluate', { qaList: newQaList });
        setEvaluation(res.data.data.insight);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to evaluate interview.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-indigo-500" />
          <span>AI Conversational Mock Interview</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Simulate a technical or HR interview session for your target vacancy and receive structural scorecards.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* STEP 1: SETUP FORM */}
      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Parameters Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Target Job Role / Title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer, Graduate Trainee, Java Dev"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
                Target Job Description (Optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
                placeholder="Paste key duties, tech skills, and criteria here to generate highly aligned questions..."
                className="w-full p-3 border border-brand-200 rounded-lg text-sm bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>

            <Button
              onClick={startInterview}
              disabled={!role.trim()}
              isLoading={loading}
              className="w-full py-2.5 flex gap-2 justify-center"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Generate Questions & Start Interview</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: RUN CONVERSATION */}
      {step === 'interview' && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-500">
            <span>ROLE: {role}</span>
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
          </div>

          <Card className="border-indigo-100 bg-indigo-50/20">
            <CardContent className="p-6">
              <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {questions[currentIdx].type} QUESTION
              </span>
              <p className="text-brand-900 font-semibold text-base mt-2">
                {questions[currentIdx].question}
              </p>
              {questions[currentIdx].criteria && (
                <p className="text-xs text-brand-400 italic mt-1.5">
                  Guidance: {questions[currentIdx].criteria}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-brand-700 uppercase tracking-wider">
              Your Answer / Response
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              placeholder="Type your response explanation in detail..."
              className="w-full p-4 border border-brand-200 rounded-xl bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAnswerSubmit}
                disabled={!answer.trim()}
                className="px-6 flex gap-2"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Submit for Evaluation'}</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SCORECARD EVALUATION VIEW */}
      {step === 'evaluation' && (
        <div className="space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <RefreshCw className="h-10 w-10 animate-spin text-brand-600" />
              <p className="text-sm font-semibold text-brand-700">Recruiter Agent compiling scorecards...</p>
            </div>
          )}

          {evaluation && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card className="border-green-100 bg-green-50/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="text-brand-900 font-bold text-lg">Interview Evaluation Completed</h3>
                    <p className="text-xs text-brand-500 mt-0.5">Scored by AI Platform Recruiter Service.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-green-700">{evaluation.overallScore}/100</span>
                    <p className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1">
                      GRADE: {evaluation.grade}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detail Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <Card>
                  <CardHeader className="py-2.5">
                    <CardTitle className="font-semibold text-brand-800 text-xs">Communication Review</CardTitle>
                  </CardHeader>
                  <CardContent className="text-brand-700 leading-relaxed py-3">
                    {evaluation.communication}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2.5">
                    <CardTitle className="font-semibold text-brand-800 text-xs">Technical Accuracy Review</CardTitle>
                  </CardHeader>
                  <CardContent className="text-brand-700 leading-relaxed py-3">
                    {evaluation.accuracy}
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Suggestions */}
              <Card>
                <CardHeader className="py-2.5">
                  <CardTitle className="font-semibold text-brand-800 text-xs flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Suggestions & Actionable Next Steps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-brand-700 leading-relaxed py-3">
                  {evaluation.feedback}
                </CardContent>
              </Card>

              <Button
                onClick={() => setStep('setup')}
                variant="secondary"
                className="w-full py-2.5 mt-2"
              >
                Practice Another Mock Session
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
