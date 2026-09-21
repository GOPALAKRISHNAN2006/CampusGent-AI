import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const FacultyInsightsAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="faculty_insights" 
      title="Faculty Insights Agent" 
      description="Compiles risk alerts summaries for assigned mentors." 
    />
  );
};
