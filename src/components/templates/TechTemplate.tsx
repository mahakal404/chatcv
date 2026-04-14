import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, Linkedin, Globe, Terminal, Code, Briefcase, Cpu, ExternalLink, GraduationCap, Award } from 'lucide-react';

interface TechTemplateProps {
  data: ResumeData;
  accentColor: string;
  isExporting: boolean;
  EditableText: any;
  ProficiencyDisplay: any;
  ProfilePhoto: any;
  updatePersonalInfo: (field: any, val: string) => void;
  updateSummary: (val: string) => void;
  updateExperience: (id: string, field: string, val: string) => void;
  updateEducation: (id: string, field: string, val: any) => void;
  updateCertification: (id: string, field: string, val: string) => void;
  updateProject: (id: string, field: string, val: string) => void;
  updateCustomSection: (id: string, field: string, val: string) => void;
  updateLanguage: (id: string, field: string, val: string) => void;
}

const TechTemplate: React.FC<TechTemplateProps> = (props) => {
  const { 
    data, accentColor, isExporting, EditableText, ProficiencyDisplay, ProfilePhoto,
    updatePersonalInfo, updateSummary, updateExperience, updateEducation,
    updateCertification, updateProject, updateCustomSection, updateLanguage
  } = props;
  
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects } = data;

  return (
    <div className="p-10 flex flex-col font-sans bg-white text-slate-900 h-full">
      {/* Tech Header */}
      <header className="mb-8 border-b-4 pb-6" style={{ borderColor: accentColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex flex-row items-center sm:items-start gap-6 flex-1 w-full">
            <ProfilePhoto className="w-20 h-20 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 flex-wrap">
                  <Terminal size={32} className="flex-shrink-0" style={{ color: accentColor }} />
                  <div className="break-words max-w-full">
                    <EditableText 
                      value={personalInfo?.fullName || ''} 
                      onSave={(v: string) => updatePersonalInfo('fullName', v)} 
                      fieldId="fullName"
                      className="uppercase break-words"
                    />
                  </div>
                </h1>
                <div className="hidden sm:block flex-shrink-0">
                  <div className="px-4 py-2 bg-slate-900 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                    System.Status: <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                {personalInfo?.email && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Mail size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                    <EditableText value={personalInfo.email} onSave={(v: string) => updatePersonalInfo('email', v)} fieldId="email" className="break-all" />
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                    <EditableText value={personalInfo.phone} onSave={(v: string) => updatePersonalInfo('phone', v)} fieldId="phone" />
                  </div>
                )}
                {personalInfo?.linkedin && (
                  <div className="flex items-center gap-1.5 break-all">
                    <Linkedin size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                    <EditableText value={personalInfo.linkedin} onSave={(v: string) => updatePersonalInfo('linkedin', v)} fieldId="linkedin" />
                  </div>
                )}
                {personalInfo?.portfolio && (
                  <div className="flex items-center gap-1.5 break-all">
                    <Globe size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                    <EditableText value={personalInfo.portfolio} onSave={(v: string) => updatePersonalInfo('portfolio', v)} fieldId="portfolio" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {summary && summary.trim() !== '' && (
        <section className="block w-full mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            <span className="inline-flex items-center align-middle gap-2">
              <Code size={16} className="relative top-[2px]" /> Executive Summary
            </span>
          </h2>
          <EditableText 
            value={summary} 
            onSave={updateSummary} 
            fieldId="summary" 
            multiline 
            className="text-sm leading-relaxed text-slate-700 font-medium"
          />
        </section>
      )}

      <div className="flex flex-row gap-8 mb-8">
        {/* Left Column (flex 1.5) */}
        <div className="flex-[1.5] space-y-8">
          {experience && experience.length > 0 && (
            <section className="block w-full">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                <span className="inline-flex items-center align-middle gap-2">
                  <Briefcase size={16} className="relative top-[2px]" /> Professional Experience
                </span>
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="block w-full group/item" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex-1">
                        <EditableText 
                          value={exp.role || ''} 
                          onSave={(v: string) => updateExperience(exp.id, 'role', v)} 
                          fieldId={`exp-role-${exp.id}`}
                          className="text-base font-bold text-slate-900"
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase whitespace-nowrap ml-2">
                        {exp.startDate} {exp.startDate && exp.endDate ? '::' : ''} {exp.endDate}
                      </span>
                    </div>
                    <EditableText 
                      value={exp.company || ''} 
                      onSave={(v: string) => updateExperience(exp.id, 'company', v)} 
                      fieldId={`exp-company-${exp.id}`}
                      className="text-xs font-bold mb-2 uppercase tracking-wider"
                      style={{ color: accentColor }}
                    />
                    <EditableText 
                      value={exp.description || ''} 
                      onSave={(v: string) => updateExperience(exp.id, 'description', v)} 
                      fieldId={`exp-desc-${exp.id}`}
                      multiline
                      className="text-sm text-slate-600 leading-relaxed whitespace-pre-line border-l-2 pl-4 ml-1"
                      style={{ borderColor: `${accentColor}40` }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section className="block w-full mt-4">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                <span className="inline-flex items-center align-middle gap-2">
                  <GraduationCap size={14} className="relative top-[2px]" /> Education
                </span>
              </h2>
              <div className="flex flex-col">
                {education.map((edu) => (
                  <div key={edu.id} className="flex-1 text-sm mb-3" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-start mb-1">
                      <EditableText 
                        value={edu.degree || edu.level || ''} 
                        onSave={(v: string) => updateEducation(edu.id, 'degree', v)} 
                        fieldId={`edu-degree-${edu.id}`}
                        className="font-bold text-slate-900"
                      />
                      <div className="text-[10px] font-mono text-slate-400">
                        {edu.startDate} — {edu.endDate}
                      </div>
                    </div>
                    <EditableText 
                      value={edu.university || edu.school || ''} 
                      onSave={(v: string) => updateEducation(edu.id, 'university', v)} 
                      fieldId={`edu-school-${edu.id}`}
                      className="text-slate-500 italic text-xs"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages && languages.length > 0 && (
            <section className="block w-full mt-4">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                <span className="inline-flex items-center align-middle gap-2">
                  <Globe size={14} className="relative top-[2px]" /> Languages
                </span>
              </h2>
              <div className="flex flex-wrap gap-4 mt-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center justify-between w-[45%] mb-2" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <span className="text-sm font-medium text-slate-700 capitalize tracking-wider">{lang.name}</span>
                    <ProficiencyDisplay level={lang.proficiency} type="language" />
                  </div>
                ))}
              </div>
            </section>

          )}

          {projects && projects.length > 0 && (
            <section className="block w-full mt-4">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                <span className="inline-flex items-center align-middle gap-2">
                  <Cpu size={16} className="relative top-[2px]" /> Technical Projects
                </span>
              </h2>
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="block w-full p-4 bg-slate-50 rounded-xl border border-slate-100" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-center mb-2">
                      <EditableText 
                        value={p.title || ''} 
                        onSave={(v: string) => updateProject(p.id, 'title', v)} 
                        fieldId={`proj-title-${p.id}`}
                        className="font-bold text-slate-900"
                      />
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase hover:underline">
                          <ExternalLink size={10} /> Source
                        </a>
                      )}
                    </div>
                    <EditableText 
                      value={p.description || ''} 
                      onSave={(v: string) => updateProject(p.id, 'description', v)} 
                      fieldId={`proj-desc-${p.id}`}
                      multiline
                      className="text-xs text-slate-600 leading-relaxed whitespace-pre-line"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section className="block w-full mt-4">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>
                <span className="inline-flex items-center align-middle gap-2">
                  <Award size={14} className="relative top-[2px]" /> Certifications
                </span>
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="block w-full text-xs" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <div className="flex justify-between items-baseline">
                      <EditableText 
                        value={cert.name || ''} 
                        onSave={(v: string) => updateCertification(cert.id, 'name', v)} 
                        fieldId={`cert-name-${cert.id}`}
                        className="font-bold text-slate-900"
                      />
                      <div className="text-[10px] font-mono text-slate-400">
                        {cert.organization} · {cert.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (flex 1) */}
        <div className="flex-1 space-y-8">
          {skills && skills.length > 0 && (
            <section className="block w-full text-left" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-slate-900">
                <span className="inline-flex items-center align-middle gap-2">
                  <Terminal size={14} className="relative top-[2px]" /> Technical Stack
                </span>
              </h2>
              <div className="flex flex-col gap-3">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="block px-3 py-2 rounded border border-slate-200 bg-slate-50"
                    style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
                  >
                    <div className="text-xs font-bold text-slate-900 mb-1 capitalize tracking-wider">{skill.name}</div>
                    <ProficiencyDisplay level={skill.level} type="skill" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechTemplate;
