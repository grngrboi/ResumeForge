import { z } from "zod";

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  school: z.string().min(1, "School is required"),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
  cgpa: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  projectType: z.string().optional(),
  role: z.string().optional(),
  period: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  preview: z.string().optional(),
});

export const achievementSchema = z.object({
  achievement: z.string().min(1, "Achievement is required"),
  event: z.string().optional(),
  date: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export const leadershipAndVolunteeringSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
  role: z.string().min(1, "Role is required"),
  date: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuingOrganization: z.string().optional(),
  date: z.string().optional(),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact is required"),
  relation: z.string().optional(),
});

export const resumeSchema = z.object({
  personal: z.object({
    name: z.string().optional(),git 
    email: z.string().optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    location: z.string().optional(),
  }),
  styling: z.object({
    fontFamily: z.string().optional(),
    fontSize: z.string().optional(),
    lineHeight: z.string().optional(),
    textAlign: z.string().optional(),
  }),
  summary: z.string().min(1, "A summary is required"),
  projects: z.array(projectSchema),
  achievements: z.array(achievementSchema),
  leadershipAndVolunteering: z.array(leadershipAndVolunteeringSchema),
  education: z.array(educationSchema),
  skills: z.object({
    technicalSkills: z.string().optional(),
    softSkills: z.string().optional(),
    language: z.string().optional(),
  }),
  certificates: z.array(certificateSchema),
  references: z.array(referenceSchema),
});

export type ResumeSchema = z.infer<typeof resumeSchema>;
export type EducationSchema = z.infer<typeof educationSchema>;
export type ProjectSchema = z.infer<typeof projectSchema>;
export type AchievementSchema = z.infer<typeof achievementSchema>;
export type LeadershipAndVolunteeringSchema = z.infer<typeof leadershipAndVolunteeringSchema>;
export type CertificateSchema = z.infer<typeof certificateSchema>;
export type ReferenceSchema = z.infer<typeof referenceSchema>;
