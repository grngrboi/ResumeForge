import type { ResumeSchema } from './types';

export const initialData: ResumeSchema = {
  personal: {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    phone: '123-456-7890',
    linkedin: 'www.linkedin.com/in/jeremy-tommy-ajeng-emang-3581132a9',
    location: 'New York, NY',
  },
  styling: {
    fontFamily: 'Inter',
    fontSize: "0.9rem",
    lineHeight: "1.5",
    textAlign: 'left',
  },
  summary:
    'Innovative and results-driven Software Engineer with 5+ years of experience in developing and scaling web applications. Proficient in JavaScript, React, and Node.js with a proven ability to lead projects from conception to completion. Passionate about creating efficient, user-friendly solutions and collaborating with cross-functional teams to achieve business goals.',
  projects: [
    {
      name: 'AI Resume Builder',
      projectType: 'Self-Project',
      role: 'Lead Developer',
      period: '2023-Present',
      description:
        'A personal portfolio website to showcase my projects and skills, built with Next.js and deployed on Vercel.',
      preview: 'https://my-resume-builder.com',
    },
  ],
  achievements: [
    { 
      achievement: 'Innovator of the Year Award',
      event: 'Annual Company Awards',
      date: '2023',
      description: 'Awarded for developing a new feature that increased user engagement by 20%.'
    },
  ],
  leadershipAndVolunteering: [
    {
      organization: 'Tech-for-Good',
      role: 'Mentor',
      date: '2022-Present',
      description: 'Mentored junior developers from underrepresented backgrounds, helping them to start their careers in tech.'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      location: 'New York, NY',
      graduationDate: 'May 2019',
      cgpa: '3.8/4.0',
    },
  ],
  skills: {
    technicalSkills: 'JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, Docker, Git, Agile Methodologies',
    softSkills: 'Communication, Teamwork, Problem Solving, Project Management',
    language: 'English (Native), Spanish (Conversational)',
  },
  certificates: [
    {
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuingOrganization: 'The Linux Foundation',
      date: '2022',
    }
  ],
  references: [
    {
      name: 'Jane Smith',
      contact: 'jane.smith@example.com',
      relation: 'Former Manager at Tech Solutions Inc.',
    },
  ],
};

export const initialSections = [
    { id: 'summary', title: 'Professional Summary' },
    { id: 'projects', title: 'Projects' },
    { id: 'achievements', title: 'Achievements' },
    { id: 'skills', title: 'Skills' },
    { id: 'leadership', title: 'Leadership and Volunteering' },
    { id: 'education', title: 'Education' },
    { id: 'certificates', title: 'Certificate of Completion' },
    { id: 'references', title: 'References' },
];
