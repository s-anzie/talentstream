
import { z } from 'zod';
import type { Icon as LucideIcon } from 'lucide-react';

// --- Authentication & User ---
export const loginSchema = z.object({
  email: z.string().email({ message: "Une adresse e-mail valide est requise." }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom complet est requis." }),
  email: z.string().email({ message: "Une adresse e-mail valide est requise." }),
  password: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }),
  role: z.enum(['candidate', 'recruiter'], { required_error: "Le rôle est requis." }) // User selects 'recruiter' intent
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface User {
  id: string;
  fullName?: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin' | 'recruiter_unassociated'; // Added recruiter_unassociated
  avatarUrl?: string;
  companyId?: string | null;
  companyName?: string | null;
  professionalTitle?: string;
  location?: string;
  phone?: string; // Added for consistency
}

export interface CompanyInvitation {
  id: string;
  companyName: string;
  companyId: string;
  recipientEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  dateSent: string;
}


// --- Public Content ---
export interface PublicJob {
  id: string;
  title: string;
  company: string;
  companyId: string;
  logoUrl?: string;
  location: string;
  type: string;
  category: string;
  postedDate: string;
  salary?: string;
  shortDescription: string;
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  fullDescription?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  applicationDeadline?: string;
}

export interface CompanyReview {
    id: string;
    author: string;
    rating: number;
    title: string;
    text: string;
    date: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  tagline: string;
  industry: string;
  location: string;
  size: string;
  activeJobs: number | Array<{ id: string, title: string, location: string, type: string }>;
  rating?: number;
  coverImageUrl?: string;
  website?: string;
  founded?: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: string[];
  gallery?: string[];
  reviews?: CompanyReview[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorAvatar?: string;
  date: string;
  excerpt: string;
  imageUrl?: string;
  tags?: string[];
  commentsCount?: number;
  likes?: number;
  content?: string;
}

export interface BlogCategory {
    name: string;
    slug: string;
    postCount: number;
    description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  value: string;
}

export const jobApplicationSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  phone: z.string().optional().or(z.literal('')),
  resume: z.any().refine(files => files?.length > 0, "CV requis.").optional(),
  coverLetter: z.string().max(2000, { message: "Max 2000 caractères."}).optional().or(z.literal('')),
});
export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

export const reviewFormSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit comporter au moins 3 caractères." }).max(100, {message: "Le titre ne peut pas dépasser 100 caractères."}),
  author: z.string().min(2, { message: "Votre nom est requis."}).max(50, {message: "Le nom ne peut pas dépasser 50 caractères."}),
  rating: z.coerce.number().min(1, "Note requise.").max(5, "Note maximale de 5."),
  text: z.string().min(10, { message: "L'avis doit comporter au moins 10 caractères." }).max(2000, {message: "L'avis ne peut pas dépasser 2000 caractères."}),
});
export type ReviewFormData = z.infer<typeof reviewFormSchema>;


// --- User/Candidate Specific ---
export const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom complet doit comporter au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  phone: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  professionalTitle: z.string().optional().or(z.literal("")),
  bio: z.string().max(500, { message: "La biographie ne doit pas dépasser 500 caractères." }).optional().or(z.literal("")),
  resume: z.any().optional(),
  skills: z.string().optional().or(z.literal("")),
  linkedinUrl: z.string().url({ message: "URL LinkedIn invalide." }).optional().or(z.literal("")),
  portfolioUrl: z.string().url({ message: "URL de portfolio invalide." }).optional().or(z.literal("")),
  githubUrl: z.string().url({ message: "URL GitHub invalide." }).optional().or(z.literal("")),
  experience1Title: z.string().optional().or(z.literal("")),
  experience1Company: z.string().optional().or(z.literal("")),
  experience1Dates: z.string().optional().or(z.literal("")),
  experience1Description: z.string().optional().or(z.literal("")),
  education1Degree: z.string().optional().or(z.literal("")),
  education1Institution: z.string().optional().or(z.literal("")),
  education1Dates: z.string().optional().or(z.literal("")),
});
export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface CandidateApplication {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  companyId?: string;
  dateApplied: string;
  status: string;
  jobId: string;
  location: string;
  feedback?: Array<{
    author: string;
    date: string;
    text: string;
    rating?: string;
  }>;
  statusHistory?: Array<{status: string, date: string, notes?: string}>;
  matchScore?: number;
}

export interface SavedJob extends PublicJob {
  dateSaved: string;
}

export const ParseResumeInputSchema = z.object({
  resumeDataUri: z.string().min(1, { message: "Le contenu du CV ne peut pas être vide." })
    .describe("The resume content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

export const ExtractedExperienceSchema = z.object({
  title: z.string().optional().describe("Job title or role."),
  company: z.string().optional().describe("Company name."),
  dates: z.string().optional().describe("Employment dates."),
  description: z.string().optional().describe("Description of responsibilities."),
});
export type ExtractedExperience = z.infer<typeof ExtractedExperienceSchema>;

export const ExtractedEducationSchema = z.object({
  degree: z.string().optional().describe("Degree obtained."),
  institution: z.string().optional().describe("Name of the institution."),
  dates: z.string().optional().describe("Period of study."),
});
export type ExtractedEducation = z.infer<typeof ExtractedEducationSchema>;

export const ParseResumeOutputSchema = z.object({
  fullName: z.string().optional().describe("Full name."),
  email: z.string().email().optional().describe("Email address."),
  phone: z.string().optional().describe("Phone number."),
  location: z.string().optional().describe("Location."),
  linkedinUrl: z.string().url().optional().describe("LinkedIn profile URL."),
  githubUrl: z.string().url().optional().describe("GitHub profile URL."),
  portfolioUrl: z.string().url().optional().describe("Portfolio URL."),
  summary: z.string().optional().describe("Professional summary."),
  skills: z.array(z.string()).optional().describe("List of skills."),
  experience: z.array(ExtractedExperienceSchema).optional().describe("Professional experiences."),
  education: z.array(ExtractedEducationSchema).optional().describe("Educational qualifications."),
  otherInformation: z.string().optional().describe("Other relevant information."),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;

// --- Dashboard/Company Specific ---
export const jobPostingFormSchema = z.object({
  jobTitle: z.string().min(5, { message: "Titre (min 5 car.)" }),
  fullDescription: z.string().min(50, { message: "Description (min 50 car.)" }),
  skills: z.string().min(5, { message: "Compétences (min 5 car.)" }),
  location: z.string().min(3, { message: "Localisation requise." }),
  contractType: z.enum(["Temps plein", "CDI", "CDD", "Stage", "Freelance", "Alternance"], { required_error: "Type de contrat requis." }),
  jobCategory: z.string().min(1, {message: "Catégorie requise."}).optional(),
  salaryMin: z.preprocess(val => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Salaire doit être un nombre." }).positive().optional()),
  salaryMax: z.preprocess(val => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number({ invalid_type_error: "Salaire doit être un nombre." }).positive().optional()),
  experienceLevel: z.string().optional(),
  responsibilities: z.string().optional(),
  qualifications: z.string().optional(),
  benefits: z.string().optional(),
  applicationDeadline: z.any().optional().nullable(),
}).refine(data => data.salaryMin && data.salaryMax ? data.salaryMax >= data.salaryMin : true, { message: "Salaire max. >= salaire min.", path: ["salaryMax"] });
export type JobPostingFormData = z.infer<typeof jobPostingFormSchema>;

export interface DashboardJob {
  id: string;
  title: string;
  location: string;
  datePosted: string;
  status: "Ouvert" | "Fermé" | "En attente d'approbation" | "Brouillon" | "Archivé";
  applicationsCount: number;
  views: number;
  companyId: string;
  company?: {id:string, name:string, logoUrl?:string};
  salaryMin?: number;
  salaryMax?: number;
  contractType?: string;
  jobCategory?: string;
  experienceLevel?: string;
  fullDescription?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  applicationDeadline?: Date | string;
  skills?: string;
  jobTitle?: string;
}

export interface CompanyCandidate {
  id: string;
  name: string;
  avatarUrl?: string;
  title?: string;
  applicationDate?: string;
  matchScore?: number;
  status?: string;
  tags?: string[];
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  skills?: string[];
  experiences?: Array<ExperienceEntry & { location?: string }>;
  education?: EducationEntry[];
  resumeUrl?: string;
  applications?: Array<{ jobId: string; jobTitle: string; companyId: string; appliedDate: string; status: string; }>;
  internalNotes?: Array<{ id: string; author: string; text: string; timestamp: string; jobId?: string }>;
  interviews?: Array<{ id: string; jobTitle: string; type: string; date: string; time: string; interviewer: string; status: string }>;
  suitabilityScore?: number;
}

export const addCandidateFormSchema = z.object({
  fullName: z.string().min(2, { message: "Nom complet (min 2 car.)" }),
  email: z.string().email({ message: "Email invalide." }),
  phone: z.string().optional().or(z.literal('')),
  professionalTitle: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  summary: z.string().max(1000).optional().or(z.literal('')),
  skills: z.string().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  resume: z.any().optional(),
  experience: z.string().optional().or(z.literal('')),
  education: z.string().optional().or(z.literal('')),
});
export type AddCandidateFormData = z.infer<typeof addCandidateFormSchema>;

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  joinDate?: string;
  phone?: string;
}

export const inviteTeamMemberFormSchema = z.object({
  email: z.string().email({ message: "Email invalide." }),
  role: z.enum(["Recruteur", "Manager RH", "Administrateur", "Collaborateur (Lecture seule)"], { required_error: "Rôle requis." }),
});
export type InviteTeamMemberFormData = z.infer<typeof inviteTeamMemberFormSchema>;

export interface BillingInfo {
  planName: string;
  price: string;
  renewalDate: string;
  features: string[];
  companyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  billingEmail?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  pdfLink: string;
  planName?: string;
  companyName?: string;
  companyAddress?: string;
  billingEmail?: string;
  dueDate?: string;
  subTotal?: string;
  taxAmount?: string;
  totalAmount?: string;
  paymentMethod?: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isPrimary: boolean;
}

export interface CompanyApplication {
    id: string;
    candidateId: string;
    candidateName: string;
    candidateAvatarUrl?: string;
    jobId: string;
    jobTitle: string;
    applicationDate: string;
    status: string;
    matchScore?: number;
    candidateDetails?: Partial<CompanyCandidate>;
    jobDetails?: Partial<DashboardJob>;
    feedback?: Array<{
      author: string;
      date: string;
      text: string;
      rating?: string;
    }>;
    notes?: Array<{ author: string; text: string; date: string }>;
}

export interface UserConversation {
    id: string;
    candidateId: string;
    recruiterId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    jobTitle?: string;
    jobId?: string;
}

export interface UserMessage {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    senderRole: 'candidate' | 'recruiter';
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface UserNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    type: 'new_job' | 'application_status' | 'new_message' | 'interview_reminder' | 'general';
    link?: string;
}

export interface AnalyticsKPIType {
    title: string;
    value: string;
    iconName: keyof typeof import("lucide-react");
    trend?: string;
}
export interface AnalyticsChartDataType { month: string; new: number; hired: number; }
export interface AnalyticsSourceDataType { name: string; value: number; fill: string; }
export interface AnalyticsFunnelDataType { value: number; name: string; fill: string; }

export interface AnalyticsOverviewData {
    kpis: AnalyticsKPIType[];
    candidateFlowData: AnalyticsChartDataType[];
    candidateSourcesData: AnalyticsSourceDataType[];
    recruitmentFunnelData: AnalyticsFunnelDataType[];
}

// CV Builder Types
export interface PersonalInformationData {
  fullName?: string;
  professionalTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
}
export interface ExperienceEntry {
  id: string;
  title?: string;
  company?: string;
  dates?: string;
  description?: string;
}
export interface EducationEntry {
  id: string;
  degree?: string;
  institution?: string;
  dates?: string;
}
export interface ProjectEntry {
  id: string;
  title?: string;
  description?: string;
  dates?: string;
  link?: string;
}
export type LanguageLevel = "Débutant" | "Intermédiaire" | "Avancé" | "C1/C2 (Courant)" | "Langue Maternelle";
export interface LanguageEntry {
  id: string;
  name?: string;
  level?: LanguageLevel;
}
export interface CVData {
  personalInfo: PersonalInformationData;
  summary?: string;
  skills?: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  languages: LanguageEntry[];
  interests?: string;
}

// Company Settings Types
export const companyProfileSettingsSchema = z.object({
  companyName: z.string().min(2, { message: "Le nom de l'entreprise est requis." }),
  companyWebsite: z.string().url({ message: "URL de site web invalide." }).optional().or(z.literal("")),
  companyDescription: z.string().max(1000, { message: "Description trop longue (max 1000 caractères)." }).optional().or(z.literal("")),
  companyIndustry: z.string().optional().or(z.literal("")),
  companyLocation: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});
export type CompanyProfileSettingsFormData = z.infer<typeof companyProfileSettingsSchema>;

export interface CompanyProfileSettings extends CompanyProfileSettingsFormData {
    companyId: string;
}
export interface CompanyNotificationPreferences {
    newApplicationAlerts: boolean;
    candidateMessages: boolean;
    interviewReminders: boolean;
}
// User Settings Types
export interface UserAccountSettings {
    email: string;
}
export interface UserNotificationSettings {
    jobAlerts: boolean;
    applicationUpdates: boolean;
    messageNotifications: boolean;
    newsletter: boolean;
}
export interface UserPrivacySettings {
    profileVisibility: "public" | "recruiters_only" | "private";
    searchEngineIndexing: boolean;
    dataSharingRecruiters: boolean;
}

// Portfolio
export const portfolioItemSchema = z.object({
  title: z.string().min(3, "Le titre doit avoir au moins 3 caractères."),
  description: z.string().min(10, "La description doit avoir au moins 10 caractères."),
  imageUrl: z.string().url("URL de l'image invalide.").optional().or(z.literal("")),
  projectUrl: z.string().url("URL du projet invalide.").optional().or(z.literal("")),
  tags: z.string().optional(), // Comma-separated
});
export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>;
export interface PortfolioItem extends PortfolioItemFormData {
  id: string;
}

// Certifications
export const certificationSchema = z.object({
  name: z.string().min(3, "Le nom doit avoir au moins 3 caractères."),
  issuingOrganization: z.string().min(2, "L'organisation est requise."),
  issueDate: z.string().refine(val => !isNaN(Date.parse(val)), "Date invalide."),
  expirationDate: z.string().optional().refine(val => val === "" || !val || !isNaN(Date.parse(val)), "Date d'expiration invalide.").or(z.literal("")),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("URL invalide.").optional().or(z.literal("")),
});
export type CertificationFormData = z.infer<typeof certificationSchema>;
export interface Certification extends CertificationFormData {
  id: string;
}

// Referrals
export const referralRequestSchema = z.object({
  contactName: z.string().min(2, "Nom du contact requis."),
  contactEmail: z.string().email("Email du contact invalide."),
  contactCompany: z.string().optional(),
  message: z.string().min(10, "Message trop court.").max(1000, "Message trop long."),
});
export type ReferralRequestFormData = z.infer<typeof referralRequestSchema>;
export interface Referral {
  id: string;
  type: 'requested' | 'given';
  contactName: string;
  contactEmail: string;
  contactCompany?: string;
  status: 'pending' | 'completed' | 'declined';
  date: string;
  jobTitle?: string;
  message?: string;
}

// Dashboard - Interview
export const scheduleInterviewSchema = z.object({
  candidateId: z.string().min(1, "Candidat requis."),
  jobId: z.string().min(1, "Offre requise."),
  interviewDate: z.date({required_error: "Date requise."}),
  interviewTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM requis."),
  interviewType: z.enum(["RH", "Technique", "Manager", "Panel", "Culture Fit", "Autre"], {required_error: "Type requis."}),
  interviewers: z.string().min(1, "Au moins un intervenant requis."),
  notes: z.string().optional(),
});
export type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;

export interface Interview {
    id: string;
    candidateId: string;
    candidateName: string;
    candidateAvatarUrl?: string;
    jobId: string;
    jobTitle: string;
    date: string;
    time: string;
    type: string;
    interviewers: string;
    status: "Planifié" | "Terminé" | "Annulé" | "À venir";
    notes?: string;
    feedback?: string;
    data?: Record<string, any>;
}

// Calendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'interview' | 'reminder' | 'meeting';
  data?: any;
}
