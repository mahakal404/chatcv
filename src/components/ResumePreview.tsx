import React, { forwardRef, useState } from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe, Edit2, Check, X, Star, Code, Terminal, ExternalLink, Github, Briefcase, GraduationCap, Award, Cpu, User, Languages } from 'lucide-react';

import TechTemplate from './templates/TechTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  onUpdate?: (newData: ResumeData) => void;
  onManualEditRequest?: (callback: () => void) => void;
  isExporting?: boolean;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, onUpdate, onManualEditRequest, isExporting = false }, ref) => {
  if (!data) return null;
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects, theme, accentColor } = data;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleStartEdit = (field: string, initialValue: string, callback: (newValue: string) => void) => {
    const startEditing = () => {
      setEditingField(field);
      setEditValue(initialValue);
    };

    if (onManualEditRequest) {
      onManualEditRequest(startEditing);
    } else {
      startEditing();
    }
  };

  const handleSaveEdit = (callback: (newValue: string) => void) => {
    callback(editValue);
    setEditingField(null);
  };

  const EditableText = ({ 
    value, 
    onSave, 
    fieldId, 
    multiline = false,
    className = "",
    style = {}
  }: { 
    value: string; 
    onSave: (val: string) => void; 
    fieldId: string;
    multiline?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const isEditing = editingField === fieldId;

    if (isEditing) {
      return (
        <div className="relative group/edit flex items-start gap-2 w-full" style={style}>
          {multiline ? (
            <textarea
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full p-2 border-2 border-indigo-500 rounded-lg focus:outline-none bg-indigo-50/50 ${className}`}
              rows={4}
            />
          ) : (
            <input
              autoFocus
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full p-1 border-b-2 border-indigo-500 focus:outline-none bg-indigo-50/50 ${className}`}
            />
          )}
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => handleSaveEdit(onSave)}
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={() => setEditingField(null)}
              className="p-1 bg-slate-400 text-white rounded hover:bg-slate-500 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="group/text relative" style={style}>
        <div className={className}>{value || (isExporting ? '' : 'Click to edit...')}</div>
        {!isExporting && (
          <button
            onClick={() => handleStartEdit(fieldId, value, onSave)}
            className="absolute -right-8 top-0 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 opacity-0 group-hover/text:opacity-100 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <Edit2 size={12} />
          </button>
        )}
      </div>
    );
  };

  const updatePersonalInfo = (field: keyof typeof personalInfo, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        personalInfo: { ...(personalInfo || {}), [field]: val } as any
      });
    }
  };

  const updateSummary = (val: string) => {
    if (onUpdate) onUpdate({ ...data, summary: val });
  };

  const updateExperience = (id: string, field: string, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        experience: (experience || []).map(exp => exp.id === id ? { ...exp, [field]: val } : exp)
      });
    }
  };

  const updateEducation = (id: string, field: string, val: any) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        education: (education || []).map(edu => edu.id === id ? { ...edu, [field]: val } : edu)
      });
    }
  };

  const updateCertification = (id: string, field: string, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        certifications: (certifications || []).map(cert => cert.id === id ? { ...cert, [field]: val } : cert)
      });
    }
  };

  const updateProject = (id: string, field: string, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        projects: (projects || []).map(p => p.id === id ? { ...p, [field]: val } : p)
      });
    }
  };

  const updateCustomSection = (id: string, field: string, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        customSections: (data.customSections || []).map(s => s.id === id ? { ...s, [field]: val } : s)
      });
    }
  };

  const updateLanguage = (id: string, field: string, val: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        languages: (languages || []).map(l => l.id === id ? { ...l, [field]: val } : l)
      });
    }
  };

  const CircularProgressRing = ({ percentage, isSidebar, accentColor }: { percentage: number, isSidebar: boolean, accentColor: string }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ 
        position: 'relative', 
        width: '36px', 
        height: '36px', 
        marginLeft: 'auto', 
        display: 'inline-block',
        flexShrink: 0,
        overflow: 'visible',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}>
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 44 44" 
          style={{ 
            transform: 'rotate(-90deg)', 
            overflow: 'visible',
            display: 'block'
          }}
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={isSidebar ? "rgba(255,255,255,0.2)" : "#e2e8f0"}
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke={isSidebar ? "#ffffff" : accentColor}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${offset}`}
            strokeLinecap="round"
          />
          <text
            x="22"
            y="22"
            dominantBaseline="central"
            textAnchor="middle"
            fill={isSidebar ? "#ffffff" : "#334155"}
            transform="rotate(90 22 22)"
            style={{ fontSize: '9px', fontWeight: 900, fontFamily: 'Arial, sans-serif' }}
          >
            {percentage}%
          </text>
        </svg>
      </div>
    );
  };

  const ProficiencyDisplay = ({ level, type, isSidebar = false }: { level: string, type: 'skill' | 'language', isSidebar?: boolean }) => {
    const { skillDisplayStyle, languageDisplayStyle, accentColor } = data;
    const displayStyle = type === 'skill' ? (skillDisplayStyle || 'text') : (languageDisplayStyle || 'text');
    
    let percentage = 50;
    let dots = 2;
    
    if (type === 'skill') {
      const levelMap: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
      dots = levelMap[level] || 2;
      percentage = level === 'Beginner' ? 25 : level === 'Intermediate' ? 50 : level === 'Advanced' ? 75 : 100;
    } else {
      const levelMap: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Fluent': 3, 'Native': 4 };
      dots = levelMap[level] || 2;
      percentage = level === 'Beginner' ? 25 : level === 'Intermediate' ? 50 : level === 'Fluent' ? 75 : 100;
    }

    if (displayStyle === 'text') {
      return <span className={`text-[10px] font-bold uppercase ${isSidebar ? 'text-white/60' : 'text-slate-400'}`}>{level}</span>;
    }

    if (displayStyle === 'bar') {
      return (
        <div className={`h-1.5 w-24 rounded-full overflow-hidden ml-auto ${isSidebar ? 'bg-white/20' : 'bg-slate-100'}`}>
          <div 
            className="h-full rounded-full transition-all duration-1000" 
            style={{ backgroundColor: isSidebar ? '#ffffff' : accentColor, width: `${percentage}%` }} 
          />
        </div>
      );
    }

    if (displayStyle === 'circle') {
      return <CircularProgressRing percentage={percentage} isSidebar={isSidebar} accentColor={accentColor} />;
    }

    return (
      <div className="flex gap-1 ml-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-3 h-3">
            {displayStyle === 'stars' ? (
              <Star 
                size={12} 
                fill={i <= dots ? (isSidebar ? "#ffffff" : accentColor) : "none"} 
                stroke={i <= dots ? (isSidebar ? "#ffffff" : accentColor) : (isSidebar ? "rgba(255,255,255,0.2)" : "#e2e8f0")} 
              />
            ) : (
              <div 
                className={`w-2 h-2 rounded-full ${i <= dots ? '' : (isSidebar ? 'bg-white/20' : 'bg-slate-200')}`}
                style={i <= dots ? { backgroundColor: isSidebar ? '#ffffff' : accentColor } : {}}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const ProfilePhoto = ({ className = "w-[120px] h-[120px]" }: { className?: string }) => {
    if (!data.showProfileImage || !data.profileImage) return null;
    return (
      <div className="flex justify-center mb-4">
        <img 
          src={data.profileImage} 
          alt={personalInfo.fullName} 
          className={`${className} rounded-full object-cover object-center border-4 border-indigo-500 shadow-xl`}
        />
      </div>
    );
  };

  const renderTheme = () => {
    switch (theme) {
      case 'classic':
        return (
          <div className="p-12 h-full flex flex-col font-serif">
            <ProfilePhoto />
            <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
              <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">
                <EditableText 
                  value={personalInfo?.fullName || ''} 
                  onSave={(v) => updatePersonalInfo('fullName', v)} 
                  fieldId="fullName"
                  className="text-center"
                />
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                {personalInfo?.email && (
                  <span className="flex items-center gap-2">
                    <Mail size={12} className="relative top-[2px]" /> 
                    <EditableText value={personalInfo.email} onSave={(v) => updatePersonalInfo('email', v)} fieldId="email" />
                  </span>
                )}
                {personalInfo?.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={12} className="relative top-[2px]" /> 
                    <EditableText value={personalInfo.phone} onSave={(v) => updatePersonalInfo('phone', v)} fieldId="phone" />
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {summary && summary.trim() !== '' && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-3 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <User size={18} className="relative top-[2px]" /> Summary
                  </h2>
                  <EditableText 
                    value={summary} 
                    onSave={updateSummary} 
                    fieldId="summary" 
                    multiline 
                    className="text-sm leading-relaxed text-slate-700"
                  />
                </section>
              )}

              {experience && experience.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-4 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <Briefcase size={18} className="relative top-[2px]" /> Experience
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="flex justify-between items-baseline mb-1">
                          <EditableText 
                            value={exp.role || ''} 
                            onSave={(v) => updateExperience(exp.id, 'role', v)} 
                            fieldId={`exp-role-${exp.id}`}
                            className="font-bold text-slate-900"
                          />
                          {(exp.startDate || exp.endDate) && (
                            <span className="text-xs text-slate-500">{exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}</span>
                          )}
                        </div>
                        {exp.company && exp.company.trim() !== '' && (
                          <EditableText 
                            value={exp.company} 
                            onSave={(v) => updateExperience(exp.id, 'company', v)} 
                            fieldId={`exp-company-${exp.id}`}
                            className="text-sm font-semibold text-slate-700 mb-2"
                          />
                        )}
                        {exp.description && exp.description.trim() !== '' && (
                          <EditableText 
                            value={exp.description} 
                            onSave={(v) => updateExperience(exp.id, 'description', v)} 
                            fieldId={`exp-desc-${exp.id}`}
                            multiline
                            className="text-sm text-slate-600 whitespace-pre-line"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {education && education.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-4 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <GraduationCap size={18} className="relative top-[2px]" /> Education
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu) => {
                      const degreeText = (edu.level === '10th' || edu.level === '12th') 
                        ? `${edu.level} ${edu.board ? `(${edu.board})` : ''}` 
                        : edu.degree || '';
                      
                      const institutionText = (edu.level === '10th' || edu.level === '12th') 
                        ? edu.school || '' 
                        : `${edu.college || ''}${edu.college && edu.university ? ', ' : ''}${edu.university || ''}`;

                      if (!degreeText && !institutionText && !edu.score && !edu.startDate && !edu.endDate) return null;

                      return (
                        <div key={edu.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline mb-1">
                            {degreeText && (
                              <EditableText 
                                value={degreeText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'board' : 'degree', v)} 
                                fieldId={`edu-degree-${edu.id}`}
                                className="font-bold text-slate-900"
                              />
                            )}
                            {(edu.startDate || edu.endDate) && (
                              <span className="text-xs text-slate-500">{edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-baseline">
                            {institutionText && (
                              <EditableText 
                                value={institutionText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'school' : 'college', v)} 
                                fieldId={`edu-school-${edu.id}`}
                                className="text-sm text-slate-700 italic"
                              />
                            )}
                            {edu.score && <span className="text-xs font-bold text-slate-700">{edu.score}</span>}
                          </div>
                          {(edu.level === '10th' || edu.level === '12th') && edu.stream && (
                            <p className="text-xs text-slate-500 mt-1">Stream: {edu.stream}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {certifications && certifications.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-4 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <Award size={18} className="relative top-[2px]" /> Certifications
                  </h2>
                  <div className="space-y-3">
                    {certifications.map((cert) => {
                      if (!cert.name && !cert.organization && !cert.year) return null;
                      return (
                        <div key={cert.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline">
                          <div>
                            {cert.name && (
                              <EditableText 
                                value={cert.name} 
                                onSave={(v) => updateCertification(cert.id, 'name', v)} 
                                fieldId={`cert-name-${cert.id}`}
                                className="font-bold text-sm text-slate-900"
                              />
                            )}
                            {cert.organization && (
                              <EditableText 
                                value={cert.organization} 
                                onSave={(v) => updateCertification(cert.id, 'organization', v)} 
                                fieldId={`cert-org-${cert.id}`}
                                className="text-xs text-slate-600"
                              />
                            )}
                          </div>
                          {cert.year && <span className="text-xs text-slate-500">{cert.year}</span>}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </section>
              )}

              {projects && projects.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-4 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <Code size={18} className="relative top-[2px]" /> Projects
                  </h2>
                  <div className="space-y-6">
                    {projects.map((p) => (
                      <div key={p.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="flex justify-between items-baseline mb-1">
                          <EditableText 
                            value={p.title || ''} 
                            onSave={(v) => updateProject(p.id, 'title', v)} 
                            fieldId={`proj-title-${p.id}`}
                            className="font-bold text-slate-900"
                          />
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">View Project</a>
                          )}
                        </div>
                        {p.description && p.description.trim() !== '' && (
                          <EditableText 
                            value={p.description} 
                            onSave={(v) => updateProject(p.id, 'description', v)} 
                            fieldId={`proj-desc-${p.id}`}
                            multiline
                            className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {skills && skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-3 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <Cpu size={18} className="relative top-[2px]" /> Skills
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span className="capitalize text-sm font-medium tracking-wider">{skill.name}</span>
                          <ProficiencyDisplay level={skill.level} type="skill" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {languages && languages.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b mb-3 flex items-center gap-2" style={{ color: accentColor, borderColor: accentColor }}>
                    <Languages size={18} className="relative top-[2px]" /> Languages
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {languages.map((lang) => (
                      <div key={lang.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span className="capitalize text-sm font-medium tracking-wider">{lang.name}</span>
                          <ProficiencyDisplay level={lang.proficiency} type="language" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.customSections && data.customSections.length > 0 && data.customSections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-lg font-bold uppercase border-b mb-3" style={{ color: accentColor, borderColor: accentColor }}>
                    <EditableText 
                      value={section.title} 
                      onSave={(v) => updateCustomSection(section.id, 'title', v)} 
                      fieldId={`custom-title-${section.id}`}
                    />
                  </h2>
                  <EditableText 
                    value={section.content} 
                    onSave={(v) => updateCustomSection(section.id, 'content', v)} 
                    fieldId={`custom-content-${section.id}`}
                    multiline
                    className="text-sm leading-relaxed text-slate-700 whitespace-pre-line"
                  />
                </section>
              ))}
            </div>
          </div>
        );

      case 'creative':
        return (
          <div className="h-full flex font-sans">
            <div className="w-1/3 text-white px-10 py-10 flex flex-col gap-8" style={{ backgroundColor: accentColor }}>
              <ProfilePhoto className="w-32 h-32" />
              <div className="mb-4">
                <EditableText 
                  value={personalInfo?.fullName || ''} 
                  onSave={(v) => updatePersonalInfo('fullName', v)} 
                  fieldId="fullName"
                  className="text-3xl font-black leading-tight mb-2"
                />
                <p className="text-xs opacity-80 uppercase tracking-widest">Professional Resume</p>
              </div>

              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">Contact</h2>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2"><Mail size={14} className="relative top-[2px]" /> <EditableText value={personalInfo?.email || ''} onSave={(v) => updatePersonalInfo('email', v)} fieldId="email" /></div>
                  <div className="flex items-center gap-2"><Phone size={14} className="relative top-[2px]" /> <EditableText value={personalInfo?.phone || ''} onSave={(v) => updatePersonalInfo('phone', v)} fieldId="phone" /></div>
                </div>
              </section>

              {languages && languages.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-60">Languages</h2>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="flex flex-row items-center justify-between w-full">
                          <span className="capitalize text-sm font-medium tracking-wider">{lang.name}</span>
                          <ProficiencyDisplay level={lang.proficiency} type="language" isSidebar />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="flex-1 p-10 bg-white">
              {summary && summary.trim() !== '' && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                    <User size={14} className="relative top-[2px]" /> Profile
                  </h2>
                  <EditableText 
                    value={summary} 
                    onSave={updateSummary} 
                    fieldId="summary" 
                    multiline 
                    className="text-sm leading-relaxed text-slate-600"
                  />
                </section>
              )}

              {experience && experience.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: accentColor }}>
                    <Briefcase size={14} className="relative top-[2px]" /> Experience
                  </h2>
                  <div className="space-y-8">
                    {experience.map((exp) => (
                      <div key={exp.id} className="block w-full relative pl-6 border-l-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', borderColor: accentColor }}>
                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: accentColor }} />
                        <div className="flex justify-between items-baseline mb-1">
                          <EditableText 
                            value={exp.role || ''} 
                            onSave={(v) => updateExperience(exp.id, 'role', v)} 
                            fieldId={`exp-role-${exp.id}`}
                            className="font-bold text-slate-900"
                          />
                          {(exp.startDate || exp.endDate) && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{exp.startDate} {exp.startDate && exp.endDate ? '-' : ''} {exp.endDate}</span>
                          )}
                        </div>
                        {exp.company && exp.company.trim() !== '' && (
                          <EditableText 
                            value={exp.company} 
                            onSave={(v) => updateExperience(exp.id, 'company', v)} 
                            fieldId={`exp-company-${exp.id}`}
                            className="text-xs font-bold text-slate-500 mb-3"
                          />
                        )}
                        {exp.description && exp.description.trim() !== '' && (
                          <EditableText 
                            value={exp.description} 
                            onSave={(v) => updateExperience(exp.id, 'description', v)} 
                            fieldId={`exp-desc-${exp.id}`}
                            multiline
                            className="text-xs text-slate-600 leading-relaxed"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {education && education.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: accentColor }}>
                    <GraduationCap size={14} className="relative top-[2px]" /> Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => {
                      const degreeText = (edu.level === '10th' || edu.level === '12th') 
                        ? `${edu.level} ${edu.board ? `(${edu.board})` : ''}` 
                        : edu.degree || '';
                      
                      const institutionText = (edu.level === '10th' || edu.level === '12th') 
                        ? edu.school || '' 
                        : `${edu.college || ''}${edu.college && edu.university ? ', ' : ''}${edu.university || ''}`;

                      if (!degreeText && !institutionText && !edu.score && !edu.startDate && !edu.endDate) return null;

                      return (
                        <div key={edu.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline mb-1">
                            {degreeText && (
                              <EditableText 
                                value={degreeText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'board' : 'degree', v)} 
                                fieldId={`edu-degree-${edu.id}`}
                                className="font-bold text-slate-900"
                              />
                            )}
                            {(edu.startDate || edu.endDate) && (
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}</span>
                            )}
                          </div>
                          <div className="flex justify-between items-baseline">
                            {institutionText && (
                              <EditableText 
                                value={institutionText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'school' : 'college', v)} 
                                fieldId={`edu-school-${edu.id}`}
                                className="text-xs text-slate-500"
                              />
                            )}
                            {edu.score && <span className="text-[10px] font-bold text-slate-500">{edu.score}</span>}
                          </div>
                          {(edu.level === '10th' || edu.level === '12th') && edu.stream && (
                            <p className="text-[10px] text-slate-400 mt-1 italic">Stream: {edu.stream}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {skills && skills.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                    <Cpu size={14} className="relative top-[2px]" /> Skills
                  </h2>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {skills.map((skill) => (
                      <div key={skill.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                        <div className="text-xs font-semibold text-slate-700 capitalize mb-1">{skill.name}</div>
                        <ProficiencyDisplay level={skill.level} type="skill" />
                      </div>
                    ))}
                  </div>
                </section>
              )}


              {certifications && certifications.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: accentColor }}>
                    <Award size={14} className="relative top-[2px]" /> Certifications
                  </h2>
                  <div className="space-y-4">
                    {certifications.map((cert) => {
                      if (!cert.name && !cert.organization && !cert.year) return null;
                      return (
                        <div key={cert.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline inline-block w-full break-inside-avoid page-break-inside-avoid">
                          <div>
                            {cert.name && (
                              <EditableText 
                                value={cert.name} 
                                onSave={(v) => updateCertification(cert.id, 'name', v)} 
                                fieldId={`cert-name-${cert.id}`}
                                className="font-bold text-xs text-slate-900"
                              />
                            )}
                            {cert.organization && (
                              <EditableText 
                                value={cert.organization} 
                                onSave={(v) => updateCertification(cert.id, 'organization', v)} 
                                fieldId={`cert-org-${cert.id}`}
                                className="text-[10px] text-slate-500"
                              />
                            )}
                          </div>
                          {cert.year && <span className="text-[10px] font-bold text-slate-400 uppercase">{cert.year}</span>}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </section>
              )}

              {projects && projects.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: accentColor }}>
                    <Code size={14} className="relative top-[2px]" /> Projects
                  </h2>
                  <div className="space-y-8">
                    {projects.map((p) => (
                      <div key={p.id} className="block w-full relative pl-6 border-l-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', borderColor: accentColor }}>
                        <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: accentColor }} />
                        <div className="flex justify-between items-baseline mb-1">
                          <EditableText 
                            value={p.title || ''} 
                            onSave={(v) => updateProject(p.id, 'title', v)} 
                            fieldId={`proj-title-${p.id}`}
                            className="font-bold text-slate-900"
                          />
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">Link</a>
                          )}
                        </div>
                        {p.description && p.description.trim() !== '' && (
                          <EditableText 
                            value={p.description} 
                            onSave={(v) => updateProject(p.id, 'description', v)} 
                            fieldId={`proj-desc-${p.id}`}
                            multiline
                            className="text-xs text-slate-600 leading-relaxed"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.customSections && data.customSections.length > 0 && data.customSections.map((section) => (
                <section key={section.id} className="mb-10">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                    <EditableText 
                      value={section.title} 
                      onSave={(v) => updateCustomSection(section.id, 'title', v)} 
                      fieldId={`custom-title-${section.id}`}
                    />
                  </h2>
                  <EditableText 
                    value={section.content} 
                    onSave={(v) => updateCustomSection(section.id, 'content', v)} 
                    fieldId={`custom-content-${section.id}`}
                    multiline
                    className="text-xs text-slate-600 leading-relaxed whitespace-pre-line"
                  />
                </section>
              ))}
            </div>
          </div>
        );

      case 'tech':
        return (
          <TechTemplate 
            data={data}
            accentColor={accentColor || '#4f46e5'}
            isExporting={isExporting}
            EditableText={EditableText}
            ProficiencyDisplay={ProficiencyDisplay}
            ProfilePhoto={ProfilePhoto}
            updatePersonalInfo={updatePersonalInfo}
            updateSummary={updateSummary}
            updateExperience={updateExperience}
            updateEducation={updateEducation}
            updateCertification={updateCertification}
            updateProject={updateProject}
            updateCustomSection={updateCustomSection}
            updateLanguage={updateLanguage}
          />
        );

      case 'modern':
        return (
          <div className="p-10 h-full flex flex-col font-sans bg-white">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-6 items-start">
                <ProfilePhoto className="w-24 h-24" />
                <div className="max-w-[60%]">
                  <EditableText 
                    value={personalInfo?.fullName || ''} 
                    onSave={(v) => updatePersonalInfo('fullName', v)} 
                    fieldId="fullName"
                    className="text-5xl font-black text-slate-900 mb-2 leading-none"
                  />
                  <div className="h-2 w-20 rounded-full" style={{ backgroundColor: accentColor }} />
                </div>
              </div>
              <div className="text-right space-y-1 text-xs text-slate-500 font-medium">
                <div className="flex items-center justify-end gap-2 w-full">
                  <EditableText value={personalInfo?.email || ''} onSave={(v) => updatePersonalInfo('email', v)} fieldId="email" />
                  <Mail size={12} className="relative top-[2px]" style={{ color: accentColor }} />
                </div>
                <div className="flex items-center justify-end gap-2 w-full">
                  <EditableText value={personalInfo?.phone || ''} onSave={(v) => updatePersonalInfo('phone', v)} fieldId="phone" />
                  <Phone size={12} className="relative top-[2px]" style={{ color: accentColor }} />
                </div>
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex-1 space-y-10">
                {summary && summary.trim() !== '' && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-400">Professional Summary</h2>
                    <EditableText 
                      value={summary} 
                      onSave={updateSummary} 
                      fieldId="summary" 
                      multiline 
                      className="text-sm leading-relaxed text-slate-700"
                    />
                  </section>
                )}

                {experience && experience.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Work Experience</h2>
                    <div className="space-y-8">
                      {experience.map((exp) => (
                        <div key={exp.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline mb-1">
                            <EditableText 
                              value={exp.role || ''} 
                              onSave={(v) => updateExperience(exp.id, 'role', v)} 
                              fieldId={`exp-role-${exp.id}`}
                              className="text-lg font-bold text-slate-900"
                            />
                            {(exp.startDate || exp.endDate) && (
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}</span>
                            )}
                          </div>
                          {exp.company && exp.company.trim() !== '' && (
                            <EditableText 
                              value={exp.company} 
                              onSave={(v) => updateExperience(exp.id, 'company', v)} 
                              fieldId={`exp-company-${exp.id}`}
                              className="text-sm font-bold mb-3"
                              style={{ color: accentColor }}
                            />
                          )}
                          {exp.description && exp.description.trim() !== '' && (
                            <EditableText 
                              value={exp.description} 
                              onSave={(v) => updateExperience(exp.id, 'description', v)} 
                              fieldId={`exp-desc-${exp.id}`}
                              multiline
                              className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {education && education.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-400 flex items-center gap-2">
                      <GraduationCap size={14} className="relative top-[2px]" /> Education
                    </h2>
                    <div className="space-y-6">
                      {education.map((edu) => {
                        const degreeText = (edu.level === '10th' || edu.level === '12th') 
                          ? `${edu.level} ${edu.board ? `(${edu.board})` : ''}` 
                          : edu.degree || '';
                        
                        const institutionText = (edu.level === '10th' || edu.level === '12th') 
                          ? edu.school || '' 
                          : `${edu.college || ''}${edu.college && edu.university ? ', ' : ''}${edu.university || ''}`;

                        if (!degreeText && !institutionText && !edu.score && !edu.startDate && !edu.endDate) return null;

                        return (
                          <div key={edu.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                            {degreeText && (
                              <EditableText 
                                value={degreeText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'board' : 'degree', v)} 
                                fieldId={`edu-degree-${edu.id}`}
                                className="font-bold text-sm text-slate-900"
                              />
                            )}
                            {institutionText && (
                              <EditableText 
                                value={institutionText} 
                                onSave={(v) => updateEducation(edu.id, (edu.level === '10th' || edu.level === '12th') ? 'school' : 'college', v)} 
                                fieldId={`edu-school-${edu.id}`}
                                className="text-xs text-slate-500 mb-1"
                              />
                            )}
                            <div className="flex justify-between items-center">
                              {(edu.startDate || edu.endDate) && (
                                <p className="text-[10px] font-bold text-slate-400">{edu.startDate} {edu.startDate && edu.endDate ? '-' : ''} {edu.endDate}</p>
                              )}
                              {edu.score && <span className="text-[10px] font-black text-indigo-600">{edu.score}</span>}
                            </div>
                            {(edu.level === '10th' || edu.level === '12th') && edu.stream && (
                              <p className="text-[10px] text-slate-400 mt-1 italic">Stream: {edu.stream}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {languages && languages.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-400 flex items-center gap-2">
                      <Languages size={14} className="relative top-[2px]" /> Languages
                    </h2>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <div key={lang.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex flex-row items-center justify-between w-full">
                            <span className="capitalize text-sm font-medium text-slate-700 tracking-wider">{lang.name}</span>
                            <ProficiencyDisplay level={lang.proficiency} type="language" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {projects && projects.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Projects</h2>
                    <div className="space-y-8">
                      {projects.map((p) => (
                        <div key={p.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex justify-between items-baseline mb-1">
                            <EditableText 
                              value={p.title || ''} 
                              onSave={(v) => updateProject(p.id, 'title', v)} 
                              fieldId={`proj-title-${p.id}`}
                              className="text-lg font-bold text-slate-900"
                            />
                            {p.link && (
                              <a href={p.link} target="_blank" rel="noreferrer" className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline">Link</a>
                            )}
                          </div>
                          {p.description && p.description.trim() !== '' && (
                            <EditableText 
                              value={p.description} 
                              onSave={(v) => updateProject(p.id, 'description', v)} 
                              fieldId={`proj-desc-${p.id}`}
                              multiline
                              className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {data.customSections && data.customSections.length > 0 && data.customSections.map((section) => (
                  <section key={section.id}>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">
                      <EditableText 
                        value={section.title} 
                        onSave={(v) => updateCustomSection(section.id, 'title', v)} 
                        fieldId={`custom-title-${section.id}`}
                      />
                    </h2>
                    <EditableText 
                      value={section.content} 
                      onSave={(v) => updateCustomSection(section.id, 'content', v)} 
                      fieldId={`custom-content-${section.id}`}
                      multiline
                      className="text-sm text-slate-600 leading-relaxed whitespace-pre-line"
                    />
                  </section>
                ))}
              </div>

              <div className="w-64 space-y-10">
                {skills && skills.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-400 flex items-center gap-2">
                      <Cpu size={14} className="relative top-[2px]" /> Skills
                    </h2>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="flex flex-row items-center justify-between w-full">
                            <span className="capitalize text-sm font-medium text-slate-700 tracking-wider">{skill.name}</span>
                            <ProficiencyDisplay level={skill.level} type="skill" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {certifications && certifications.length > 0 && (
                  <section>
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-slate-400 flex items-center gap-2">
                      <Award size={14} className="relative top-[2px]" /> Certifications
                    </h2>
                    <div className="space-y-4">
                      {certifications.map((cert) => {
                        if (!cert.name && !cert.organization && !cert.year) return null;
                        return (
                          <div key={cert.id} className="block w-full" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                            {cert.name && (
                              <EditableText 
                                value={cert.name} 
                                onSave={(v) => updateCertification(cert.id, 'name', v)} 
                                fieldId={`cert-name-${cert.id}`}
                                className="font-bold text-xs text-slate-900"
                              />
                            )}
                            <div className="flex justify-between items-center">
                              {cert.organization && (
                                <EditableText 
                                  value={cert.organization} 
                                  onSave={(v) => updateCertification(cert.id, 'organization', v)} 
                                  fieldId={`cert-org-${cert.id}`}
                                  className="text-[10px] text-slate-500"
                                />
                              )}
                              {cert.year && <span className="text-[10px] font-bold text-slate-400">{cert.year}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-sm" style={{ overflow: 'visible' }}>
      {renderTheme()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
