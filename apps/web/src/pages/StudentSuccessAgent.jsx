import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';
export const StudentSuccessAgent = () => {
    return (_jsx(GenericAgentViewer, { agentName: "student_success", title: "Student Success Agent", description: "Analyzes student grades and attendance metrics." }));
};
