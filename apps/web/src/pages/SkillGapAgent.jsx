import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const SkillGapAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "skill_gap", title: "Skill Gap Agent", description: "Identifies student vs job criteria skill gaps." }));
};
