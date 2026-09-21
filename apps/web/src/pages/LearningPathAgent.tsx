import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const LearningPathAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="learning_path" 
      title="Learning Path Agent" 
      description="Maps professional developmental targets to quarters." 
    />
  );
};
