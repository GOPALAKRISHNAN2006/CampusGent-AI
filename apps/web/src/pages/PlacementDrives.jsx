import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Briefcase, MapPin, DollarSign, CheckSquare, Plus, X, Calendar, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
export const PlacementDrives = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    // Create Drive Modal / Wizard state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: '',
        employmentType: 'FULL_TIME',
        salaryMin: 0,
        salaryMax: 0,
        requiredSkills: '',
        experienceRequired: 0,
        minCgpa: 6.0,
        allowedDepartments: [],
        maxBacklogsAllowed: 0,
        applicationDeadline: '',
    });
    const [activeTab, setActiveTab] = useState('ACTIVE');
    // Load drives
    const fetchDrives = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/jobs?status=${activeTab}`);
            setDrives(res.data.data.jobs || []);
        }
        catch (err) {
            setError('Failed to fetch placement drives.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDrives();
    }, [activeTab]);
    useEffect(() => {
        // Quick action trigger from header
        if (searchParams.get('create') === 'true') {
            setIsCreateOpen(true);
            // Clean query params
            setSearchParams({});
        }
    }, [searchParams]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.startsWith('salary') || name === 'experienceRequired' || name === 'minCgpa' || name === 'maxBacklogsAllowed'
                ? Number(value)
                : value
        }));
    };
    const handleStepNext = () => {
        setCurrentStep((prev) => prev + 1);
    };
    const handleStepPrev = () => {
        setCurrentStep((prev) => prev - 1);
    };
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
            const payload = {
                ...formData,
                requiredSkills: skillsArray,
            };
            await apiClient.post('/jobs', payload);
            setIsCreateOpen(false);
            // reset form
            setFormData({
                title: '',
                companyName: '',
                description: '',
                location: '',
                employmentType: 'FULL_TIME',
                salaryMin: 0,
                salaryMax: 0,
                requiredSkills: '',
                experienceRequired: 0,
                minCgpa: 6.0,
                allowedDepartments: [],
                maxBacklogsAllowed: 0,
                applicationDeadline: '',
            });
            setCurrentStep(1);
            fetchDrives();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to create drive');
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Drives" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Configure active drives, preview eligible cohorts, and review application deadlines." })] }), _jsxs(Button, { onClick: () => setIsCreateOpen(true), className: "bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 font-bold", children: [_jsx(Plus, { className: "h-4.5 w-4.5" }), _jsx("span", { children: "Create Placement Drive" })] })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx("div", { className: "flex border-b border-brand-200 gap-6 text-[11px] font-bold", children: ['ACTIVE', 'DRAFT', 'CLOSED', 'ARCHIVED'].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab), className: `pb-2.5 px-1 capitalize transition-colors ${activeTab === tab
                        ? 'border-b-2 border-indigo-600 text-indigo-650'
                        : 'text-brand-450 hover:text-brand-700'}`, children: [tab.toLowerCase(), " Drives"] }, tab))) }), loading ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-44 bg-brand-100 rounded-xl border border-brand-200" }, i))) })) : drives.length === 0 ? (_jsx(Card, { className: "text-center py-16 border border-brand-200/60 shadow-sm bg-white", children: _jsxs(CardContent, { className: "space-y-3", children: [_jsx("div", { className: "mx-auto w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center", children: _jsx(Briefcase, { className: "h-6 w-6" }) }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "No placement drives found" }), _jsx("p", { className: "text-brand-500 text-xs max-w-sm mx-auto", children: "There are no active recruitment drives registered in this category. Click the button above to launch a new placement drive." }), _jsx(Button, { onClick: () => setIsCreateOpen(true), size: "sm", className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold", children: "Launch First Drive" })] }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: drives.map((drv) => (_jsxs("div", { className: "border border-brand-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-brand-900 text-sm", children: drv.companyName }), _jsx("p", { className: "font-semibold text-indigo-650", children: drv.title })] }), _jsx(Badge, { variant: drv.status === 'ACTIVE' ? 'success' : 'warning', className: "font-bold text-[9px]", children: drv.status })] }), _jsxs("div", { className: "space-y-1.5 text-brand-650 font-semibold pt-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-brand-400" }), _jsxs("span", { children: [drv.location, " (", drv.employmentType.replace('_', ' '), ")"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5 text-brand-400" }), _jsxs("span", { children: [drv.salaryMin, " - ", drv.salaryMax, " LPA"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(CheckSquare, { className: "h-3.5 w-3.5 text-brand-400" }), _jsxs("span", { children: ["Min CGPA: ", drv.eligibilityCriteria?.minCgpa || '6.0'] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-brand-400" }), _jsxs("span", { children: ["Deadline: ", new Date(drv.applicationDeadline).toLocaleDateString()] })] })] })] }), _jsxs("div", { className: "flex gap-2 border-t border-brand-100 pt-3", children: [_jsx(Link, { to: `/placement/drives/${drv._id}`, className: "flex-1", children: _jsx("button", { className: "w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg font-bold transition-colors", children: "Manage Drive" }) }), _jsx(Link, { to: `/placement/applications?jobId=${drv._id}`, className: "flex-1", children: _jsx("button", { className: "w-full text-center bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 py-1.5 rounded-lg font-bold transition-colors", children: "Applicants" }) })] })] }, drv._id))) })), isCreateOpen && (_jsx("div", { className: "fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40", children: _jsxs("div", { className: "relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between", children: [_jsxs("div", { className: "p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50", children: [_jsxs("h3", { className: "font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "h-4.5 w-4.5 text-indigo-650" }), _jsxs("span", { children: ["Create Placement Drive (Step ", currentStep, "/4)"] })] }), _jsx("button", { onClick: () => setIsCreateOpen(false), className: "p-1 hover:bg-brand-200 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsx("div", { className: "px-5 pt-3 flex gap-2 justify-between", children: [1, 2, 3, 4].map((step) => (_jsxs("div", { className: "flex-1 flex items-center gap-2", children: [_jsx("div", { className: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === step
                                            ? 'bg-indigo-650 text-white'
                                            : currentStep > step
                                                ? 'bg-green-600 text-white'
                                                : 'bg-brand-100 text-brand-450'}`, children: step }), _jsx("div", { className: `h-1 flex-1 rounded ${currentStep > step ? 'bg-green-500' : 'bg-brand-100'}` })] }, step))) }), _jsxs("form", { onSubmit: handleCreateSubmit, className: "flex-1 p-6 space-y-4", children: [currentStep === 1 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]", children: "Step 1: Basic Information" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Job Title *" }), _jsx("input", { required: true, type: "text", name: "title", value: formData.title, onChange: handleInputChange, placeholder: "e.g. Graduate Engineer Trainee", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Company Name *" }), _jsx("input", { required: true, type: "text", name: "companyName", value: formData.companyName, onChange: handleInputChange, placeholder: "e.g. Microsoft India", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Job Description *" }), _jsx("textarea", { required: true, name: "description", value: formData.description, onChange: handleInputChange, rows: 3, placeholder: "Provide comprehensive role details...", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] })] })), currentStep === 2 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]", children: "Step 2: Company & Package" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Location *" }), _jsx("input", { required: true, type: "text", name: "location", value: formData.location, onChange: handleInputChange, placeholder: "e.g. Bangalore", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Employment Type *" }), _jsxs("select", { name: "employmentType", value: formData.employmentType, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "FULL_TIME", children: "Full Time" }), _jsx("option", { value: "INTERNSHIP", children: "Internship" }), _jsx("option", { value: "CONTRACT", children: "Contract" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Min Salary CTC (LPA)" }), _jsx("input", { type: "number", name: "salaryMin", value: formData.salaryMin, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Max Salary CTC (LPA)" }), _jsx("input", { type: "number", name: "salaryMax", value: formData.salaryMax, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] })] })] })), currentStep === 3 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]", children: "Step 3: Eligibility Rules" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Minimum CGPA *" }), _jsx("input", { required: true, type: "number", step: "0.1", name: "minCgpa", value: formData.minCgpa, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Max Backlogs Allowed" }), _jsx("input", { type: "number", name: "maxBacklogsAllowed", value: formData.maxBacklogsAllowed, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Required Skills (Comma separated)" }), _jsx("input", { type: "text", name: "requiredSkills", value: formData.requiredSkills, onChange: handleInputChange, placeholder: "e.g. React, Node.js, Python", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] })] })), currentStep === 4 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]", children: "Step 4: Timeline & Review" }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Application Deadline *" }), _jsx("input", { required: true, type: "datetime-local", name: "applicationDeadline", value: formData.applicationDeadline, onChange: handleInputChange, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "bg-brand-50 p-4 border border-brand-150 rounded-xl space-y-1.5 leading-relaxed text-brand-750", children: [_jsx("p", { className: "font-bold text-brand-900 uppercase text-[9px] tracking-wider", children: "Review Configuration:" }), _jsxs("p", { children: ["Company: ", _jsx("strong", { children: formData.companyName })] }), _jsxs("p", { children: ["Role: ", _jsx("strong", { children: formData.title })] }), _jsxs("p", { children: ["CTC Package: ", _jsxs("strong", { children: [formData.salaryMin, " - ", formData.salaryMax, " LPA"] })] }), _jsxs("p", { children: ["Eligibility Cutoff: ", _jsxs("strong", { children: [formData.minCgpa, " CGPA"] }), " (0 backlogs)"] })] })] })), _jsxs("div", { className: "flex gap-2 pt-4 border-t border-brand-100", children: [currentStep > 1 && (_jsx(Button, { type: "button", variant: "secondary", onClick: handleStepPrev, className: "flex-1 font-bold", children: "Previous Step" })), currentStep < 4 ? (_jsx(Button, { type: "button", onClick: handleStepNext, className: "flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold", children: "Next Step" })) : (_jsx(Button, { type: "submit", className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold", children: "Publish Drive" }))] })] })] }) }))] }));
};
export default PlacementDrives;
