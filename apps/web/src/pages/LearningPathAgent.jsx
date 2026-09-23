import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const LearningPathAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "learning_path", title: "Learning Path Agent", description: "Maps professional developmental targets to quarters." }));
};
