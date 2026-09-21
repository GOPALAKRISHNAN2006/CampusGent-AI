import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@campusgent/shared';
import type { LoginInput } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setApiError(null);
    try {
      await login(data);
      navigate('/');
    } catch (err: any) {
      setApiError(err.response?.data?.error?.message || 'Login failed, check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-[#fff8cf] shadow-2xl shadow-[#174709]/30 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#102f06] via-[#23680f] to-[#2a7c13] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#76c457]/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#fbe6c2]/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
                <Sparkles className="h-6 w-6 text-indigo-200" />
              </div>
              <div>
                <p className="text-sm font-black tracking-[0.24em]">CAMPUSGENT</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fff8cf]/80">Intelligence platform</p>
              </div>
            </div>
            <div className="mt-20 max-w-lg">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#fff8cf]">Your next opportunity starts here</p>
              <h2 className="text-4xl font-black leading-tight xl:text-5xl">Turn potential into a placement plan.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#fff8cf]/80">
                One connected workspace for academic momentum, career readiness, AI coaching, and campus opportunities.
              </p>
            </div>
          </div>
          <div className="relative grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: Target, label: 'Personalized paths' },
              { icon: Users, label: 'Mentor visibility' },
              { icon: ShieldCheck, label: 'Audited AI' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-xs font-semibold text-indigo-50">
                <Icon className="h-4 w-4 text-[#fff8cf]" />
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                <Sparkles className="h-6 w-6 text-indigo-300" />
              </div>
              <p className="text-xs font-black tracking-[0.2em] text-indigo-700">CAMPUSGENT AI</p>
            </div>
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2a7c13]">Student success command center</p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue building your evidence-backed career story.</p>
            </div>

        {apiError && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@university.edu"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="mt-2 w-full gap-2 rounded-xl bg-[#2a7c13] py-3 font-bold shadow-lg shadow-[#2a7c13]/20 hover:bg-[#23680f]" isLoading={isSubmitting}>
            Sign in securely <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          Your session is protected with secure token rotation
        </div>
        <p className="mt-6 text-center text-xs text-brand-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Register Here
          </Link>
        </p>
          </div>
        </section>
      </div>
    </div>
  );
};
