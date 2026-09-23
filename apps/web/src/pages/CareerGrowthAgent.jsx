import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const CareerGrowthAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "career_growth", title: "Career Growth Agent", description: "Tracks long-term career roadmaps." }));
};
