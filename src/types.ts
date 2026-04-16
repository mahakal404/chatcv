export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrent?: boolean;
}

export interface Education {
  id: string;
  level: '10th' | '12th' | 'Bachelor' | 'Master' | 'Diploma';
  board?: string;
  school?: string;
  stream?: string;
  degree?: string;
  university?: string;
  college?: string;
  startDate: string;
  endDate: string;
  score: string;
  isCurrentlyStudying: boolean;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  year: string;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Fluent' | 'Native';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  profileImage?: string | null;
  profileImageShape?: 'circle' | 'square' | 'rounded';
  showProfileImage?: boolean;
  summary: string;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  customSections?: CustomSection[];
  theme: 'classic' | 'modern' | 'creative' | 'tech';
  accentColor: string;
  skillDisplayStyle: 'text' | 'stars' | 'dots' | 'bar' | 'circle';
  languageDisplayStyle: 'text' | 'stars' | 'dots' | 'bar' | 'circle';
}

export interface Resume {
  id: string;
  uid: string;
  title: string;
  lastModified: any; // Firestore Timestamp
  data: ResumeData;
}
