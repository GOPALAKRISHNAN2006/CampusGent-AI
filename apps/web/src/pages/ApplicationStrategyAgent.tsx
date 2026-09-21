import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const ApplicationStrategyAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="application_strategy" 
      title="Application Strategy Agent" 
      description="Helps students prioritize application focus." 
    />
  );
};
