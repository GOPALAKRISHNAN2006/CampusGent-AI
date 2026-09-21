import React from 'react';
import { GenericAgentViewer } from '../components/GenericAgentViewer';

export const SkillGapAgent: React.FC = () => {
  return (
    <GenericAgentViewer 
      agentName="skill_gap" 
      title="Skill Gap Agent" 
      description="Identifies student vs job criteria skill gaps." 
    />
  );
};
