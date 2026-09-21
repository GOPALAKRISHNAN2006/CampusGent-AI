import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  FileText, 
  Download, 
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

export const PlacementReports: React.FC = () => {
  const [reportType, setReportType] = useState<string>('SUMMARY');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState<any | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setReportPreview(null);
    setTimeout(() => {
      setIsGenerating(false);
      if (reportType === 'SUMMARY') {
        setReportPreview({
          title: 'Campus Placements Season Summary Report',
          dateRange: 'Academic Year 2026-27',
          metrics: {
            drivesCount: 12,
            applicationsCount: 480,
            placedCount: 284,
            avgPackage: '7.5 LPA',
            successRate: '78%'
          }
        });
      } else {
        setReportPreview({
          title: 'Department-wise Performance Breakdown',
          dateRange: 'Academic Year 2026-27',
          breakdown: [
            { dept: 'Computer Science (CSE)', placed: 184, rate: '86%', avg: '8.2 LPA' },
            { dept: 'Electronics & Comm (ECE)', placed: 62, rate: '71%', avg: '6.4 LPA' },
            { dept: 'Information Technology (IT)', placed: 38, rate: '78%', avg: '7.2 LPA' }
          ]
        });
      }
    }, 500);
  };

  const handleDownload = () => {
    alert('Report compiled! Your spreadsheet download has started.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Reports Generator</h1>
        <p className="text-brand-500 mt-1">Compile comprehensive placement summaries, verify department outcomes, and export audited statistics.</p>
      </div>

      {/* Main interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Parameters selector */}
        <Card className="border border-brand-200/60 shadow-sm bg-white lg:col-span-1">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Select Report Formats</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-brand-700 block">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
              >
                <option value="SUMMARY">Season Summary Report</option>
                <option value="DEPT">Department-wise Breakdown</option>
                <option value="DRIVES">Drive Yield Performance</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="font-bold text-brand-700 block">Academic Year Selection</label>
              <select className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850">
                <option value="2026-27">Academic Season 2026 - 2027</option>
                <option value="2025-26">Academic Season 2025 - 2026</option>
              </select>
            </div>

            <Button onClick={handleGenerate} isLoading={isGenerating} className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5">
              Compile & Preview Report
            </Button>
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card className="border border-brand-200/60 shadow-sm bg-white lg:col-span-2">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Report Preview Window</CardTitle>
            {reportPreview && (
              <Button onClick={handleDownload} size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>Export Audit CSV</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-5">
            {!reportPreview ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="h-8 w-8 text-brand-400 mx-auto" />
                <p className="text-brand-500 font-semibold">Select parameters and click "Compile" to preview report data.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-brand-50 p-4 border border-brand-200 rounded-xl space-y-1">
                  <h3 className="font-extrabold text-brand-950 text-sm">{reportPreview.title}</h3>
                  <span className="text-brand-500 text-[10px] font-bold uppercase">{reportPreview.dateRange}</span>
                </div>

                {reportPreview.metrics ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 border border-brand-100 rounded-lg">
                      <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Active Jobs</span>
                      <span className="text-lg font-black text-brand-900">{reportPreview.metrics.drivesCount}</span>
                    </div>
                    <div className="p-3 border border-brand-100 rounded-lg">
                      <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Applications</span>
                      <span className="text-lg font-black text-brand-900">{reportPreview.metrics.applicationsCount}</span>
                    </div>
                    <div className="p-3 border border-brand-100 rounded-lg">
                      <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Placed Students</span>
                      <span className="text-lg font-black text-green-700">{reportPreview.metrics.placedCount}</span>
                    </div>
                    <div className="p-3 border border-brand-100 rounded-lg">
                      <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Yield Placement Rate</span>
                      <span className="text-lg font-black text-indigo-700">{reportPreview.metrics.successRate}</span>
                    </div>
                    <div className="p-3 border border-brand-100 rounded-lg">
                      <span className="text-[9.5px] font-bold text-brand-450 uppercase block">Avg Salary package</span>
                      <span className="text-lg font-black text-brand-900">{reportPreview.metrics.avgPackage}</span>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse border border-brand-100 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-brand-50 text-brand-650 font-bold border-b border-brand-100">
                        <th className="px-4 py-2">Department Name</th>
                        <th className="px-4 py-2">Placed</th>
                        <th className="px-4 py-2">Success Rate</th>
                        <th className="px-4 py-2">Avg Package</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-100">
                      {reportPreview.breakdown.map((row: any, rIdx: number) => (
                        <tr key={rIdx}>
                          <td className="px-4 py-3 font-bold text-brand-900">{row.dept}</td>
                          <td className="px-4 py-3 font-semibold">{row.placed}</td>
                          <td className="px-4 py-3 text-indigo-650 font-bold">{row.rate}</td>
                          <td className="px-4 py-3 font-bold">{row.avg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
