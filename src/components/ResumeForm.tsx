import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education, Project, Certification, Skill, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { User, Briefcase, GraduationCap, Code, Folder, Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Award, Calculator, ExternalLink, Layers, Languages, Camera, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

interface ResumeFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onAIImprove: (section: string, content: string) => Promise<string>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ResumeForm({ data, setData, onAIImprove }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageToCrop(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input to allow picking same file if needed
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const finalizeCrop = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) return;
      const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setData({ ...data, profileImage: croppedImageBase64 });
      setImageToCrop(null);
    } catch (e) {
      console.error(e);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleAIImproveSummary = async () => {
    const improved = await onAIImprove('summary', data.summary);
    setData({ ...data, summary: improved });
  };

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '', isCurrent: false };
    setData({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = { 
      id: Date.now().toString(), 
      level: 'Bachelor',
      startDate: '', 
      endDate: '',
      score: '',
      isCurrentlyStudying: false
    };
    setData({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addCertification = () => {
    const newCert: Certification = { id: Date.now().toString(), name: '', organization: '', year: '', url: '' };
    setData({ ...data, certifications: [...(data.certifications || []), newCert] });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setData({
      ...data,
      certifications: (data.certifications || []).map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
    });
  };

  const removeCertification = (id: string) => {
    setData({ ...data, certifications: (data.certifications || []).filter(cert => cert.id !== id) });
  };

  const addProject = () => {
    const newProject: Project = { id: Date.now().toString(), title: '', description: '', link: '' };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setData({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const addCustomSection = () => {
    const newSection = { id: Date.now().toString(), title: '', content: '' };
    setData({ ...data, customSections: [...(data.customSections || []), newSection] });
  };

  const updateCustomSection = (id: string, field: string, value: string) => {
    setData({
      ...data,
      customSections: (data.customSections || []).map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const removeCustomSection = (id: string) => {
    setData({ ...data, customSections: (data.customSections || []).filter(s => s.id !== id) });
  };

  const addSkill = (name: string) => {
    if (name && !data.skills.some(s => s.name === name)) {
      setData({ ...data, skills: [...data.skills, { id: Date.now().toString() + Math.random(), name, level: 'Intermediate' }] });
    }
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? { ...s, [field]: value } : s)
    }));
  };

  const removeSkill = (index: number) => {
    setData({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const addLanguage = () => {
    const newLang: Language = { id: Date.now().toString() + Math.random(), name: '', proficiency: 'Intermediate' };
    setData({ ...data, languages: [...(data.languages || []), newLang] });
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    setData(prev => ({
      ...prev,
      languages: (prev.languages || []).map((l, i) => i === index ? { ...l, [field]: value } : l)
    }));
  };

  const removeLanguage = (index: number) => {
    setData({ ...data, languages: (data.languages || []).filter((_, i) => i !== index) });
  };

  const DEGREE_OPTIONS: Record<string, string[]> = {
    'Bachelor': [
      "B.Tech (Bachelor of Technology)",
      "B.E. (Bachelor of Engineering)",
      "B.Sc (Bachelor of Science)",
      "B.Com (Bachelor of Commerce)",
      "B.A. (Bachelor of Arts)",
      "BCA (Bachelor of Computer Applications)",
      "BBA (Bachelor of Business Administration)",
      "B.Arch (Bachelor of Architecture)",
      "B.Des (Bachelor of Design)",
      "B.Ed (Bachelor of Education)",
      "LLB (Bachelor of Laws)",
      "MBBS",
      "Other"
    ],
    'Master': [
      "M.Tech (Master of Technology)",
      "M.E. (Master of Engineering)",
      "M.Sc (Master of Science)",
      "M.Com (Master of Commerce)",
      "M.A. (Master of Arts)",
      "MCA (Master of Computer Applications)",
      "MBA (Master of Business Administration)",
      "M.Des (Master of Design)",
      "M.Ed (Master of Education)",
      "LLM (Master of Laws)",
      "Other"
    ],
    'Diploma': [
      "Diploma in Computer Science",
      "Diploma in Mechanical Engineering",
      "Diploma in Electrical Engineering",
      "Diploma in Civil Engineering",
      "Diploma in Electronics",
      "Diploma in Information Technology",
      "Other"
    ]
  };

  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <User className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Personal Details</span>
          </div>
          {activeSection === 'personal' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'personal' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Include Profile Photo</p>
                      <p className="text-xs text-slate-500">Add a professional headshot to your resume</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setData({ ...data, showProfileImage: !data.showProfileImage })}
                    className={`w-12 h-6 rounded-full transition-all relative ${data.showProfileImage ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.showProfileImage ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {data.showProfileImage && (
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <div className="w-full flex items-center justify-between mb-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Image Shape:</label>
                       <select
                         value={data.profileImageShape || 'circle'}
                         onChange={(e) => setData({ ...data, profileImageShape: e.target.value as any })}
                         className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                       >
                         <option value="circle">Circle</option>
                         <option value="rounded">Rounded</option>
                         <option value="square">Square</option>
                       </select>
                    </div>

                    {data.profileImage ? (
                      <div className="relative group">
                        <img 
                          src={data.profileImage} 
                          alt="Profile" 
                          className={`w-32 h-32 object-cover border-4 border-white shadow-xl ${data.profileImageShape === 'square' ? 'rounded-none' : data.profileImageShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'}`} 
                        />
                        <button
                          onClick={() => setData({ ...data, profileImage: null })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`w-32 h-32 bg-slate-100 flex items-center justify-center text-slate-400 border-4 border-white shadow-inner ${data.profileImageShape === 'square' ? 'rounded-none' : data.profileImageShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'}`}>
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {data.profileImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                  </div>
                )}
                
                {/* Cropping Modal */}
                {imageToCrop && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col">
                      <div className="flex items-center justify-between xl mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Crop Image</h3>
                        <button onClick={() => setImageToCrop(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden mb-6">
                        <Cropper
                          image={imageToCrop}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                      <div className="flex gap-3 justify-end mt-auto">
                        <button 
                          onClick={() => setImageToCrop(null)} 
                          className="px-4 py-2 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={finalizeCrop}
                          className="px-6 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                        >
                          Apply Crop
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={data.personalInfo.fullName || ''} onChange={(v) => updatePersonalInfo('fullName', v)} />
                  <Input label="Email" value={data.personalInfo.email || ''} onChange={(v) => updatePersonalInfo('email', v)} />
                  <Input label="Phone" value={data.personalInfo.phone || ''} onChange={(v) => updatePersonalInfo('phone', v)} />
                  <Input label="Address" value={data.personalInfo.address || ''} onChange={(v) => updatePersonalInfo('address', v)} />
                  <Input label="LinkedIn" value={data.personalInfo.linkedin || ''} onChange={(v) => updatePersonalInfo('linkedin', v)} />
                  <Input label="Portfolio" value={data.personalInfo.portfolio || ''} onChange={(v) => updatePersonalInfo('portfolio', v)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Professional Summary</span>
          </div>
          {activeSection === 'summary' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'summary' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="relative mt-2">
                <textarea
                  value={data.summary || ''}
                  onChange={(e) => setData({ ...data, summary: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                  placeholder="Briefly describe your professional background and key achievements..."
                />
                <button
                  onClick={handleAIImproveSummary}
                  className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Improve
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Work Experience */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Briefcase className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Work Experience</span>
          </div>
          {activeSection === 'experience' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'experience' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Company" value={exp.company || ''} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                      <Input label="Role" value={exp.role || ''} onChange={(v) => updateExperience(exp.id, 'role', v)} />
                      <MonthYearInput label="Start Date" value={exp.startDate || ''} onChange={(v) => updateExperience(exp.id, 'startDate', v)} />
                      {!exp.isCurrent && (
                        <MonthYearInput label="End Date" value={exp.endDate || ''} onChange={(v) => updateExperience(exp.id, 'endDate', v)} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 ml-1">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.isCurrent || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setData(prev => ({
                            ...prev,
                            experience: prev.experience.map(item => 
                              item.id === exp.id 
                                ? { ...item, isCurrent: checked, endDate: checked ? 'Present' : '' } 
                                : item
                            )
                          }));
                        }}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-700 cursor-pointer">I am currently working here</label>
                    </div>
                    <div className="mt-4 relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Description</label>
                      <textarea
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm pr-24"
                      />
                      <button
                        onClick={async () => {
                          const improved = await onAIImprove(`experience description for ${exp.role} at ${exp.company}`, exp.description);
                          updateExperience(exp.id, 'description', improved);
                        }}
                        className="absolute bottom-2 right-2 bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-1.5 text-[10px] font-bold border border-indigo-100"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Improve
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('education')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Education</span>
          </div>
          {activeSection === 'education' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'education' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Education Level</label>
                        <select
                          value={edu.level || 'Bachelor'}
                          onChange={(e) => updateEducation(edu.id, 'level', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                        >
                          <option value="10th">10th (SSC)</option>
                          <option value="12th">12th (HSC)</option>
                          <option value="Bachelor">Bachelor's Degree</option>
                          <option value="Master">Master's Degree</option>
                          <option value="Diploma">Diploma</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(edu.level === '10th' || edu.level === '12th') ? (
                          <>
                            <Input label="Board Name" value={edu.board || ''} onChange={(v) => updateEducation(edu.id, 'board', v)} />
                            <Input label="School Name" value={edu.school || ''} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                            {edu.level === '12th' && (
                              <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Stream</label>
                                <select
                                  value={edu.stream || ''}
                                  onChange={(e) => updateEducation(edu.id, 'stream', e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                >
                                  <option value="">Select Stream</option>
                                  <option value="Science">Science</option>
                                  <option value="Commerce">Commerce</option>
                                  <option value="Arts">Arts</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            )}
                            {edu.level === '10th' && (
                              <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Stream</label>
                                <select
                                  value={edu.stream || ''}
                                  onChange={(e) => updateEducation(edu.id, 'stream', e.target.value)}
                                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                >
                                  <option value="General">General</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Degree / Course Name</label>
                              <select
                                value={DEGREE_OPTIONS[edu.level]?.includes(edu.degree) ? edu.degree : (edu.degree ? 'Other' : '')}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === 'Other') {
                                    updateEducation(edu.id, 'degree', '');
                                  } else {
                                    updateEducation(edu.id, 'degree', val);
                                  }
                                }}
                                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                              >
                                <option value="">Select Degree</option>
                                {DEGREE_OPTIONS[edu.level]?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              {(!DEGREE_OPTIONS[edu.level]?.includes(edu.degree) && edu.degree !== undefined) || (edu.degree === '' && !DEGREE_OPTIONS[edu.level]?.includes('')) ? (
                                <div className="mt-2">
                                  <Input 
                                    label="Specify Degree" 
                                    value={edu.degree || ''} 
                                    onChange={(v) => updateEducation(edu.id, 'degree', v)} 
                                  />
                                </div>
                              ) : null}
                            </div>
                            <Input label="University Name" value={edu.university || ''} onChange={(v) => updateEducation(edu.id, 'university', v)} />
                            <Input label="College / Institution" value={edu.college || ''} onChange={(v) => updateEducation(edu.id, 'college', v)} />
                          </>
                        )}
                        
                        <MonthYearInput label="Start Date" value={edu.startDate || ''} onChange={(v) => updateEducation(edu.id, 'startDate', v)} />
                        
                        {!edu.isCurrentlyStudying && (
                          <MonthYearInput label="End Date" value={edu.endDate || ''} onChange={(v) => updateEducation(edu.id, 'endDate', v)} />
                        )}
                        
                        <div className="flex items-center gap-2 mt-2 sm:col-span-2">
                          <input
                            type="checkbox"
                            id={`studying-${edu.id}`}
                            checked={edu.isCurrentlyStudying || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setData(prev => ({
                                ...prev,
                                education: prev.education.map(item => 
                                  item.id === edu.id 
                                    ? { ...item, isCurrentlyStudying: checked, endDate: checked ? 'Present' : '' } 
                                    : item
                                )
                              }));
                            }}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor={`studying-${edu.id}`} className="text-sm font-medium text-slate-700 cursor-pointer">Currently Studying Here</label>
                        </div>

                        <div className="sm:col-span-2">
                          <ScoreInput 
                            label={edu.level === '10th' || edu.level === '12th' ? "Score (Percentage)" : "CGPA / Percentage"} 
                            value={edu.score} 
                            onChange={(v) => updateEducation(edu.id, 'score', v)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addEducation}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certifications */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('certifications')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Award className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Certifications & Courses</span>
          </div>
          {activeSection === 'certifications' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'certifications' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                {(data.certifications || []).map((cert) => (
                  <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeCertification(cert.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Course / Certificate Name" value={cert.name || ''} onChange={(v) => updateCertification(cert.id, 'name', v)} />
                      <Input label="Issuing Organization" value={cert.organization || ''} onChange={(v) => updateCertification(cert.id, 'organization', v)} />
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Completion Year</label>
                        <input
                          type="text"
                          maxLength={4}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={cert.year || ''}
                          onChange={(e) => updateCertification(cert.id, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="YYYY"
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                        />
                      </div>
                      <Input label="Credential URL (Optional)" value={cert.url || ''} onChange={(v) => updateCertification(cert.id, 'url', v)} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCertification}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Code className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900 uppercase tracking-wider text-sm">Skills & Display</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">Style:</label>
            <select
              value={data.skillDisplayStyle || 'text'}
              onChange={(e) => setData({ ...data, skillDisplayStyle: e.target.value as any })}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="text">Text Only</option>
              <option value="stars">Stars</option>
              <option value="dots">Dots</option>
              <option value="bar">Progress Bar</option>
              <option value="circle">Circular Ring</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => toggleSection('skills')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">Manage Skills</span>
          </div>
          {activeSection === 'skills' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'skills' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Add skill (press Enter)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        addSkill(val);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />
                <div className="space-y-3">
                  {data.skills.map((skill, index) => (
                    <div key={skill.id || index} className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full p-4 md:p-3 bg-indigo-50 md:bg-indigo-50 rounded-xl border border-indigo-100 md:border-indigo-100 mb-0 relative group">
                      <div className="w-full md:flex-1">
                        <input
                          type="text"
                          value={skill.name || ''}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          placeholder="Skill name..."
                          className="w-full bg-white md:bg-transparent border border-slate-200 md:border-none rounded-lg md:rounded-none p-3 md:p-0 focus:outline-none focus:ring-2 md:focus:ring-0 focus:ring-indigo-500 text-sm font-bold text-indigo-600"
                        />
                        <div className="flex gap-1 mt-2 md:mt-1">
                          {[1, 2, 3, 4].map((i) => {
                            const dots = skill.level === 'Beginner' ? 1 : skill.level === 'Intermediate' ? 2 : skill.level === 'Advanced' ? 3 : 4;
                            return (
                              <div 
                                key={i} 
                                className={`h-1 flex-1 rounded-full ${i <= dots ? 'bg-indigo-500' : 'bg-slate-200'}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <select
                        value={skill.level || 'Intermediate'}
                        onChange={(e) => updateSkill(index, 'level', e.target.value as any)}
                        className="w-full md:w-40 bg-white border border-slate-200 rounded-lg px-3 py-2.5 md:px-2 md:py-1 text-sm md:text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:focus:ring-0 cursor-pointer"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      {/* Mobile: full-width delete button. Desktop: icon only */}
                      <button 
                        onClick={() => removeSkill(index)} 
                        className="w-full md:w-auto py-2 md:py-0 text-red-500 md:text-slate-400 md:hover:text-red-600 font-bold text-sm md:text-base flex items-center justify-center md:justify-start gap-2 border border-red-200 md:border-none rounded-lg md:rounded-none bg-red-50 md:bg-transparent md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="md:hidden">Remove Skill</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSkill('New Skill')}
                  className="w-full py-3 mt-2 border-2 border-dashed border-indigo-300 text-indigo-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Skill
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Languages */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Languages className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900 uppercase tracking-wider text-sm">Languages & Display</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">Style:</label>
            <select
              value={data.languageDisplayStyle || 'text'}
              onChange={(e) => setData({ ...data, languageDisplayStyle: e.target.value as any })}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="text">Text Only</option>
              <option value="stars">Stars</option>
              <option value="dots">Dots</option>
              <option value="bar">Progress Bar</option>
              <option value="circle">Circular Ring</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => toggleSection('languages')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">Manage Languages</span>
          </div>
          {activeSection === 'languages' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'languages' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-3 mt-2">
                {(data.languages || []).map((lang, index) => (
                  <div key={lang.id || index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl group border border-slate-100">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={lang.name || ''}
                        onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                        placeholder="Language name..."
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 p-0"
                      />
                    </div>
                    <select
                      value={lang.proficiency || 'Intermediate'}
                      onChange={(e) => updateLanguage(index, 'proficiency', e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                    <button onClick={() => removeLanguage(index)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addLanguage}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Language
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('projects')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Folder className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Projects</span>
          </div>
          {activeSection === 'projects' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'projects' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                {data.projects.map((p) => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeProject(p.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Project Title" value={p.title || ''} onChange={(v) => updateProject(p.id, 'title', v)} />
                      <Input label="Link" value={p.link || ''} onChange={(v) => updateProject(p.id, 'link', v)} />
                    </div>
                    <div className="mt-4 relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Description</label>
                      <textarea
                        value={p.description || ''}
                        onChange={(e) => updateProject(p.id, 'description', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm pr-24"
                      />
                      <button
                        onClick={async () => {
                          const improved = await onAIImprove(`project description for ${p.title}`, p.description);
                          updateProject(p.id, 'description', improved);
                        }}
                        className="absolute bottom-2 right-2 bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-1.5 text-[10px] font-bold border border-indigo-100"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Improve
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Sections */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => toggleSection('custom')}
          className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <Layers className="text-indigo-600 w-5 h-5" />
            <span className="font-bold text-slate-900">Custom Sections</span>
          </div>
          {activeSection === 'custom' ? <ChevronUp className="text-slate-400 w-5 h-5" /> : <ChevronDown className="text-slate-400 w-5 h-5" />}
        </button>
        <AnimatePresence>
          {activeSection === 'custom' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-hidden"
            >
              <div className="space-y-6 mt-2">
                {(data.customSections || []).map((section) => (
                  <div key={section.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-4">
                      <Input 
                        label="Section Title" 
                        value={section.title || ''} 
                        onChange={(v) => updateCustomSection(section.id, 'title', v)} 
                        placeholder="e.g., Languages, Volunteer Work, Hobbies"
                      />
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Content</label>
                        <textarea
                          value={section.content || ''}
                          onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] text-sm"
                          placeholder="Enter section content..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCustomSection}
                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Section
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

function MonthYearInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const month = MONTHS.find(m => value.includes(m)) || '';
  const year = value.replace(month, '').trim();

  const handleMonthChange = (m: string) => {
    onChange(m && year ? `${m} ${year}` : m || year);
  };

  const handleYearChange = (y: string) => {
    const numericYear = y.replace(/\D/g, '').slice(0, 4);
    onChange(month && numericYear ? `${month} ${numericYear}` : month || numericYear);
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{label}</label>
      <div className="flex gap-2">
        <select
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="flex-1 p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
        >
          <option value="">Month</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <div className="flex-1">
          <input
            type="text"
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="YYYY"
            className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          />
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
      />
    </div>
  );
}

function ScoreInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const [showCalc, setShowCalc] = useState(false);
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');

  const ob = parseFloat(obtained);
  const tot = parseFloat(total);
  const isValid = !isNaN(ob) && !isNaN(tot) && tot !== 0;
  const livePercentage = isValid ? ((ob / tot) * 100).toFixed(2) : null;

  const calculate = () => {
    if (isValid) {
      onChange(livePercentage + '%');
      setShowCalc(false);
      setObtained('');
      setTotal('');
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1 ml-1">
        <label className="block text-xs font-bold text-slate-500 uppercase">{label}</label>
        <button 
          onClick={() => setShowCalc(true)}
          className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-wider"
        >
          <Calculator className="w-3 h-3" />
          Calculate %
        </button>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., 8.5 CGPA or 85%"
        className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
      />

      {/* Calculator Modal Overlay */}
      <AnimatePresence>
        {showCalc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCalc(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Percentage Calculator</h3>
                    <p className="text-xs text-slate-400">Enter marks to calculate %</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCalc(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <Input label="Obtained Marks" value={obtained} onChange={setObtained} type="number" placeholder="e.g., 450" />
                <Input label="Total Marks" value={total} onChange={setTotal} type="number" placeholder="e.g., 500" />
              </div>

              {/* Live Preview */}
              {livePercentage && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Calculated Percentage</p>
                  <p className="text-3xl font-black text-indigo-600">{livePercentage}%</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCalc(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={calculate}
                  disabled={!isValid}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  Apply Percentage
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
