
'use client';

import type { ResumeSchema } from '@/lib/types';
import { CSSProperties } from 'react';

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => (
  <section className={`mb-4 ${className}`}>
    <h2 className="text-lg font-bold text-foreground border-b-2 border-border pb-1 mb-3 flex items-center gap-2">
      <span className="font-headline uppercase">{title}</span>
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
);

const isUrl = (str: string) => {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

const ensureAbsoluteUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};

const TechnicalSkillsDisplay = ({ skills }: { skills: string }) => {
  if (!skills) return null;

  const lines = skills.split('\n');
  const sections: { title: string; points: string[] }[] = [];
  let currentSection: { title: string; points: string[] } | null = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('>')) {
      if (currentSection) {
        currentSection.points.push(trimmedLine.substring(1).trim());
      }
    } else {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmedLine, points: [] };
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0 && skills) {
    return <p className="text-sm whitespace-pre-wrap">{skills}</p>;
  }

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div key={index} className="section-item">
          <h3 className="text-md font-semibold">{section.title}</h3>
          {section.points.length > 0 && (
            <ul className="list-disc list-inside text-sm text-foreground ml-4">
              {section.points.map((point, pIndex) => (
                <li key={pIndex}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};


export function ResumePreview({ data, sections }: { data: ResumeSchema, sections: any[] }) {

  const resumeStyle: CSSProperties = {
    fontFamily: data.styling?.fontFamily || 'Inter',
    fontSize: data.styling?.fontSize || '0.9rem',
    lineHeight: data.styling?.lineHeight || '1.5',
    textAlign: data.styling?.textAlign as 'left' | 'center' | 'right' | 'justify' || 'left',
  };

  const sectionComponents: Record<string, React.ReactNode> = {
    summary: data.summary && (
      <Section title="SUMMARY">
        <p className="text-sm whitespace-pre-wrap section-item">{data.summary}</p>
      </Section>
    ),
    projects: data.projects && data.projects.length > 0 && (
      <Section title="PROJECTS">
        {data.projects.map((proj, index) => (
          <div key={index} className="section-item">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-semibold text-foreground">
                {proj.name}
                {proj.projectType && (
                  <span className="text-sm font-normal text-foreground italic ml-2">
                    ({proj.projectType})
                  </span>
                )}
              </h3>
              {proj.period && (
                 <p className="text-sm text-foreground">{proj.period}</p>
              )}
            </div>
            <h4 className="text-sm font-normal text-foreground italic">
              {proj.role}
            </h4>
            <p className="text-sm text-foreground whitespace-pre-wrap mt-1">
              {proj.description}
            </p>
            {proj.preview && (
              <p className="text-sm text-foreground mt-1">
                <strong>Preview:</strong>{' '}
                {isUrl(proj.preview) ? (
                  <a
                    href={ensureAbsoluteUrl(proj.preview)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    {proj.preview}
                  </a>
                ) : (
                  proj.preview
                )}
              </p>
            )}
          </div>
        ))}
      </Section>
    ),
    achievements: data.achievements && data.achievements.length > 0 && (
      <Section title="ACHIEVEMENTS" className="break-before-page">
        {data.achievements.map(
          (ach, index) =>
            ach &&
            ach.achievement && (
              <div key={index} className="section-item">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-semibold text-foreground">
                    {ach.achievement}
                  </h3>
                  {ach.date && (
                    <p className="text-sm text-foreground">{ach.date}</p>
                  )}
                </div>
                {ach.event && (
                  <h4 className="text-sm font-normal text-foreground italic">
                    {ach.event}
                  </h4>
                )}
                <p className="text-sm text-foreground whitespace-pre-wrap mt-1">
                  {ach.description}
                </p>
              </div>
            )
        )}
      </Section>
    ),
    leadership: data.leadershipAndVolunteering &&
      data.leadershipAndVolunteering.length > 0 && (
        <Section title="LEADERSHIP AND VOLUNTEERING">
          {data.leadershipAndVolunteering.map((lead, index) => (
            <div key={index} className="section-item">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-semibold text-foreground">
                  {lead.role}
                </h3>
                {lead.date && (
                  <p className="text-sm text-foreground">{lead.date}</p>
                )}
              </div>
              <h4 className="text-sm font-normal text-foreground italic">
                {lead.organization}
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap mt-1">
                {lead.description}
              </p>
            </div>
          ))}
        </Section>
      ),
    education: data.education && data.education.length > 0 && (
      <Section title="EDUCATION">
        {data.education.map((edu, index) => (
          <div key={index} className="section-item">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-semibold text-foreground">
                {edu.degree}
              </h3>
              <p className="text-sm text-foreground">
                {edu.graduationDate}
              </p>
            </div>
            <div className="flex justify-between items-baseline text-sm text-foreground">
              <p>{edu.school}</p>
              {edu.location && (
                <p className="flex items-center gap-1">{edu.location}</p>
              )}
            </div>
            {edu.cgpa && (
              <p className="text-sm text-foreground">
                CGPA/Result: {edu.cgpa}
              </p>
            )}
          </div>
        ))}
      </Section>
    ),
    skills: data.skills && (
      <Section title="SKILLS">
        {data.skills.technicalSkills && (
          <div className="mb-2">
            <TechnicalSkillsDisplay skills={data.skills.technicalSkills} />
          </div>
        )}
        {data.skills.softSkills && (
          <div className="section-item">
            <h3 className="text-md font-semibold">Skills / Soft skills</h3>
            <p className="text-sm whitespace-pre-wrap text-foreground">{data.skills.softSkills}</p>
          </div>
        )}
        {data.skills.language && (
          <div className="section-item">
            <h3 className="text-md font-semibold">Language</h3>
            <p className="text-sm whitespace-pre-wrap text-foreground">{data.skills.language}</p>
          </div>
        )}
      </Section>
    ),
    certificates: data.certificates && data.certificates.length > 0 && (
      <Section title="CERTIFICATE OF COMPLETION">
        {data.certificates.map((cert, index) => (
          <div key={index} className="section-item">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-semibold text-foreground">
                {cert.name}
              </h3>
              {cert.date && (
                <p className="text-sm text-foreground">{cert.date}</p>
              )}
            </div>
            <h4 className="text-sm font-normal text-foreground italic">
              {cert.issuingOrganization}
            </h4>
          </div>
        ))}
      </Section>
    ),
    references: data.references && data.references.length > 0 && (
      <Section title="REFERENCES">
        {data.references.map((ref, index) => (
          <div key={index} className="section-item">
            <h3 className="text-md font-semibold text-foreground">
              {ref.name}
            </h3>
            {ref.relation && (
              <h4 className="text-sm font-normal text-foreground italic">
                {ref.relation}
              </h4>
            )}
            <p className="text-sm text-foreground">{ref.contact}</p>
          </div>
        ))}
      </Section>
    ),
  };
  
  return (
    <div 
      id="resume-preview"
      className="bg-card text-card-foreground p-12 shadow-lg rounded-lg animate-in fade-in-50 duration-500 font-body w-full max-w-4xl mx-auto leading-relaxed"
      style={resumeStyle}
    >
      <header className="text-center mb-8">
        {data.personal?.name && (
          <h1 className="text-4xl font-bold font-headline text-foreground uppercase">
            {data.personal.name}
          </h1>
        )}
        <div className="mt-2 text-sm text-foreground">
          <div className="flex justify-center items-center flex-wrap gap-x-2">
            {data.personal?.location && <span>{data.personal.location}</span>}
            {data.personal?.location && (data.personal.phone || data.personal.email) && <span>•</span>}
            {data.personal?.phone && <span>{data.personal.phone}</span>}
            {data.personal.phone && data.personal.email && <span>•</span>}
            {data.personal?.email && (
              <a
                href={`mailto:${data.personal.email}`}
                className="hover:text-primary transition-colors text-foreground"
              >
                {data.personal.email}
              </a>
            )}
          </div>
          {data.personal?.linkedin && (
            <div className="mt-1">
              <a
                href={ensureAbsoluteUrl(data.personal.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors text-foreground"
              >
                {data.personal.linkedin}
              </a>
            </div>
          )}
        </div>
      </header>
      
      {sections.map((section, idx) => (
        <div key={section.id}>
          {sectionComponents[section.id]}
        </div>
      ))}
    </div>
  );
}
