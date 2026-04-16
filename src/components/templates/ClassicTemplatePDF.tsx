import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Circle as SvgCircle, Path, Image, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

// @refresh skip
// Register Google Font for a robust rendering pipeline
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-black-webfont.ttf', fontWeight: 900 },
  ],
});

Font.registerHyphenationCallback(word => [word]);

interface Props {
  data: ResumeData;
}

// ─── HIGH-LEVEL SVG ICONS ────────────────────────
// ADDED style={{ width: size, height: size }} TO PREVENT OVERLAPPING
const mailIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const phoneIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const mapPinIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={color} strokeWidth={2} fill="none" />
    <SvgCircle cx={12} cy={10} r={3} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const linkedInIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M2 9h4v12H2z" stroke={color} strokeWidth={2} fill="none" />
    <SvgCircle cx={4} cy={4} r={2} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const globeIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <SvgCircle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} fill="none" />
    <Path d="M2 12h20" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const userIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={color} strokeWidth={2} fill="none" />
    <SvgCircle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const briefcaseIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const graduationIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const awardIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <SvgCircle cx={12} cy={8} r={7} stroke={color} strokeWidth={2} fill="none" />
    <Path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const codeIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const cpuIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9 9h6v6H9z" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const terminalIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M4 17l6-5-6-5M12 19h8" stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

const languageIcon = ({ size = 10, color = '#64748b' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ width: size, height: size }}>
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke={color} strokeWidth={2} fill="none" />
    <SvgCircle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} fill="none" />
  </Svg>
);

// ─── Helpers ───────────────────────
const getSkillPercentage = (level: string) => {
  const map: Record<string, number> = { Beginner: 30, Intermediate: 60, Advanced: 85, Expert: 100 };
  return map[level] || 50;
};
const getSkillDots = (level: string) => {
  const map: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
  return map[level] || 2;
};
const getLangDots = (level: string) => {
  const map: Record<string, number> = { Beginner: 1, Intermediate: 2, Fluent: 3, Native: 4 };
  return map[level] || 2;
};
const getLangPercentage = (level: string) => {
  const map: Record<string, number> = { Beginner: 30, Intermediate: 60, Fluent: 85, Native: 100 };
  return map[level] || 50;
};

// ─── SVGs & Graphics ─────────────────────────────────────
const circularRing = ({ percentage, color, bgColor, textColor, size = 44 }: { percentage: number; color: string; bgColor: string; textColor: string; size?: number; }) => {
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;
  const cx = 22;
  const cy = 22;
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" style={{ width: size, height: size }}>
      <SvgCircle cx={cx} cy={cy} r={r} stroke={bgColor} strokeWidth={3} fill="none" />
      <SvgCircle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={3} fill="none" strokeDasharray={`${c}`} strokeDashoffset={`${offset}`} strokeLinecap="round" origin={`${cx}, ${cy}`} rotation={-90} />
    </Svg>
  );
};

const dotIndicator = ({ filled, total = 4, color, bgColor }: { filled: number; total?: number; color: string; bgColor: string; }) => (
  <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i < filled ? color : bgColor }} />
    ))}
  </View>
);

const proficiencyDisplay = ({ level, type, style: displayStyle, accentColor, isSidebar = false }: { level: string; type: 'skill' | 'language'; style: string; accentColor: string; isSidebar?: boolean; }) => {
  const percentage = type === 'skill' ? getSkillPercentage(level) : getLangPercentage(level);
  const dots = type === 'skill' ? getSkillDots(level) : getLangDots(level);
  const color = isSidebar ? '#ffffff' : accentColor;
  const bgColor = isSidebar ? 'rgba(255,255,255,0.2)' : '#e2e8f0';
  const textColor = isSidebar ? '#ffffff' : '#334155';

  if (displayStyle === 'text') {
    return <Text style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', color: isSidebar ? 'rgba(255,255,255,0.6)' : color }}>{level || ' '}</Text>;
  }
  if (displayStyle === 'circle') {
    // FIX: Using absolute overlay perfectly scaled with 0 anchor
    return (
      <View style={{ position: 'relative', width: 32, height: 32 }}>
        {circularRing({ percentage, color, bgColor, textColor, size: 32 })}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 6.5, fontWeight: 800, color: textColor }}>{percentage}%</Text>
        </View>
      </View>
    );
  }
  if (displayStyle === 'bar') {
    return (
      <View style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: bgColor, overflow: 'hidden' }}>
        <View style={{ width: `${percentage}%`, height: 4, borderRadius: 2, backgroundColor: color }} />
      </View>
    );
  }
  if (displayStyle === 'dots') {
    return dotIndicator({ filled: dots, color, bgColor });
  }
  if (displayStyle === 'stars') {
    return (
      <View style={{ flexDirection: 'row', gap: 3 }}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: i <= dots ? color : bgColor, transform: 'rotate(45deg)' }} />
        ))}
      </View>
    );
  }
  return <Text style={{ fontSize: 7, color: textColor }}>{level || ' '}</Text>;
};

const getDegreeText = (edu: any) =>
  (edu.level === '10th' || edu.level === '12th') ? `${edu.level}${edu.board ? ` (${edu.board})` : ''}` : edu.degree || '';

const getInstitutionText = (edu: any) =>
  (edu.level === '10th' || edu.level === '12th') ? edu.school || '' : `${edu.college || ''}${edu.college && edu.university ? ', ' : ''}${edu.university || ''}`;

const SectionHeader = ({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: `${color}40`, paddingBottom: 4 }}>
    <View style={{ marginRight: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</View>
    <Text style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: color }}>{title || ' '}</Text>
  </View>
);

// ═══════════════════════════════════════════════════════════════════════
//  CLASSIC THEME
// ═══════════════════════════════════════════════════════════════════════
const ClassicTheme = ({ data }: Props) => {
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects, customSections, accentColor, skillDisplayStyle, languageDisplayStyle, profileImage, showProfileImage } = data;
  const ac = accentColor || '#4f46e5';

  const s = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Inter', fontSize: 9, color: '#334155', lineHeight: 1.35 },
    headerWrap: { textAlign: 'center', borderBottomWidth: 2, borderBottomColor: ac, paddingBottom: 16, marginBottom: 18 },
    name: { fontSize: 24, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, color: '#0f172a', marginBottom: 8 },
    contactRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 },
    contactItemSpacing: { flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 4 },
    sectionTitle: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: ac, borderBottomWidth: 1, borderBottomColor: ac, paddingBottom: 3, marginBottom: 10, marginTop: 14 },
    itemWrap: { marginBottom: 10 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
    itemTitle: { fontWeight: 700, fontSize: 11, color: '#0f172a' },
    itemSub: { fontWeight: 500, fontSize: 9, color: '#475569' },
    date: { fontSize: 8, color: '#94a3b8', fontWeight: 600 },
    desc: { marginTop: 4, textAlign: 'justify', color: '#475569', lineHeight: 1.35 },
    grid2: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    gridItem: { width: '48%', marginRight: '1%', marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 6, backgroundColor: '#f8fafc', borderRadius: 4 },
  });

  return (
    <Page size="A4" style={s.page}>
      <View style={s.headerWrap}>
        {showProfileImage && profileImage && (
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <Image src={profileImage} style={{ width: 80, height: 80, borderRadius: 40, objectFit: 'cover', border: `3px solid ${ac}` }} />
          </View>
        )}
        <Text style={s.name}>{personalInfo.fullName || ' '}</Text>
        <View style={s.contactRow}>
          {personalInfo.email && <View style={s.contactItemSpacing}><View style={{ marginRight: 4 }}>{mailIcon({ size: 9, color: ac })}</View><Text style={{ fontSize: 8, color: '#64748b' }}>{personalInfo.email || ' '}</Text></View>}
          {personalInfo.phone && <View style={s.contactItemSpacing}><View style={{ marginRight: 4 }}>{phoneIcon({ size: 9, color: ac })}</View><Text style={{ fontSize: 8, color: '#64748b' }}>{personalInfo.phone || ' '}</Text></View>}
          {personalInfo.address && <View style={s.contactItemSpacing}><View style={{ marginRight: 4 }}>{mapPinIcon({ size: 9, color: ac })}</View><Text style={{ fontSize: 8, color: '#64748b' }}>{personalInfo.address || ' '}</Text></View>}
          {personalInfo.linkedin && <View style={s.contactItemSpacing}><View style={{ marginRight: 4 }}>{linkedInIcon({ size: 9, color: ac })}</View><Text style={{ fontSize: 8, color: '#64748b' }}>{personalInfo.linkedin || ' '}</Text></View>}
          {personalInfo.portfolio && <View style={s.contactItemSpacing}><View style={{ marginRight: 4 }}>{globeIcon({ size: 9, color: ac })}</View><Text style={{ fontSize: 8, color: '#64748b' }}>{personalInfo.portfolio || ' '}</Text></View>}
        </View>
      </View>

      {summary && summary.trim() !== '' && (
        <View style={{ marginBottom: 4 }}>
          <Text style={s.sectionTitle}>Summary</Text>
          <Text style={s.desc}>{summary || ' '}</Text>
        </View>
      )}

      {experience && experience.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Experience</Text>
          {experience.map(exp => (
            <View key={exp.id} style={s.itemWrap}>
              <View style={s.itemHeader}>
                <Text style={s.itemTitle}>{exp.role || ' '}</Text>
                <Text style={s.date}>{exp.startDate}{exp.startDate && exp.endDate ? ' - ' : ''}{exp.endDate || 'Present'}</Text>
              </View>
              {exp.company && <Text style={s.itemSub}>{exp.company || ' '}</Text>}
              {exp.description && <Text style={s.desc}>{exp.description || ' '}</Text>}
            </View>
          ))}
        </View>
      )}

      {education && education.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Education</Text>
          {education.map(edu => {
            const degree = getDegreeText(edu);
            const institution = getInstitutionText(edu);
            if (!degree && !institution) return null;
            return (
              <View key={edu.id} style={s.itemWrap}>
                <View style={s.itemHeader}>
                  <Text style={s.itemTitle}>{degree || ' '}</Text>
                  <Text style={s.date}>{edu.startDate}{edu.startDate && edu.endDate ? ' - ' : ''}{edu.endDate}</Text>
                </View>
                <View style={s.itemHeader}>
                  <Text style={s.itemSub}>{institution || ' '}</Text>
                  {edu.score ? <Text style={{ fontSize: 8, fontWeight: 700, color: '#334155' }}>{edu.score || ' '}</Text> : null}
                </View>
                {(edu.level === '10th' || edu.level === '12th') && edu.stream && (
                  <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 2 }}>Stream: {edu.stream}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {skills && skills.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Skills</Text>
          <View style={s.grid2}>
            {skills.map(skill => (
              <View key={skill.id} style={s.gridItem} wrap={false}>
                <Text style={{ fontWeight: 600, fontSize: 9, color: '#334155' }}>{skill.name || ' '}</Text>
                {proficiencyDisplay({ level: skill.level, type: 'skill', style: skillDisplayStyle, accentColor: ac })}
              </View>
            ))}
          </View>
        </View>
      )}

      {projects && projects.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Projects</Text>
          {projects.map(p => (
            <View key={p.id} style={s.itemWrap}>
              <View style={s.itemHeader}>
                <Text style={s.itemTitle}>{p.title || ' '}</Text>
                {p.link && <Link src={p.link}><Text style={{ fontSize: 7, color: ac }}>View Project</Text></Link>}
              </View>
              {p.description && <Text style={s.desc}>{p.description || ' '}</Text>}
            </View>
          ))}
        </View>
      )}

      {certifications && certifications.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Certifications</Text>
          {certifications.map(cert => (
            <View key={cert.id} style={{ marginBottom: 8 }} wrap={false}>
              <View style={s.itemHeader}>
                <Text style={{ fontWeight: 700, fontSize: 10, color: '#0f172a' }}>{cert.name || ' '}</Text>
                <Text style={s.date}>{cert.year || ' '}</Text>
              </View>
              {cert.organization && <Text style={s.itemSub}>{cert.organization || ' '}</Text>}
            </View>
          ))}
        </View>
      )}

      {languages && languages.length > 0 && (
        <View>
          <Text style={s.sectionTitle}>Languages</Text>
          <View style={s.grid2}>
            {languages.map(lang => (
              <View key={lang.id} style={s.gridItem} wrap={false}>
                <Text style={{ fontWeight: 600, fontSize: 9, color: '#334155' }}>{lang.name || ' '}</Text>
                {proficiencyDisplay({ level: lang.proficiency, type: 'language', style: languageDisplayStyle, accentColor: ac })}
              </View>
            ))}
          </View>
        </View>
      )}

      {customSections && customSections.length > 0 && customSections.map(section => (
        <View key={section.id}>
          <Text style={s.sectionTitle}>{section.title || ' '}</Text>
          <Text style={s.desc}>{section.content || ' '}</Text>
        </View>
      ))}
    </Page>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  MODERN THEME 
// ═══════════════════════════════════════════════════════════════════════
const ModernTheme = ({ data }: Props) => {
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects, customSections, accentColor, skillDisplayStyle, languageDisplayStyle, profileImage, showProfileImage } = data;
  const ac = accentColor || '#4f46e5';

  return (
    <Page size="A4" style={{ fontFamily: 'Inter', fontSize: 9, color: '#334155', padding: 0, lineHeight: 1.4 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 32, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
          {showProfileImage && profileImage && (
            <Image src={profileImage} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover', border: `3px solid ${ac}`, marginRight: 14 }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginBottom: 6 }}>{personalInfo.fullName || ' '}</Text>
            <View style={{ width: 60, height: 5, borderRadius: 3, backgroundColor: ac }} />
          </View>
        </View>
        <View style={{ textAlign: 'right', fontSize: 8, color: '#64748b', fontWeight: 500 }}>
          {personalInfo.email && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}><Text style={{ marginRight: 6 }}>{personalInfo.email || ' '}</Text><View>{mailIcon({ size: 9, color: ac })}</View></View>}
          {personalInfo.phone && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}><Text style={{ marginRight: 6 }}>{personalInfo.phone || ' '}</Text><View>{phoneIcon({ size: 9, color: ac })}</View></View>}
          {personalInfo.address && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}><Text style={{ marginRight: 6 }}>{personalInfo.address || ' '}</Text><View>{mapPinIcon({ size: 9, color: ac })}</View></View>}
          {personalInfo.linkedin && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}><Text style={{ marginRight: 6 }}>{personalInfo.linkedin || ' '}</Text><View>{linkedInIcon({ size: 9, color: ac })}</View></View>}
        </View>
      </View>

      {summary && summary.trim() !== '' && (
        <View style={{ paddingHorizontal: 32, marginBottom: 18 }}>
          <SectionHeader icon={userIcon({ size: 10, color: ac })} title="Professional Summary" color={ac} />
          <Text style={{ fontSize: 9, color: '#475569' }}>{summary || ' '}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', paddingHorizontal: 32, gap: 24 }}>
        <View style={{ flex: 1.5 }}>
          {experience && experience.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={briefcaseIcon({ size: 10, color: ac })} title="Work Experience" color={ac} />
              {experience.map(exp => (
                <View key={exp.id} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{exp.role || ' '}</Text>
                    <Text style={{ fontSize: 7, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}</Text>
                  </View>
                  {exp.company && <Text style={{ fontSize: 9, fontWeight: 700, color: ac, marginBottom: 4 }}>{exp.company || ' '}</Text>}
                  {exp.description && <Text style={{ fontSize: 9, color: '#475569' }}>{exp.description || ' '}</Text>}
                </View>
              ))}
            </View>
          )}

          {education && education.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={graduationIcon({ size: 10, color: ac })} title="Education" color={ac} />
              {education.map(edu => {
                const degree = getDegreeText(edu);
                const institution = getInstitutionText(edu);
                if (!degree && !institution) return null;
                return (
                  <View key={edu.id} style={{ marginBottom: 10 }} wrap={false}>
                    <Text style={{ fontWeight: 700, fontSize: 10, color: '#0f172a' }}>{degree || ' '}</Text>
                    {institution ? <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 2 }}>{institution || ' '}</Text> : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</Text>
                      {edu.score ? <Text style={{ fontSize: 7, fontWeight: 900, color: ac }}>{edu.score || ' '}</Text> : null}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {languages && languages.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={languageIcon({ size: 10, color: ac })} title="Languages" color={ac} />
              <View style={{ flexDirection: 'column' }}>
                {languages.map(lang => (
                  <View key={lang.id} style={{ marginBottom: 6, padding: 6, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#f1f5f9' }} wrap={false}>
                    <Text style={{ fontWeight: 600, fontSize: 9, color: '#0f172a', marginBottom: 3 }}>{lang.name || ' '}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                      {proficiencyDisplay({ level: lang.proficiency, type: 'language', style: languageDisplayStyle, accentColor: ac })}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {projects && projects.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={codeIcon({ size: 10, color: ac })} title="Projects" color={ac} />
              {projects.map(p => (
                <View key={p.id} style={{ marginBottom: 12 }} wrap={false}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{p.title || ' '}</Text>
                    {p.link && <Link src={p.link}><Text style={{ fontSize: 7, fontWeight: 900, color: ac }}>Link</Text></Link>}
                  </View>
                  {p.description && <Text style={{ fontSize: 9, color: '#475569' }}>{p.description || ' '}</Text>}
                </View>
              ))}
            </View>
          )}

          {customSections && customSections.length > 0 && customSections.map(section => (
            <View key={section.id} style={{ marginBottom: 18 }}>
              <SectionHeader icon={awardIcon({ size: 10, color: ac })} title={section.title} color={ac} />
              <Text style={{ fontSize: 9, color: '#475569' }}>{section.content || ' '}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          {skills && skills.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={cpuIcon({ size: 10, color: ac })} title="Skills" color={ac} />
              {skills.map(skill => (
                <View key={skill.id} style={{ marginBottom: 6, padding: 6, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#f1f5f9' }} wrap={false}>
                  <Text style={{ fontWeight: 600, fontSize: 9, color: '#0f172a', marginBottom: 3 }}>{skill.name || ' '}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    {proficiencyDisplay({ level: skill.level, type: 'skill', style: skillDisplayStyle, accentColor: ac })}
                  </View>
                </View>
              ))}
            </View>
          )}

          {certifications && certifications.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={awardIcon({ size: 10, color: ac })} title="Certifications" color={ac} />
              {certifications.map(cert => (
                <View key={cert.id} style={{ marginBottom: 8 }} wrap={false}>
                  <Text style={{ fontWeight: 700, fontSize: 9, color: '#0f172a' }}>{cert.name || ' '}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {cert.organization ? <Text style={{ fontSize: 7, color: '#64748b' }}>{cert.organization || ' '}</Text> : null}
                    {cert.year ? <Text style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8' }}>{cert.year || ' '}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>


    </Page>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  CREATIVE THEME
// ═══════════════════════════════════════════════════════════════════════
const CreativeTheme = ({ data }: Props) => {
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects, customSections, accentColor, skillDisplayStyle, languageDisplayStyle, profileImage, showProfileImage } = data;
  const ac = accentColor || '#4f46e5';

  return (
    <Page size="A4" style={{ fontFamily: 'Inter', fontSize: 9, padding: 0, flexDirection: 'row', lineHeight: 1.4 }}>
      <View style={{ width: '35%', backgroundColor: ac, color: '#ffffff', padding: 24, paddingTop: 32 }}>
        {showProfileImage && profileImage && (
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <Image src={profileImage} style={{ width: 90, height: 90, borderRadius: 45, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
          </View>
        )}
        <Text style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', lineHeight: 1.15, marginBottom: 4 }}>{personalInfo.fullName || ' '}</Text>
        <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 20 }}>Professional Resume</Text>

        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 4 }}>
            <View style={{ marginRight: 6 }}>{mapPinIcon({ size: 9, color: '#ffffff' })}</View>
            <Text style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.8)' }}>Contact</Text>
          </View>
          {personalInfo.email && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}><View style={{ marginRight: 6 }}>{mailIcon({ size: 9, color: '#ffffff' })}</View><Text style={{ fontSize: 8, color: '#ffffff' }}>{personalInfo.email || ' '}</Text></View>}
          {personalInfo.phone && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}><View style={{ marginRight: 6 }}>{phoneIcon({ size: 9, color: '#ffffff' })}</View><Text style={{ fontSize: 8, color: '#ffffff' }}>{personalInfo.phone || ' '}</Text></View>}
          {personalInfo.address && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}><View style={{ marginRight: 6 }}>{mapPinIcon({ size: 9, color: '#ffffff' })}</View><Text style={{ fontSize: 8, color: '#ffffff' }}>{personalInfo.address || ' '}</Text></View>}
          {personalInfo.linkedin && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}><View style={{ marginRight: 6 }}>{linkedInIcon({ size: 9, color: '#ffffff' })}</View><Text style={{ fontSize: 8, color: '#ffffff' }}>{personalInfo.linkedin || ' '}</Text></View>}
        </View>

        {languages && languages.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 4 }}>
              <View style={{ marginRight: 6 }}>{languageIcon({ size: 9, color: '#ffffff' })}</View>
              <Text style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: 'rgba(255,255,255,0.8)' }}>Languages</Text>
            </View>
            {languages.map(lang => (
              <View key={lang.id} style={{ marginBottom: 6, padding: 4, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 4 }} wrap={false}>
                <Text style={{ fontSize: 9, fontWeight: 600, color: '#ffffff', marginBottom: 2 }}>{lang.name || ' '}</Text>
                <View style={{ flexDirection: 'row' }}>
                  {proficiencyDisplay({ level: lang.proficiency, type: 'language', style: languageDisplayStyle, accentColor: ac, isSidebar: true })}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ flex: 1, padding: 28, paddingTop: 32, color: '#334155' }}>
        {summary && summary.trim() !== '' && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={userIcon({ size: 10, color: ac })} title="Profile" color={ac} />
            <Text style={{ fontSize: 9, color: '#475569' }}>{summary || ' '}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={briefcaseIcon({ size: 10, color: ac })} title="Experience" color={ac} />
            {experience.map(exp => (
              <View key={exp.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: ac }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontWeight: 700, color: '#0f172a', fontSize: 11 }}>{exp.role || ' '}</Text>
                  <Text style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}</Text>
                </View>
                {exp.company && <Text style={{ fontSize: 9, fontWeight: 700, color: '#64748b', marginBottom: 3 }}>{exp.company || ' '}</Text>}
                {exp.description && <Text style={{ fontSize: 9, color: '#475569' }}>{exp.description || ' '}</Text>}
              </View>
            ))}
          </View>
        )}

        {education && education.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={graduationIcon({ size: 10, color: ac })} title="Education" color={ac} />
            {education.map(edu => {
              const degree = getDegreeText(edu);
              const institution = getInstitutionText(edu);
              if (!degree && !institution) return null;
              return (
                <View key={edu.id} style={{ marginBottom: 10 }} wrap={false}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontWeight: 700, color: '#0f172a', fontSize: 10 }}>{degree || ' '}</Text>
                    <Text style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}</Text>
                  </View>
                  {institution ? <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>{institution || ' '}</Text> : null}
                  {edu.score && <Text style={{ fontSize: 8, fontWeight: 700, color: ac, marginTop: 2 }}>{edu.score || ' '}</Text>}
                </View>
              );
            })}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={cpuIcon({ size: 10, color: ac })} title="Skills" color={ac} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {skills.map(skill => (
                <View key={skill.id} style={{ width: '47%', marginBottom: 8 }} wrap={false}>
                  <Text style={{ fontWeight: 700, fontSize: 9, color: '#334155', marginBottom: 3 }}>{skill.name || ' '}</Text>
                  {proficiencyDisplay({ level: skill.level, type: 'skill', style: skillDisplayStyle, accentColor: ac })}
                </View>
              ))}
            </View>
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={awardIcon({ size: 10, color: ac })} title="Certifications" color={ac} />
            {certifications.map(cert => (
              <View key={cert.id} style={{ marginBottom: 8 }} wrap={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontWeight: 700, fontSize: 10, color: '#0f172a' }}>{cert.name || ' '}</Text>
                  {cert.year && <Text style={{ fontSize: 7, fontWeight: 700, color: '#94a3b8' }}>{cert.year || ' '}</Text>}
                </View>
                {cert.organization && <Text style={{ fontSize: 8, color: '#64748b' }}>{cert.organization || ' '}</Text>}
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <SectionHeader icon={codeIcon({ size: 10, color: ac })} title="Projects" color={ac} />
            {projects.map(p => (
              <View key={p.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: ac }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontWeight: 700, color: '#0f172a', fontSize: 11 }}>{p.title || ' '}</Text>
                  {p.link && <Link src={p.link}><Text style={{ fontSize: 7, fontWeight: 700, color: ac }}>Link</Text></Link>}
                </View>
                {p.description && <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{p.description || ' '}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  TECH/DEV THEME (Adjusted to utilize full width and balance columns)
// ═══════════════════════════════════════════════════════════════════════
const TechTheme = ({ data }: Props) => {
  const { personalInfo, summary, experience, education, certifications, skills, languages, projects, customSections, accentColor, skillDisplayStyle, languageDisplayStyle, profileImage, showProfileImage } = data;
  const ac = accentColor || '#4f46e5';

  return (
    <Page size="A4" style={{ fontFamily: 'Inter', fontSize: 9, color: '#334155', padding: 28, lineHeight: 1.4 }}>
      <View style={{ borderBottomWidth: 3, borderBottomColor: '#0f172a', paddingBottom: 16, marginBottom: 20 }}>
        {/* Full Header Layout FIX to prevent clipping and overlay overlap */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>

          <View style={{ flexDirection: 'row', flex: 1, paddingRight: 15 }}>
            {showProfileImage && profileImage && (
              <Image src={profileImage} style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover', border: `2px solid ${ac}`, marginRight: 15 }} />
            )}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <View style={{ marginRight: 8, display: 'flex', justifyContent: 'center' }}>{terminalIcon({ size: 16, color: ac })}</View>
                <Text style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, color: '#0f172a', textTransform: 'uppercase' }}>{personalInfo.fullName || ' '}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                {personalInfo.email && <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}><View style={{ marginRight: 4 }}>{mailIcon({ size: 9, color: '#64748b' })}</View><Text style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{personalInfo.email || ' '}</Text></View>}
                {personalInfo.phone && <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}><View style={{ marginRight: 4 }}>{phoneIcon({ size: 9, color: '#64748b' })}</View><Text style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{personalInfo.phone || ' '}</Text></View>}
                {personalInfo.address && <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}><View style={{ marginRight: 4 }}>{mapPinIcon({ size: 9, color: '#64748b' })}</View><Text style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{personalInfo.address || ' '}</Text></View>}
                {personalInfo.linkedin && <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}><View style={{ marginRight: 4 }}>{linkedInIcon({ size: 9, color: '#64748b' })}</View><Text style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{personalInfo.linkedin || ' '}</Text></View>}
                {personalInfo.portfolio && <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}><View style={{ marginRight: 4 }}>{globeIcon({ size: 9, color: '#64748b' })}</View><Text style={{ fontSize: 8, color: '#475569', fontWeight: 500 }}>{personalInfo.portfolio || ' '}</Text></View>}
              </View>
            </View>
          </View>

          <View style={{ flexShrink: 0 }}>
            <View style={{ backgroundColor: '#0f172a', padding: 8, paddingHorizontal: 12, borderRadius: 4, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 7, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: 2 }}>{`< STATUS: `}<Text style={{ color: '#4ade80' }}>ACTIVE</Text>{` />`}</Text>
            </View>
          </View>

        </View>
      </View>

      {summary && summary.trim() !== '' && (
        <View style={{ marginBottom: 18 }} wrap={false}>
          <SectionHeader icon={codeIcon({ size: 11, color: ac })} title="Executive Summary" color={ac} />
          <Text style={{ fontSize: 9, color: '#475569', fontWeight: 500 }}>{summary || ' '}</Text>
        </View>
      )}

      {/* Main 2-column Flow for heavier text items */}
      <View style={{ flexDirection: 'row', gap: 24, marginBottom: 12 }}>
        <View style={{ flex: 1.5 }}>
          {experience && experience.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={briefcaseIcon({ size: 11, color: ac })} title="Professional Experience" color={ac} />
              {experience.map(exp => (
                <View key={exp.id} style={{ marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{exp.role || ' '}</Text>
                    <Text style={{ fontSize: 7, fontWeight: 800, color: '#0f172a', backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 2, textTransform: 'uppercase' }}>{exp.startDate}{exp.endDate ? ` :: ${exp.endDate}` : ''}</Text>
                  </View>
                  {exp.company && <Text style={{ fontSize: 9, fontWeight: 700, color: ac, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{exp.company || ' '}</Text>}
                  {exp.description && (
                    <Text style={{ fontSize: 9, color: '#475569', marginTop: 4, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#e2e8f0' }}>{exp.description || ' '}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {education && education.length > 0 && (
            <View style={{ marginTop: 15, marginBottom: 18 }}>
              <SectionHeader icon={graduationIcon({ size: 11, color: ac })} title="Education" color={ac} />
              <View style={{ flexDirection: 'column' }}>
                {education.map(edu => (
                  <View key={edu.id} style={{ marginBottom: 10 }} wrap={false}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <Text style={{ fontWeight: 800, fontSize: 10, color: '#0f172a' }}>{edu.degree || edu.level || ''}</Text>
                      <Text style={{ fontSize: 7, fontWeight: 600, color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}</Text>
                    </View>
                    <Text style={{ color: '#475569', fontSize: 8 }}>{edu.university || edu.school || ''}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {languages && languages.length > 0 && (
            <View style={{ marginTop: 15, marginBottom: 18 }}>
              <SectionHeader icon={languageIcon({ size: 11, color: ac })} title="Languages" color={ac} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 5 }}>
                {languages.map(lang => (
                  <View key={lang.id} style={{ width: '45%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }} wrap={false}>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: '#0f172a' }}>{lang.name || ' '}</Text>
                    <View>
                      {proficiencyDisplay({ level: lang.proficiency, type: 'language', style: languageDisplayStyle, accentColor: ac })}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {projects && projects.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={cpuIcon({ size: 11, color: ac })} title="Technical Projects" color={ac} />
              {projects.map(p => (
                <View key={p.id} style={{ marginBottom: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 800, fontSize: 10, color: '#0f172a' }}>{p.title || ' '}</Text>
                    {p.link && <Link src={p.link}><Text style={{ fontSize: 7, fontWeight: 800, color: ac, textTransform: 'uppercase' }}>[ Source ]</Text></Link>}
                  </View>
                  {p.description && <Text style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>{p.description || ' '}</Text>}
                </View>
              ))}
            </View>
          )}

          {certifications && certifications.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={awardIcon({ size: 11, color: '#0f172a' })} title="Certifications" color="#0f172a" />
              {certifications.map(cert => (
                <View key={cert.id} style={{ marginBottom: 8 }} wrap={false}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontWeight: 800, fontSize: 9, color: '#0f172a' }}>{cert.name || ' '}</Text>
                    <Text style={{ fontSize: 8, color: '#475569' }}>{cert.organization}{cert.year ? ` · ${cert.year}` : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          {skills && skills.length > 0 && (
            <View style={{ marginBottom: 18 }}>
              <SectionHeader icon={terminalIcon({ size: 11, color: '#0f172a' })} title="Technical Stack" color="#0f172a" />
              <View style={{ flexDirection: 'column', gap: 6 }}>
                {skills.map(skill => (
                  <View key={skill.id} style={{ padding: 6, borderRadius: 4, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }} wrap={false}>
                    <Text style={{ fontSize: 9, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{skill.name || ' '}</Text>
                    {proficiencyDisplay({ level: skill.level, type: 'skill', style: skillDisplayStyle, accentColor: ac })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
};

const ClassicTemplatePDF = ({ data }: Props) => {
  const theme = data.theme || 'classic';

  return (
    <Document title={`${data.personalInfo.fullName || 'Resume'} - Resume`}>
      {theme === 'modern' && <ModernTheme data={data} />}
      {theme === 'creative' && <CreativeTheme data={data} />}
      {theme === 'tech' && <TechTheme data={data} />}
      {(theme === 'classic' || !['modern', 'creative', 'tech'].includes(theme)) && <ClassicTheme data={data} />}
    </Document>
  );
};

export default ClassicTemplatePDF;
