import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const JobMatchingAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="job_matching" 
      title="Job Matching Agent" 
      description="Compares vacancy qualifications requirements parameters." 
    />
  );
};
