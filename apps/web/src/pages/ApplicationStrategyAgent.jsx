import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const ApplicationStrategyAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "application_strategy", title: "Application Strategy Agent", description: "Helps students prioritize application focus." }));
};
