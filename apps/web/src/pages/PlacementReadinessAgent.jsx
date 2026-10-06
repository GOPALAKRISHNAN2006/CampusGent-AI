import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const PlacementReadinessAgent = () => {
  return (
    <GenericAgentViewer
      agentName="placement_readiness"
      title="Placement Readiness Agent"
      description="Evaluates technical skills, interview preparation, resume strength, and provides an explainable readiness score."
    />
  );
};
