const fs = require('fs');

let code = fs.readFileSync('src/components/templates/ClassicTemplatePDF.tsx', 'utf-8');

const components = [
  'MailIcon', 'PhoneIcon', 'MapPinIcon', 'LinkedInIcon', 'GlobeIcon', 'BriefcaseIcon',
  'GraduationIcon', 'AwardIcon', 'CodeIcon', 'TerminalIcon', 'CpuIcon', 'UserIcon',
  'LanguageIcon', 'CircularRing', 'DotIndicator', 'StarIndicator', 'ProficiencyDisplay', 'ContactItem'
];

// Step 1: rename component definitions to lowercase so Vite doesn't wrap them in HMR Proxy
components.forEach(c => {
  const lowerC = c.charAt(0).toLowerCase() + c.slice(1);
  code = code.replace(new RegExp('const ' + c + ' =', 'g'), 'const ' + lowerC + ' =');
});

// Step 2: replace JSX tags with function calls
// To be very safe with Regex, we will only replace the specific patterns we used
// e.g. <MailIcon size={9} color="#64748b" /> => {mailIcon({ size: 9, color: "#64748b" })}
code = code.replace(/<([A-Z]\w+Icon)\s+size=\{([^}]+)\}\s+color="([^"]+)"\s*\/>/g, (match, comp, size, color) => {
  const lowerC = comp.charAt(0).toLowerCase() + comp.slice(1);
  return `{${lowerC}({ size: ${size}, color: "${color}" })}`;
});

// <TerminalIcon size={14} color={ac} /> 
code = code.replace(/<([A-Z]\w+Icon)\s+size=\{([^}]+)\}\s+color=\{([^}]+)\}\s*\/>/g, (match, comp, size, color) => {
  const lowerC = comp.charAt(0).toLowerCase() + comp.slice(1);
  return `{${lowerC}({ size: ${size}, color: ${color} })}`;
});

// <ProficiencyDisplay level={skill.level} type="skill" style={skillDisplayStyle || 'text'} accentColor={ac} />
code = code.replace(/<ProficiencyDisplay\s+level=\{([^}]+)\}\s+type="([^"]+)"\s+style=\{([^}]+)\}\s+accentColor=\{([^}]+)\}\s*isSidebar\s*\/>/g, (match, level, type, style, ac) => {
  return `{proficiencyDisplay({ level: ${level}, type: "${type}", style: ${style}, accentColor: ${ac}, isSidebar: true })}`;
});

code = code.replace(/<ProficiencyDisplay\s+level=\{([^}]+)\}\s+type="([^"]+)"\s+style=\{([^}]+)\}\s+accentColor=\{([^}]+)\}\s*\/>/g, (match, level, type, style, ac) => {
  return `{proficiencyDisplay({ level: ${level}, type: "${type}", style: ${style}, accentColor: ${ac} })}`;
});

// <ContactItem icon={<MailIcon size={9} color="#64748b" />} text={personalInfo.email} />
// Note: <MailIcon ... /> inside here would have already been replaced if we matched inner first, but it's nested JSX!
// Let's do a simpler approach. Just re-write the entire file using `write_to_file`. It's robust.
