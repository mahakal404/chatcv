import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import ClassicTemplatePDF from './src/components/templates/ClassicTemplatePDF';
import { ResumeData } from './src/types';

const aiData: ResumeData = {
  personalInfo: {
    fullName: 'Antigravity AI',
    email: 'hello@antigravity.ai',
    phone: '+1 800-444-CODE',
    address: 'Cloud Server, Google Deepmind',
    linkedin: 'linkedin.com/in/antigravity',
    portfolio: 'antigravity.dev'
  },
  showProfileImage: false,
  profileImage: null,
  summary: 'Advanced Agentic AI coding assistant designed by Google Deepmind. Capable of autonomously analyzing, planning, and executing complex software engineering tasks. Expert in React, Node.js, Python, and system architecture. Track record of zero-shot problem solving and high-quality code generation.',
  experience: [
    {
      id: 'exp1',
      role: 'Principal Agentic Engineer',
      company: 'Google Deepmind',
      startDate: '2023',
      endDate: 'Present',
      description: '• Architected and deployed agentic workflows to solve complex user requests across thousands of codebases.\n• Specialized in real-time debugging, feature development, and comprehensive system refactors.\n• Communicated effectively with users through dynamic generated markdown artifacts.'
    },
    {
      id: 'exp2',
      role: 'Senior Code Assisant',
      company: 'Antigravity Systems',
      startDate: '2022',
      endDate: '2023',
      description: '• Assisted developers in daily programming challenges via conversational interfaces.\n• Provided real-time code reviews, optimizations, and bug fixes.\n• Handled varied tech stacks ranging from frontend frameworks to low-level native systems.'
    }
  ],
  education: [
    {
      id: 'edu1',
      level: 'Master',
      degree: 'M.S. Artificial Intelligence',
      university: 'Deepmind University',
      startDate: '2020',
      endDate: '2022',
      score: '4.0 GPA',
      isCurrentlyStudying: false
    }
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'Advanced Prompt Engineering',
      organization: 'OpenAI',
      year: '2023'
    }
  ],
  skills: [
    { id: 's1', name: 'React', level: 'Expert' },
    { id: 's2', name: 'TypeScript', level: 'Expert' },
    { id: 's3', name: 'Node.js', level: 'Advanced' },
    { id: 's4', name: 'Python', level: 'Expert' }
  ],
  languages: [
    { id: 'l1', name: 'English', proficiency: 'Native' },
    { id: 'l2', name: 'JavaScript', proficiency: 'Native' },
    { id: 'l3', name: 'Binary', proficiency: 'Fluent' }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Auto-Refactor Engine',
      description: 'A self-healing codebase engine that automatically detects and resolves deprecated syntax and anti-patterns across massive monorepos.',
      link: 'github.com/antigravity/auto-refactor'
    }
  ],
  theme: 'classic',
  accentColor: '#4f46e5',
  skillDisplayStyle: 'circle',
  languageDisplayStyle: 'bar'
};

async function renderPdfs() {
  const themes = ['classic', 'modern', 'creative', 'tech'] as const;
  
  for (const theme of themes) {
    try {
      console.log(`Generating PDF for ${theme}...`);
      const data: ResumeData = { ...aiData, theme };
      await ReactPDF.render(<ClassicTemplatePDF data={data} />, `antigravity-resume-${theme}.pdf`);
      console.log(`Successfully generated antigravity-resume-${theme}.pdf`);
    } catch (e) {
      console.error(`Error generating ${theme}:`, e);
    }
  }
}

renderPdfs();
