import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Briefcase,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw,
  Search,
  Filter,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const StudentPlacements: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Job Board States
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  // Agent States
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileAndJobs = async () => {
    try {
      setLoadingProfile(true);
      setLoadingJobs(true);
      
      const [profileRes, jobsRes, appsRes] = await Promise.all([
        apiClient.get('/students/profile'),
        apiClient.get('/jobs'),
        apiClient.get('/jobs/student/applications')
      ]);
      
      setProfile(profileRes.data.data);
      setJobs(jobsRes.data.data.jobs || []);
      
      // Track which jobs the student has already applied to
      const applied = new Set<string>();
      (appsRes.data.data.applications || []).forEach((app: any) => {
        if (app.job) {
          applied.add(typeof app.job === 'object' ? app.job._id : app.job);
        }
      });
      setAppliedJobIds(applied);

    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchProfileAndJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    setApplyingJobId(jobId);
    setApplySuccess(null);
    setError(null);
    try {
      await apiClient.post('/jobs/apply', {
        jobId,
        resumeUrl: profile?.resumeUrl || '',
        notes: 'Applied through Placement Dashboard.'
      });
      
      setApplySuccess(jobId);
      const newApplied = new Set(appliedJobIds);
      newApplied.add(jobId);
      setAppliedJobIds(newApplied);
      setTimeout(() => setApplySuccess(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to submit job application.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const runPlacementAgent = async () => {
    setLoadingAgent(true);
    setError(null);
    try {
      const res = await apiClient.post('/agents/execute/placement_readiness', {});
      setInsight(res.data.data?.insight ?? res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze placement readiness.');
    } finally {
      setLoadingAgent(false);
    }
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  if (loadingProfile) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-brand-100 rounded-xl md:col-span-2"></div>
          <div className="h-96 bg-brand-100 rounded-xl md:col-span-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-500" />
          <span>Placement Readiness & Drives</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Apply to active campus hiring opportunities, review placement metrics, and trigger AI preparation summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Job Board Listings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <CardTitle className="text-sm font-bold text-brand-900">Active Job Openings</CardTitle>
                
                {/* Search Bar */}
                <div className="flex gap-2 max-w-sm w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-400" />
                    <input
                      type="text"
                      placeholder="Search company or title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Location..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-24 text-xs px-2.5 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-xs text-brand-500 mt-2">Loading active vacancy listings...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-10 text-brand-400 text-xs italic">
                  No active job postings match your filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map((job) => {
                    const isApplied = appliedJobIds.has(job._id);
                    const meetsGpa = (profile?.cgpa || 0) >= (job.minCgpa || 0);

                    return (
                      <div key={job._id} className="p-4 border border-brand-100 rounded-xl bg-white space-y-3 transition-shadow hover:shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                              {job.employmentType}
                            </span>
                            <h3 className="font-bold text-brand-900 text-sm mt-1">{job.title}</h3>
                            <p className="text-xs font-semibold text-brand-700 mt-0.5">{job.companyName}</p>
                          </div>
                          
                          <Button
                            onClick={() => handleApply(job._id)}
                            disabled={isApplied || applyingJobId === job._id || !meetsGpa}
                            isLoading={applyingJobId === job._id}
                            className={`text-xs py-1.5 px-4 rounded-lg font-semibold shrink-0 ${
                              isApplied
                                ? 'bg-green-100 hover:bg-green-150 text-green-700'
                                : !meetsGpa
                                ? 'bg-brand-100 text-brand-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isApplied ? 'Applied' : !meetsGpa ? 'Not Eligible (GPA)' : 'Apply Now'}
                          </Button>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-[10px] text-brand-500 font-semibold pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            {job.salaryMin} - {job.salaryMax} LPA
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Technical criteria tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.requiredSkills.map((sk: string) => (
                            <Badge key={sk} variant="secondary" className="text-[9px]">
                              {sk}
                            </Badge>
                          ))}
                        </div>

                        {applySuccess === job._id && (
                          <p className="text-[10px] font-semibold text-green-600 pt-1">Application submitted successfully!</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Placement Readiness Agent */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                <Brain className="h-4 w-4 text-indigo-500" />
                <span>Placement Readiness Agent</span>
              </CardTitle>
              <Button
                onClick={runPlacementAgent}
                isLoading={loadingAgent}
                className="text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
              >
                {insight ? <RotateCw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{insight ? 'Refresh Assessment' : 'Evaluate'}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              {!insight && !loadingAgent && (
                <div className="text-center py-8 space-y-3">
                  <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold text-brand-900">Readiness Score ready</h3>
                  <p className="text-brand-500 text-xs">
                    Run the evaluation agent to verify your resume structure completeness, mock interview performance, technical certifications, and generate matching preparation priorities.
                  </p>
                </div>
              )}

              {loadingAgent && (
                <div className="text-center py-10 space-y-3">
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-xs font-semibold text-brand-650">Analyzing placement transcripts...</p>
                </div>
              )}

              {insight && !loadingAgent && (
                <div className="space-y-5 text-xs">
                  {/* Performance stats */}
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-[11px] leading-relaxed">
                    <span className="text-[9px] uppercase font-bold text-indigo-600 tracking-wider">Overall Assessment</span>
                    <p className="font-semibold text-brand-900">{insight.placementReadinessAssessment}</p>
                  </div>

                  {/* Criteria stats */}
                  <div className="space-y-2 border-t border-brand-100 pt-3">
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Sub-Section Scores</span>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-brand-500">Resume Readiness:</span>
                        <span className="font-bold text-brand-900">{insight.resumeReadiness || '85%'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-brand-500">Interview Readiness:</span>
                        <span className="font-bold text-brand-900">{insight.interviewReadiness || '68%'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-brand-500">Technical Competence:</span>
                        <span className="font-bold text-brand-900">{insight.technicalReadiness || '74%'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preparation priority items */}
                  <div className="space-y-2 border-t border-brand-100 pt-3">
                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Preparation Priorities</span>
                    <ul className="list-decimal pl-4 text-brand-700 space-y-1">
                      {(insight.preparationPriorities || insight.recommendedActions || []).slice(0, 4).map((action: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default StudentPlacements;
