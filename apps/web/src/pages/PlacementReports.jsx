import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FileText, Download } from 'lucide-react';
export const PlacementReports = () => {
    const [reportType, setReportType] = useState('SUMMARY');
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportPreview, setReportPreview] = useState(null);
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
            }
            else {
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
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Reports Generator" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Compile comprehensive placement summaries, verify department outcomes, and export audited statistics." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm bg-white lg:col-span-1", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Select Report Formats" }) }), _jsxs(CardContent, { className: "p-4 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Report Category" }), _jsxs("select", { value: reportType, onChange: (e) => setReportType(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "SUMMARY", children: "Season Summary Report" }), _jsx("option", { value: "DEPT", children: "Department-wise Breakdown" }), _jsx("option", { value: "DRIVES", children: "Drive Yield Performance" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Academic Year Selection" }), _jsxs("select", { className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "2026-27", children: "Academic Season 2026 - 2027" }), _jsx("option", { value: "2025-26", children: "Academic Season 2025 - 2026" })] })] }), _jsx(Button, { onClick: handleGenerate, isLoading: isGenerating, className: "w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5", children: "Compile & Preview Report" })] })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm bg-white lg:col-span-2", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Report Preview Window" }), reportPreview && (_jsxs(Button, { onClick: handleDownload, size: "sm", className: "bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-1", children: [_jsx(Download, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Export Audit CSV" })] }))] }), _jsx(CardContent, { className: "p-5", children: !reportPreview ? (_jsxs("div", { className: "text-center py-12 space-y-3", children: [_jsx(FileText, { className: "h-8 w-8 text-brand-400 mx-auto" }), _jsx("p", { className: "text-brand-500 font-semibold", children: "Select parameters and click \"Compile\" to preview report data." })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-brand-50 p-4 border border-brand-200 rounded-xl space-y-1", children: [_jsx("h3", { className: "font-extrabold text-brand-950 text-sm", children: reportPreview.title }), _jsx("span", { className: "text-brand-500 text-[10px] font-bold uppercase", children: reportPreview.dateRange })] }), reportPreview.metrics ? (_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-3 border border-brand-100 rounded-lg", children: [_jsx("span", { className: "text-[9.5px] font-bold text-brand-450 uppercase block", children: "Active Jobs" }), _jsx("span", { className: "text-lg font-black text-brand-900", children: reportPreview.metrics.drivesCount })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-lg", children: [_jsx("span", { className: "text-[9.5px] font-bold text-brand-450 uppercase block", children: "Applications" }), _jsx("span", { className: "text-lg font-black text-brand-900", children: reportPreview.metrics.applicationsCount })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-lg", children: [_jsx("span", { className: "text-[9.5px] font-bold text-brand-450 uppercase block", children: "Placed Students" }), _jsx("span", { className: "text-lg font-black text-green-700", children: reportPreview.metrics.placedCount })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-lg", children: [_jsx("span", { className: "text-[9.5px] font-bold text-brand-450 uppercase block", children: "Yield Placement Rate" }), _jsx("span", { className: "text-lg font-black text-indigo-700", children: reportPreview.metrics.successRate })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-lg", children: [_jsx("span", { className: "text-[9.5px] font-bold text-brand-450 uppercase block", children: "Avg Salary package" }), _jsx("span", { className: "text-lg font-black text-brand-900", children: reportPreview.metrics.avgPackage })] })] })) : (_jsxs("table", { className: "w-full text-left border-collapse border border-brand-100 rounded-xl overflow-hidden", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 text-brand-650 font-bold border-b border-brand-100", children: [_jsx("th", { className: "px-4 py-2", children: "Department Name" }), _jsx("th", { className: "px-4 py-2", children: "Placed" }), _jsx("th", { className: "px-4 py-2", children: "Success Rate" }), _jsx("th", { className: "px-4 py-2", children: "Avg Package" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100", children: reportPreview.breakdown.map((row, rIdx) => (_jsxs("tr", { children: [_jsx("td", { className: "px-4 py-3 font-bold text-brand-900", children: row.dept }), _jsx("td", { className: "px-4 py-3 font-semibold", children: row.placed }), _jsx("td", { className: "px-4 py-3 text-indigo-650 font-bold", children: row.rate }), _jsx("td", { className: "px-4 py-3 font-bold", children: row.avg })] }, rIdx))) })] }))] })) })] })] })] }));
};
export default PlacementReports;
