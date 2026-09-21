import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const StudentSuccessAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="student_success" 
      title="Student Success Agent" 
      description="Analyzes student grades and attendance metrics." 
    />
  );
};
