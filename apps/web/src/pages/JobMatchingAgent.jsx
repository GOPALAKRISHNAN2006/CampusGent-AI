import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const JobMatchingAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "job_matching", title: "Job Matching Agent", description: "Compares vacancy qualifications requirements parameters." }));
};
