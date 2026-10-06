import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const PlacementAnalyticsAgent = () => {
  return (
    <GenericAgentViewer
      agentName="placement_analytics"
      title="Placement Analytics Agent"
      description="Provides macro placement insights, department offer rates, CTC distributions, and recruitment funnel bottlenecks."
    />
  );
};
