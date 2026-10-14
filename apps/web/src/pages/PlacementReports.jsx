import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FileText, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client.js';

export const PlacementReports = () => {
  const [reportType, setReportType] = useState('SUMMARY');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState(null);
  const [error, setError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setDownloadSuccess(null);
    setReportPreview(null);

    try {
      if (reportType === 'SUMMARY') {
        const [analyticsRes, jobsRes, appsRes] = await Promise.all([
          apiClient.get('/analytics/placement'),
          apiClient.get('/jobs?limit=200'),
          apiClient.get('/jobs/all-applications'),
        ]);

        const analytics = analyticsRes.data?.data || {};
        const jobs = jobsRes.data?.data?.jobs || [];
        const apps = appsRes.data?.data || [];

        const totalApplications = apps.length || analytics.totalApplications || 0;
        const placedApplications = apps.filter(
          (a) => a.status === 'SELECTED' || a.status === 'OFFERED'
        );
        const placedCount = placedApplications.length;

        // Calculate average package from jobs
        const activeJobs = jobs.filter((j) => j.status === 'ACTIVE');
        const avgPkgNum = jobs.length > 0
          ? Math.round(jobs.reduce((acc, curr) => acc + (curr.salaryMax || curr.salaryMin || 6), 0) / jobs.length)
          : 7;

        const rate = totalApplications > 0 ? Math.round((placedCount / totalApplications) * 100) : 0;

        setReportPreview({
          title: `Campus Placements Season Summary Report (${academicYear})`,
          dateRange: `Academic Season ${academicYear}`,
          type: 'SUMMARY',
          metrics: {
            drivesCount: jobs.length,
            activeDrivesCount: activeJobs.length,
            applicationsCount: totalApplications,
            placedCount,
            avgPackage: `${avgPkgNum} LPA`,
            successRate: `${rate}%`,
          },
          rawRecords: apps,
        });
      } else if (reportType === 'DRIVES') {
        const jobsRes = await apiClient.get('/jobs?limit=200');
        const jobs = jobsRes.data?.data?.jobs || [];

        setReportPreview({
          title: `Corporate Recruitment Drives & Yield Report (${academicYear})`,
          dateRange: `Academic Season ${academicYear}`,
          type: 'DRIVES',
          drives: jobs.map((j) => ({
            id: j._id,
            title: j.title,
            company: j.companyName,
            location: j.location,
            type: j.employmentType,
            status: j.status,
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            deadline: j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString() : 'N/A',
          })),
        });
      } else {
        // Department-wise Breakdown
        const [deptRes, appsRes] = await Promise.all([
          apiClient.get('/admin/departments').catch(() => ({ data: { data: { departments: [] } } })),
          apiClient.get('/jobs/all-applications'),
        ]);

        const departments = deptRes.data?.data?.departments || [];
        const apps = appsRes.data?.data || [];

        const deptMap = new Map();
        departments.forEach((d) => {
          deptMap.set(d.name, {
            name: d.name,
            code: d.code,
            placed: 0,
            totalApps: 0,
          });
        });

        // Tally applications
        apps.forEach((a) => {
          const dept = a.student?.department || 'General / Engineering';
          if (!deptMap.has(dept)) {
            deptMap.set(dept, { name: dept, code: 'ENG', placed: 0, totalApps: 0 });
          }
          const item = deptMap.get(dept);
          item.totalApps += 1;
          if (a.status === 'SELECTED' || a.status === 'OFFERED') {
            item.placed += 1;
          }
        });

        const breakdown = Array.from(deptMap.values()).map((row) => ({
          dept: row.name,
          code: row.code,
          applications: row.totalApps,
          placed: row.placed,
          rate: row.totalApps > 0 ? `${Math.round((row.placed / row.totalApps) * 100)}%` : '0%',
        }));

        setReportPreview({
          title: `Department-Wise Placement Performance Breakdown (${academicYear})`,
          dateRange: `Academic Season ${academicYear}`,
          type: 'DEPT',
          breakdown,
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate report from database records.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = (filename, headers, rows) => {
    const csvRows = [headers.join(',')];
    rows.forEach((row) => {
      const sanitized = row.map((cell) => {
        const str = String(cell ?? '').replace(/"/g, '""');
        return `"${str}"`;
      });
      csvRows.push(sanitized.join(','));
    });

    const csvString = csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported CSV successfully as "${filename}"`);
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleExportCSV = () => {
    if (!reportPreview) return;
    const dateStamp = new Date().toISOString().slice(0, 10);

    if (reportPreview.type === 'SUMMARY') {
      const headers = ['Application ID', 'Candidate Name', 'Candidate Email', 'Job Title', 'Company', 'Application Status', 'Applied Date'];
      const rows = (reportPreview.rawRecords || []).map((app) => [
        app._id,
        app.student?.name || 'Candidate',
        app.student?.email || 'N/A',
        app.job?.title || 'Job Opening',
        app.job?.companyName || 'Corporate Partner',
        app.status || 'PENDING',
        app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A',
      ]);
      downloadCSV(`placement_season_summary_${academicYear}_${dateStamp}.csv`, headers, rows);
    } else if (reportPreview.type === 'DRIVES') {
      const headers = ['Job ID', 'Title', 'Company Name', 'Type', 'Location', 'Status', 'Min Salary (LPA)', 'Max Salary (LPA)', 'Deadline'];
      const rows = (reportPreview.drives || []).map((d) => [
        d.id,
        d.title,
        d.company,
        d.type,
        d.location,
        d.status,
        d.salaryMin,
        d.salaryMax,
        d.deadline,
      ]);
      downloadCSV(`placement_drives_report_${academicYear}_${dateStamp}.csv`, headers, rows);
    } else if (reportPreview.type === 'DEPT') {
      const headers = ['Department Name', 'Code', 'Total Applications', 'Placed Candidates', 'Placement Yield Rate'];
      const rows = (reportPreview.breakdown || []).map((b) => [
        b.dept,
        b.code,
        b.applications,
        b.placed,
        b.rate,
      ]);
      downloadCSV(`department_placement_performance_${academicYear}_${dateStamp}.csv`, headers, rows);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Reports Generator</h1>
        <p className="text-brand-500 mt-1">
          Compile comprehensive placement summaries, verify department outcomes, and export audited statistics.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-brand-200/60 shadow-xs bg-white lg:col-span-1">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Select Report Formats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-brand-700 block text-[11px]">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850 focus:border-indigo-500"
              >
                <option value="SUMMARY">Season Summary Report</option>
                <option value="DEPT">Department-wise Breakdown</option>
                <option value="DRIVES">Drive Yield Performance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-700 block text-[11px]">Academic Year Selection</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850 focus:border-indigo-500"
              >
                <option value="2026-27">Academic Season 2026 - 2027</option>
                <option value="2025-26">Academic Season 2025 - 2026</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Compiling Real Records...</span>
                </>
              ) : (
                'Compile & Preview Report'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-xs bg-white lg:col-span-2">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Report Preview Window</CardTitle>
            {reportPreview && (
              <Button
                onClick={handleExportCSV}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Audit CSV</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-5">
            {!reportPreview ? (
              <div className="text-center py-16 space-y-3">
                <FileText className="h-9 w-9 text-brand-400 mx-auto" />
                <p className="text-brand-500 font-semibold">
                  Select parameters and click "Compile & Preview Report" to aggregate real database records.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-brand-50 p-4 border border-brand-200 rounded-xl space-y-1">
                  <h3 className="font-extrabold text-brand-950 text-sm">{reportPreview.title}</h3>
                  <span className="text-brand-500 text-[10px] font-bold uppercase">{reportPreview.dateRange}</span>
                </div>

                {reportPreview.type === 'SUMMARY' && reportPreview.metrics && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Total Drives</span>
                        <span className="text-lg font-black text-brand-900">{reportPreview.metrics.drivesCount}</span>
                      </div>
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Active Drives</span>
                        <span className="text-lg font-black text-indigo-700">{reportPreview.metrics.activeDrivesCount}</span>
                      </div>
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Total Applications</span>
                        <span className="text-lg font-black text-brand-900">{reportPreview.metrics.applicationsCount}</span>
                      </div>
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Selected / Offers</span>
                        <span className="text-lg font-black text-emerald-700">{reportPreview.metrics.placedCount}</span>
                      </div>
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Success Rate</span>
                        <span className="text-lg font-black text-indigo-700">{reportPreview.metrics.successRate}</span>
                      </div>
                      <div className="p-3 border border-brand-100 rounded-lg bg-white shadow-2xs">
                        <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Avg Package</span>
                        <span className="text-lg font-black text-brand-900">{reportPreview.metrics.avgPackage}</span>
                      </div>
                    </div>
                  </div>
                )}

                {reportPreview.type === 'DRIVES' && (
                  <div className="border border-brand-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-50 text-brand-650 font-bold border-b border-brand-100 text-[11px]">
                          <th className="px-3.5 py-2">Role Title</th>
                          <th className="px-3.5 py-2">Company</th>
                          <th className="px-3.5 py-2">Location</th>
                          <th className="px-3.5 py-2">Type</th>
                          <th className="px-3.5 py-2">Status</th>
                          <th className="px-3.5 py-2">Deadline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-100 text-[11px]">
                        {reportPreview.drives.map((row) => (
                          <tr key={row.id} className="hover:bg-brand-50/50">
                            <td className="px-3.5 py-2.5 font-bold text-brand-900">{row.title}</td>
                            <td className="px-3.5 py-2.5 font-semibold text-brand-700">{row.company}</td>
                            <td className="px-3.5 py-2.5 text-brand-600">{row.location}</td>
                            <td className="px-3.5 py-2.5 text-brand-600">{row.type}</td>
                            <td className="px-3.5 py-2.5 font-bold">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  row.status === 'ACTIVE'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-brand-500">{row.deadline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportPreview.type === 'DEPT' && (
                  <div className="border border-brand-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-50 text-brand-650 font-bold border-b border-brand-100 text-[11px]">
                          <th className="px-4 py-2">Department Name</th>
                          <th className="px-4 py-2">Code</th>
                          <th className="px-4 py-2">Total Applications</th>
                          <th className="px-4 py-2">Placed</th>
                          <th className="px-4 py-2">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-100 text-[11px]">
                        {reportPreview.breakdown.map((row, idx) => (
                          <tr key={idx} className="hover:bg-brand-50/50">
                            <td className="px-4 py-3 font-bold text-brand-900">{row.dept}</td>
                            <td className="px-4 py-3 font-semibold text-brand-600">{row.code}</td>
                            <td className="px-4 py-3 font-semibold">{row.applications}</td>
                            <td className="px-4 py-3 font-bold text-emerald-700">{row.placed}</td>
                            <td className="px-4 py-3 font-bold text-indigo-650">{row.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlacementReports;
