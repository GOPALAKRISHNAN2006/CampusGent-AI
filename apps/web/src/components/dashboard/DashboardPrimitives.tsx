import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const DashboardHero: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: { label: string; href: string };
  children?: React.ReactNode;
  tone?: 'indigo' | 'teal' | 'slate';
}> = ({ eyebrow, title, description, icon: Icon = Sparkles, action, children, tone = 'indigo' }) => {
  const tones = {
    indigo: 'from-[#174709] via-[#23680f] to-[#2a7c13]',
    teal: 'from-[#102f06] via-[#2a7c13] to-[#76c457]',
    slate: 'from-[#174709] via-[#23680f] to-[#5eaa43]',
  };

  return (
    <section className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tones[tone]} p-6 text-white shadow-xl shadow-[#2a7c13]/20 sm:p-8`}>
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            <Icon className="h-3.5 w-3.5 text-cyan-200" />
            {eyebrow}
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">{description}</p>
          {action && (
            <Link to={action.href} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fff8cf] px-4 py-2.5 text-xs font-bold text-[#174709] transition hover:bg-white">
              {action.label}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {children && <div className="relative shrink-0">{children}</div>}
      </div>
    </section>
  );
};

export const DashboardStat: React.FC<{
  label: string;
  value: React.ReactNode;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}> = ({ label, value, detail, icon: Icon, tone = 'indigo' }) => {
  const tones = {
    indigo: 'bg-[#fff8cf] text-[#2a7c13] ring-[#fbe6c2]',
    emerald: 'bg-[#eef8e8] text-[#2a7c13] ring-[#cfe9c4]',
    amber: 'bg-[#fff8cf] text-[#7a5a16] ring-[#fbe6c2]',
    rose: 'bg-[#fbe6c2] text-[#8a4d1d] ring-[#edc98c]',
    cyan: 'bg-[#eef8e8] text-[#23680f] ring-[#cfe9c4]',
  };

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{value}</p>
          {detail && <p className="mt-1 text-[11px] font-medium text-slate-500">{detail}</p>}
        </div>
        <div className={twMerge('rounded-xl p-3 ring-1', tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export const DashboardSectionTitle: React.FC<{
  eyebrow: string;
  title: string;
  action?: { label: string; href: string };
}> = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">{title}</h2>
    </div>
    {action && <Link to={action.href} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">{action.label} →</Link>}
  </div>
);

export const DashboardChecklist: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <span>{item}</span>
      </div>
    ))}
  </div>
);
