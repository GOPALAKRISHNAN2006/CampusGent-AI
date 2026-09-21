import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, UserRole } from '@campusgent/shared';
import type { RegisterInput } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Sparkles } from 'lucide-react';

export const Register: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      role: UserRole.STUDENT,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setApiError(null);
    try {
      await registerUser(data);
      navigate('/login');
    } catch (err: any) {
      setApiError(err.response?.data?.error?.message || 'Registration failed.');
    }
  };

  const roleOptions = [
    { value: UserRole.STUDENT, label: 'Student' },
    { value: UserRole.FACULTY, label: 'Faculty Mentor' },
    { value: UserRole.PLACEMENT_OFFICER, label: 'Placement Officer' },
  ];

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-brand-200 shadow-lg rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-brand-900 text-white rounded-full mb-3">
            <Sparkles className="h-6 w-6 animate-pulse text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-brand-900">Create Account</h1>
          <p className="text-sm text-brand-500 mt-1">Get started with CampusGent AI Platform</p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@university.edu"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <Select
            label="I am registering as a"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />

          <Button type="submit" className="w-full py-2.5 mt-2" isLoading={isSubmitting}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-xs text-brand-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};
