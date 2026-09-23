import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, UserRole } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Sparkles } from 'lucide-react';
export const Register = () => {
    const { registerUser } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            role: UserRole.STUDENT,
        },
    });
    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await registerUser(data);
            navigate('/login');
        }
        catch (err) {
            setApiError(err.response?.data?.error?.message || 'Registration failed.');
        }
    };
    const roleOptions = [
        { value: UserRole.STUDENT, label: 'Student' },
        { value: UserRole.FACULTY, label: 'Faculty Mentor' },
        { value: UserRole.PLACEMENT_OFFICER, label: 'Placement Officer' },
    ];
    return (_jsx("div", { className: "min-h-screen bg-brand-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md bg-white border border-brand-200 shadow-lg rounded-2xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex p-3 bg-brand-900 text-white rounded-full mb-3", children: _jsx(Sparkles, { className: "h-6 w-6 animate-pulse text-indigo-400" }) }), _jsx("h1", { className: "text-2xl font-bold text-brand-900", children: "Create Account" }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Get started with CampusGent AI Platform" })] }), apiError && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg", children: apiError })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(Input, { label: "Full Name", type: "text", placeholder: "John Doe", error: errors.name?.message, ...register('name') }), _jsx(Input, { label: "Email Address", type: "email", placeholder: "john@university.edu", error: errors.email?.message, ...register('email') }), _jsx(Input, { label: "Password", type: "password", placeholder: "Min. 8 characters", error: errors.password?.message, ...register('password') }), _jsx(Select, { label: "I am registering as a", options: roleOptions, error: errors.role?.message, ...register('role') }), _jsx(Button, { type: "submit", className: "w-full py-2.5 mt-2", isLoading: isSubmitting, children: "Sign Up" })] }), _jsxs("p", { className: "text-center text-xs text-brand-500 mt-6", children: ["Already registered?", ' ', _jsx(Link, { to: "/login", className: "font-semibold text-brand-700 hover:underline", children: "Login Here" })] })] }) }));
};
