import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer.jsx';

export const SkillGapAgent = () => {
  return (
    <GenericAgentViewer
      agentName="skill_gap"
      title="Skill Gap Radar Agent"
      description="Compares student profile skills against industry target roles to pinpoint missing competencies."
    />
  );
};
