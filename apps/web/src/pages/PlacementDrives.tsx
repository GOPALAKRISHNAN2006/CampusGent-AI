import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  CheckSquare, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const PlacementDrives: React.FC = () => {
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    allowedDepartments: [] as string[],
    maxBacklogsAllowed: 0,
    applicationDeadline: '',
  });

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED'>('ACTIVE');

  // Load drives
  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/jobs?status=${activeTab}`);
      setDrives(res.data.data.jobs || []);
    } catch (err: any) {
      setError('Failed to fetch placement drives.');
    } finally {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create drive');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Placement Drives</h1>
          <p className="text-brand-500 mt-1">Configure active drives, preview eligible cohorts, and review application deadlines.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 font-bold">
          <Plus className="h-4.5 w-4.5" />
          <span>Create Placement Drive</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs bar */}
      <div className="flex border-b border-brand-200 gap-6 text-[11px] font-bold">
        {(['ACTIVE', 'DRAFT', 'CLOSED', 'ARCHIVED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-1 capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-indigo-600 text-indigo-650' 
                : 'text-brand-450 hover:text-brand-700'
            }`}
          >
            {tab.toLowerCase()} Drives
          </button>
        ))}
      </div>

      {/* Content listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-brand-100 rounded-xl border border-brand-200"></div>
          ))}
        </div>
      ) : drives.length === 0 ? (
        <Card className="text-center py-16 border border-brand-200/60 shadow-sm bg-white">
          <CardContent className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-900 text-sm">No placement drives found</h3>
            <p className="text-brand-500 text-xs max-w-sm mx-auto">
              There are no active recruitment drives registered in this category. Click the button above to launch a new placement drive.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold">
              Launch First Drive
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {drives.map((drv) => (
            <div key={drv._id} className="border border-brand-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-brand-900 text-sm">{drv.companyName}</h3>
                    <p className="font-semibold text-indigo-650">{drv.title}</p>
                  </div>
                  <Badge variant={drv.status === 'ACTIVE' ? 'success' : 'warning'} className="font-bold text-[9px]">
                    {drv.status}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-brand-650 font-semibold pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-400" />
                    <span>{drv.location} ({drv.employmentType.replace('_', ' ')})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-brand-400" />
                    <span>{drv.salaryMin} - {drv.salaryMax} LPA</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5 text-brand-400" />
                    <span>Min CGPA: {drv.eligibilityCriteria?.minCgpa || '6.0'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-400" />
                    <span>Deadline: {new Date(drv.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t border-brand-100 pt-3">
                <Link to={`/placement/drives/${drv._id}`} className="flex-1">
                  <button className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1.5 rounded-lg font-bold transition-colors">
                    Manage Drive
                  </button>
                </Link>
                <Link to={`/placement/applications?jobId=${drv._id}`} className="flex-1">
                  <button className="w-full text-center bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 py-1.5 rounded-lg font-bold transition-colors">
                    Applicants
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CREATE PLACEMENT DRIVE WIZARD MODAL --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between">
            {/* Header */}
            <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h3 className="font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-650" />
                <span>Create Placement Drive (Step {currentStep}/4)</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-brand-200 rounded-full text-brand-450">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Steps Tracker bar */}
            <div className="px-5 pt-3 flex gap-2 justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === step 
                      ? 'bg-indigo-650 text-white' 
                      : currentStep > step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-brand-100 text-brand-450'
                  }`}>
                    {step}
                  </div>
                  <div className={`h-1 flex-1 rounded ${
                    currentStep > step ? 'bg-green-500' : 'bg-brand-100'
                  }`} />
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <form onSubmit={handleCreateSubmit} className="flex-1 p-6 space-y-4">
              
              {currentStep === 1 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]">
                    Step 1: Basic Information
                  </h4>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block">Job Title *</label>
                    <input
                      required
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Graduate Engineer Trainee"
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block">Company Name *</label>
                    <input
                      required
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Microsoft India"
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block">Job Description *</label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Provide comprehensive role details..."
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]">
                    Step 2: Company & Package
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Location *</label>
                      <input
                        required
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Bangalore"
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Employment Type *</label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Min Salary CTC (LPA)</label>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Max Salary CTC (LPA)</label>
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]">
                    Step 3: Eligibility Rules
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Minimum CGPA *</label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        name="minCgpa"
                        value={formData.minCgpa}
                        onChange={handleInputChange}
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-brand-700 block">Max Backlogs Allowed</label>
                      <input
                        type="number"
                        name="maxBacklogsAllowed"
                        value={formData.maxBacklogsAllowed}
                        onChange={handleInputChange}
                        className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      name="requiredSkills"
                      value={formData.requiredSkills}
                      onChange={handleInputChange}
                      placeholder="e.g. React, Node.js, Python"
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-brand-900 border-b border-brand-100 pb-1 uppercase tracking-widest text-[10px]">
                    Step 4: Timeline & Review
                  </h4>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block">Application Deadline *</label>
                    <input
                      required
                      type="datetime-local"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                    />
                  </div>

                  <div className="bg-brand-50 p-4 border border-brand-150 rounded-xl space-y-1.5 leading-relaxed text-brand-750">
                    <p className="font-bold text-brand-900 uppercase text-[9px] tracking-wider">Review Configuration:</p>
                    <p>Company: <strong>{formData.companyName}</strong></p>
                    <p>Role: <strong>{formData.title}</strong></p>
                    <p>CTC Package: <strong>{formData.salaryMin} - {formData.salaryMax} LPA</strong></p>
                    <p>Eligibility Cutoff: <strong>{formData.minCgpa} CGPA</strong> (0 backlogs)</p>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-2 pt-4 border-t border-brand-100">
                {currentStep > 1 && (
                  <Button type="button" variant="secondary" onClick={handleStepPrev} className="flex-1 font-bold">
                    Previous Step
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button type="button" onClick={handleStepNext} className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
                    Publish Drive
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default PlacementDrives;
