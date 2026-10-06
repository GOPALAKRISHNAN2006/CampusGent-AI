import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const LearningPathAgent = () => {
  return (
    <GenericAgentViewer
      agentName="learning_path"
      title="Learning Path Agent"
      description="Generates personalized, structured skill acquisition roadmaps tailored to your target industry roles."
    />
  );
};
