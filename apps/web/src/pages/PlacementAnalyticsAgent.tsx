import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const PlacementAnalyticsAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="placement_analytics" 
      title="Placement Analytics Agent" 
      description="Institutional analytics: deterministic aggregate statistics interpreted by AI." 
    />
  );
};
