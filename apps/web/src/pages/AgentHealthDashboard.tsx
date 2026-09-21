import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, ShieldAlert, CheckCircle, FileJson } from 'lucide-react';

export const AgentHealthDashboard: React.FC = () => {
  // Static audit list mapping to our 21 catalog agents
  const agentsStatus = [
    { name: "StudentSuccessAgent", category: "Academic", status: "HEALTHY", latency: "340ms", policy: "v1.0.0" },
    { name: "PlacementReadinessAgent", category: "Placement", status: "HEALTHY", latency: "420ms", policy: "v1.0.0" },
    { name: "LearningPathAgent", category: "Learning", status: "HEALTHY", latency: "510ms", policy: "v1.0.0" },
    { name: "FacultyInsightsAgent", category: "Faculty", status: "HEALTHY", latency: "280ms", policy: "v1.0.0" },
    { name: "PlacementAnalyticsAgent", category: "Placement", status: "HEALTHY", latency: "310ms", policy: "v1.0.0" },
    { name: "CareerRecommendationAgent", category: "Career", status: "HEALTHY", latency: "490ms", policy: "v1.0.0" },
    { name: "MockInterviewAgent", category: "Interview", status: "HEALTHY", latency: "620ms", policy: "v1.0.0" },
    { name: "ResumeIntelligenceAgent", category: "Resume", status: "HEALTHY", latency: "440ms", policy: "v1.0.0" },
    { name: "JobMatchingAgent", category: "Jobs", status: "HEALTHY", latency: "380ms", policy: "v1.0.0" },
    { name: "ApplicationStrategyAgent", category: "Placement", status: "HEALTHY", latency: "300ms", policy: "v1.0.0" },
    { name: "SkillGapAgent", category: "Skills", status: "HEALTHY", latency: "250ms", policy: "v1.0.0" },
    { name: "CareerGrowthAgent", category: "Career", status: "HEALTHY", latency: "410ms", policy: "v1.0.0" },
    { name: "StudentRiskAgent", category: "Academic", status: "HEALTHY", latency: "290ms", policy: "v1.0.0" },
    { name: "OpportunityAgent", category: "Placement", status: "HEALTHY", latency: "320ms", policy: "v1.0.0" },
    { name: "StudentEngagementAgent", category: "Academic", status: "HEALTHY", latency: "220ms", policy: "v1.0.0" },
    { name: "PlacementPreparationAgent", category: "Placement", status: "HEALTHY", latency: "450ms", policy: "v1.0.0" },
    { name: "FacultyInterventionAgent", category: "Faculty", status: "HEALTHY", latency: "330ms", policy: "v1.0.0" },
    { name: "PlacementOfficerCopilot", category: "Placement", status: "HEALTHY", latency: "390ms", policy: "v1.0.0" },
    { name: "AdminIntelligenceAgent", category: "Admin", status: "HEALTHY", latency: "270ms", policy: "v1.0.0" },
    { name: "DataQualityAgent", category: "Admin", status: "HEALTHY", latency: "350ms", policy: "v1.0.0" },
    { name: "AIGovernanceAgent", category: "Admin", status: "HEALTHY", latency: "310ms", policy: "v1.0.0" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-indigo-500" />
          <span>Ecosystem Observability & AI Governance</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Monitor execution latency averages, policy conformance compliance matrices, and health indexes for the 21 agents.
        </p>
      </div>

      {/* Observability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-brand-900">Total Registered Agents</h3>
              <p className="text-2xl font-black mt-1">21 / 21</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-brand-900">System Conformance Conformance</h3>
              <p className="text-2xl font-black mt-1">100%</p>
            </div>
            <FileJson className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-brand-900">Governance Policy Version</h3>
              <p className="text-2xl font-black mt-1">v1.0.0</p>
            </div>
            <ShieldAlert className="h-8 w-8 text-indigo-500" />
          </CardContent>
        </Card>
      </div>

      {/* Agents Health Table */}
      <Card>
        <CardHeader>
          <CardTitle>Master Agents Registry Health status</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                <th className="px-6 py-3">Agent Identification</th>
                <th className="px-6 py-3">Category classification</th>
                <th className="px-6 py-3">Audit Conformance</th>
                <th className="px-6 py-3">Average Latency</th>
                <th className="px-6 py-3">Prompt Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
              {agentsStatus.map((agent) => (
                <tr key={agent.name} className="hover:bg-brand-50/50">
                  <td className="px-6 py-4 font-bold text-brand-950">{agent.name}</td>
                  <td className="px-6 py-4">{agent.category}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">{agent.status}</Badge>
                  </td>
                  <td className="px-6 py-4 font-mono">{agent.latency}</td>
                  <td className="px-6 py-4 font-mono text-brand-500">{agent.policy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
export default AgentHealthDashboard;
