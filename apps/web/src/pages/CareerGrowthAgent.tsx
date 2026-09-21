import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const CareerGrowthAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="career_growth" 
      title="Career Growth Agent" 
      description="Tracks long-term career roadmaps." 
    />
  );
};
