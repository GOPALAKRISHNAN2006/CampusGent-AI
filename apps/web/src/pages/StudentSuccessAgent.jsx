import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const StudentSuccessAgent = () => {
  return (
    <GenericAgentViewer
      agentName="student_success"
      title="Student Success Agent"
      description="Monitors overall academic progress, identifies intervention points, and provides holistic development guidance."
    />
  );
};
