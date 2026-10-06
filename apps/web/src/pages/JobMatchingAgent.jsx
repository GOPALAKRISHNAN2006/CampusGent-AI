import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const JobMatchingAgent = () => {
  return (
    <GenericAgentViewer
      agentName="job_matching"
      title="Job Matching Agent"
      description="Calculates multi-dimensional compatibility scores between student profiles and available job postings."
    />
  );
};
