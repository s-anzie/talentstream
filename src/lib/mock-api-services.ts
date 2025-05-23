
"use client";
import axios from 'axios';
import type {
  LoginFormData, RegisterFormData, User, PublicJob, Company, BlogPost, FAQItem,
  CandidateApplication, SavedJob, CompanyCandidate, TeamMember, BillingInfo, Invoice,
  PaymentMethod, ParseResumeInput, ParseResumeOutput, BlogCategory, CompanyApplication as DashboardCompanyApplication,
  UserMessage, UserConversation, UserNotification, AnalyticsOverviewData,
  JobPostingFormData, ProfileFormData, CompanyProfileSettings, CompanyProfileSettingsFormData, CompanyNotificationPreferences,
  UserAccountSettings, UserNotificationSettings, UserPrivacySettings, PortfolioItem, PortfolioItemFormData,
  Certification, CertificationFormData, Referral, ReferralRequestFormData, Interview, ScheduleInterviewFormData,
  CalendarEvent, CompanyInvitation
} from './types';

import {
  mockCandidateUser, mockRecruiterUser, mockJobs, mockCompanies, mockBlogPosts, mockFaqItems,
  mockCandidateApplications, mockSavedJobs, mockJobPostings, mockCompanyCandidatesMap, mockTeamMembers,
  mockBillingInfo, mockInvoices, mockPaymentMethods, mockBlogCategories, mockDashboardCompanyApplications,
  mockUserConversations, mockUserMessages, mockUserNotifications, mockAnalyticsOverviewData,
  mockCompanySettings as defaultCompanySettings,
  mockCompanyNotificationPrefs, mockUserSettings, mockUserNotificationSettings,
  mockUserPrivacySettings, mockUserPortfolioItems, mockUserCertifications, mockUserReferrals,
  mockDashboardInterviews, mockUserInterviews, mockAdminUser, mockUsers,
  initialCVData, initialProfileFormData, mockCompanyInvitations
} from './mock-data';
import { v4 as uuidv4 } from 'uuid';
import { format, addMonths, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const SIMULATED_DELAY = 300;

// --- Authentication ---
export const apiLogin = async (credentials: LoginFormData): Promise<User> => {
  console.log('API: Logging in with', credentials);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const user = mockUsers.find(u => u.email === credentials.email && credentials.password === 'password123');
  if (user) return { ...user };
  throw new Error('Identifiants invalides. Veuillez réessayer.');
};

export const apiRegister = async (data: RegisterFormData): Promise<User> => {
  console.log('API: Registering with', data);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('Un compte avec cet e-mail existe déjà.');
  }

  const newUser: User = {
    id: `user-${uuidv4().slice(0,8)}`,
    fullName: data.fullName,
    email: data.email,
    role: data.role === 'recruiter' ? 'recruiter_unassociated' : 'candidate',
    avatarUrl: `https://placehold.co/40x40.png?text=${data.fullName.substring(0,2).toUpperCase()}`,
    companyId: data.role === 'recruiter' ? `comp-${uuidv4().slice(0,4)}` : undefined,
    companyName: undefined, // Set explicitly to undefined
  };
  mockUsers.push(newUser);
  console.log("New user registered:", newUser);
  return newUser;
};

export const apiFetchUserProfile = async (userId: string): Promise<User | null> => {
  console.log('API: Fetching user profile for', userId);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const user = mockUsers.find(u => u.id === userId);
  return user ? { ...user } : null;
};

// --- Recruiter Onboarding ---
export const fetchUserInvitations = async (email: string): Promise<CompanyInvitation[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  console.log(`API: Fetching invitations for ${email}`);
  return JSON.parse(JSON.stringify(mockCompanyInvitations.filter(inv => inv.recipientEmail === email && inv.status === 'pending')));
};

export const respondToInvitation = async (invitationId: string, accept: boolean): Promise<{ success: boolean, companyId?: string, companyName?: string }> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const invitation = mockCompanyInvitations.find(inv => inv.id === invitationId);
  if (invitation) {
    invitation.status = accept ? 'accepted' : 'declined';
    console.log(`API: Invitation ${invitationId} ${accept ? 'accepted' : 'declined'}`);
    if (accept) {
        const userToUpdate = mockUsers.find(u => u.email === invitation.recipientEmail);
        if (userToUpdate) {
            userToUpdate.companyId = invitation.companyId;
            userToUpdate.companyName = invitation.companyName;
            userToUpdate.role = 'recruiter'; // Update role
        }
      return { success: true, companyId: invitation.companyId, companyName: invitation.companyName };
    }
    return { success: true };
  }
  throw new Error("Invitation non trouvée.");
};


// --- Public Data ---
export const fetchPublicJobs = async (): Promise<PublicJob[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return JSON.parse(JSON.stringify(mockJobs));
};

export const fetchPublicJobDetails = async (jobId: string): Promise<PublicJob | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const job = mockJobs.find(j => j.id === jobId);
  return job ? JSON.parse(JSON.stringify(job)) : null;
};

export const fetchCompanies = async (): Promise<Company[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return JSON.parse(JSON.stringify(mockCompanies));
};

export const fetchCompanyDetails = async (companyId: string | null): Promise<Company | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return null;
  const company = mockCompanies.find(c => c.id === companyId);
  if (company) {
    const activeJobsForCompany = Array.from(mockJobPostings.values())
      .filter(j => j.companyId === companyId && j.status === "Ouvert")
      .map(j => ({id: j.id, title: j.jobTitle, location: j.location!, type: j.contractType!}));
    const reviews = [
        {id:"rev1", author:"Employé Actuel", rating:5, title:"Excellente culture", text:"Super ambiance de travail et projets intéressants.", date:"2024-03-15"},
        {id:"rev2", author:"Ancien Stagiaire", rating:4, title:"Bonne expérience", text:"J'ai beaucoup appris durant mon stage.", date:"2023-09-01"}
    ];
    const gallery = [
        "https://placehold.co/600x400.png?text=Bureau+1",
        "https://placehold.co/600x400.png?text=Équipe+Événement",
        "https://placehold.co/600x400.png?text=Salle+de+Pause",
    ];
    return JSON.parse(JSON.stringify({ ...company, activeJobs: activeJobsForCompany, reviews, gallery }));
  }
  return null;
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return JSON.parse(JSON.stringify(mockBlogPosts));
};

export const fetchBlogPostDetails = async (slug: string): Promise<BlogPost | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const post = mockBlogPosts.find(p => p.slug === slug);
  return post ? JSON.parse(JSON.stringify(post)) : null;
};

export const fetchBlogCategories = async (): Promise<BlogCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return JSON.parse(JSON.stringify(mockBlogCategories));
};

export const fetchFaqItems = async (): Promise<FAQItem[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return JSON.parse(JSON.stringify(mockFaqItems));
};

export const submitContactForm = async (data: { name: string; email: string; subject?: string; message: string }): Promise<{success: boolean}> => {
  console.log('API: Submitting contact form', data);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (data.email.includes("error")) {
    throw new Error("Erreur simulée lors de l'envoi du formulaire de contact.");
  }
  return { success: true };
};

export const submitJobApplication = async (jobId: string, formData: JobApplicationFormData): Promise<{success: boolean}> => {
    console.log(`API: Submitting application for job ${jobId}`, formData);
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const job = mockJobs.find(j => j.id === jobId) || mockJobPostings.get(jobId);
    const newApplication: CandidateApplication = {
        id: `app-cand-${uuidv4().slice(0,4)}`,
        jobId: jobId,
        jobTitle: job?.title || job?.jobTitle || "Titre Offre Inconnu",
        company: job?.company || mockCompanies.find(c => c.id === (job as DashboardJob)?.companyId)?.name || "Entreprise Inconnue",
        companyLogo: job?.logoUrl,
        dateApplied: new Date().toISOString().split('T')[0],
        status: "CV Envoyé",
        location: job?.location || "N/A",
        companyId: (job as DashboardJob)?.companyId,
    };
    mockCandidateApplications.push(newApplication);
    return {success: true};
}

// --- User/Candidate Specific ---
export const fetchUserProfileData = async (userId: string): Promise<ProfileFormData | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    const profile = initialProfileFormData;
    return {
        ...profile,
        fullName: user.fullName || profile.fullName,
        email: user.email || profile.email,
        phone: user.phone || profile.phone,
        location: user.location || profile.location,
        professionalTitle: user.professionalTitle || profile.professionalTitle,
    };
  }
  return null;
};
export const updateUserProfileData = async (userId: string, data: ProfileFormData): Promise<{success: boolean}> => {
  console.log('API: Updating user profile for', userId, data);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
  }
  return { success: true };
};

export const fetchCandidateApplications = async (candidateId: string | null): Promise<CandidateApplication[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!candidateId) return [];
  return JSON.parse(JSON.stringify(mockCandidateApplications));
};

export const fetchCandidateApplicationDetails = async (applicationId: string | null): Promise<CandidateApplication | null> => {
  console.log('API: Fetching candidate application details for ID:', applicationId);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!applicationId) return null;
  const application = mockCandidateApplications.find(app => app.id === applicationId);
  return application ? JSON.parse(JSON.stringify(application)) : null;
};


export const fetchSavedJobs = async (candidateId: string | null): Promise<SavedJob[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!candidateId) return [];
  return JSON.parse(JSON.stringify(mockSavedJobs));
};

export const addSavedJob = async (candidateId: string, jobId: string): Promise<{success: boolean}> => {
  console.log('API: Candidate', candidateId, 'saving job', jobId);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const jobToSave = mockJobs.find(j => j.id === jobId);
  if (jobToSave && !mockSavedJobs.some(sj => sj.id === jobToSave.id)) {
    mockSavedJobs.push({ ...jobToSave, dateSaved: new Date().toISOString() });
  }
  return { success: true };
};
export const removeSavedJob = async (candidateId: string, savedJobId: string): Promise<{success: boolean}> => {
  console.log('API: Candidate', candidateId, 'removing saved job', savedJobId);
  const index = mockSavedJobs.findIndex(job => job.id === savedJobId);
  if (index > -1) mockSavedJobs.splice(index, 1);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return { success: true };
};
export const fetchSavedJobDetails = async (savedJobId: string | null): Promise<SavedJob | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!savedJobId) return null;
    const job = mockSavedJobs.find(j => j.id === savedJobId);
    return job ? JSON.parse(JSON.stringify(job)) : null;
};


export const parseResumeAI = async (input: ParseResumeInput): Promise<ParseResumeOutput> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (!input.resumeDataUri) throw new Error("Le contenu du CV est manquant.");
  console.log("API: Parsing resume with data URI starting with:", input.resumeDataUri.substring(0, 50));
  return {
    fullName: "Alice Wonderland (Extrait IA)", email: "alice.ia@example.com", phone: "0601020304",
    location: "Paris, France (Extrait)", summary: "Développeuse full-stack expérimentée. (Extrait IA)",
    skills: ["React", "Node.js", "TypeScript"],
    experience: [{ title: "Dev Senior", company: "Tech Corp IA", dates: "2021-Présent", description: "Lead dev." }],
    education: [{ degree: "Master Info", institution: "Université Z IA", dates: "2017-2019" }]
  };
};

// --- Dashboard/Company Specific ---
export const fetchDashboardJobs = async (companyId: string | null): Promise<DashboardJob[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return [];
  return Array.from(mockJobPostings.values())
    .filter(job => job.companyId === companyId)
    .map(job => ({
      id: job.id, title: job.jobTitle, location: job.location!, datePosted: job.datePosted,
      status: job.status as DashboardJob['status'], applicationsCount: job.applications, views: job.views,
      companyId: job.companyId
    }));
};

export const createDashboardJob = async (companyId: string, data: JobPostingFormData): Promise<{success: boolean, jobId: string}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const newJobId = `job-dash-${uuidv4().slice(0,4)}`;
  const newJobEntry = {
    ...data, id: newJobId, companyId, status: "Ouvert", views: 0, applications: 0,
    datePosted: new Date().toISOString().split('T')[0],
    applicationDeadline: data.applicationDeadline instanceof Date ? format(data.applicationDeadline, "yyyy-MM-dd") : undefined,
  };
  mockJobPostings.set(newJobId, newJobEntry as any);
  return { success: true, jobId: newJobId };
};

export const fetchDashboardJobDetails = async (jobId: string | null): Promise<(DashboardJob) | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!jobId) return null;
  const jobData = mockJobPostings.get(jobId);
  if (jobData) {
    const company = mockCompanies.find(c => c.id === jobData.companyId);
    const pipelineStats = {nouveau:10, enExamen:5, entretienRH:3, entretienTech: 2, offre: 1, embauche: 0, rejete: 1};
    const dashboardJob: DashboardJob = {
      id: jobData.id,
      companyId: jobData.companyId,
      title: jobData.jobTitle,
      jobTitle: jobData.jobTitle,
      fullDescription: jobData.fullDescription,
      skills: jobData.skills,
      location: jobData.location!,
      contractType: jobData.contractType,
      jobCategory: jobData.jobCategory,
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      experienceLevel: jobData.experienceLevel,
      responsibilities: jobData.responsibilities,
      qualifications: jobData.qualifications,
      benefits: jobData.benefits,
      applicationDeadline: jobData.applicationDeadline,
      status: jobData.status as DashboardJob['status'],
      views: jobData.views,
      applicationsCount: jobData.applications,
      datePosted: jobData.datePosted,
      pipelineStats,
      company: company ? {id:company.id, name:company.name, logoUrl:company.logoUrl} : undefined
    };
    return JSON.parse(JSON.stringify(dashboardJob));
  }
  return null;
};

export const updateDashboardJob = async (jobId: string, data: JobPostingFormData): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const existingJob = mockJobPostings.get(jobId);
  if (existingJob) {
    mockJobPostings.set(jobId, {
        ...existingJob, ...data, id: jobId,
        applicationDeadline: data.applicationDeadline instanceof Date ? format(data.applicationDeadline, "yyyy-MM-dd") : data.applicationDeadline
    });
    return { success: true };
  }
  return { success: false };
};

export const deleteDashboardJob = async (jobId: string): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const job = mockJobPostings.get(jobId);
  if (job) {
      job.status = "Archivé";
      return { success: true };
  }
  return { success: false };
};

export const fetchJobCandidates = async (jobId: string | null): Promise<CompanyCandidate[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!jobId) return [];
  return Array.from(mockCompanyCandidatesMap.values()).filter(c => c.applications?.some(app => app.jobId === jobId));
};

export const updateCandidateStatus = async (candidateId: string, jobId: string, newStatus: string): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const candidate = mockCompanyCandidatesMap.get(candidateId);
  if (candidate) {
    const updatedApplications = candidate.applications?.map(app => app.jobId === jobId ? { ...app, status: newStatus } : app);
    mockCompanyCandidatesMap.set(candidateId, { ...candidate, status: newStatus, applications: updatedApplications });

    const dashAppIndex = mockDashboardCompanyApplications.findIndex(app => app.candidateId === candidateId && app.jobId === jobId);
    if (dashAppIndex > -1) {
        mockDashboardCompanyApplications[dashAppIndex].status = newStatus;
    }

    return { success: true };
  }
  return { success: false };
};

export const fetchAllCompanyCandidates = async (companyId: string | null): Promise<CompanyCandidate[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return [];
  return JSON.parse(JSON.stringify(Array.from(mockCompanyCandidatesMap.values())));
};

export const fetchCompanyCandidateDetails = async (candidateId: string | null): Promise<CompanyCandidate | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!candidateId) return null;
  const candidate = mockCompanyCandidatesMap.get(candidateId);
  return candidate ? JSON.parse(JSON.stringify(candidate)) : null;
};

export const addCompanyCandidate = async (companyId: string, data: AddCandidateFormData): Promise<{success: boolean, candidateId: string}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const newCandidateId = `cand-${uuidv4().slice(0,4)}`;
  const newCandidate: CompanyCandidate = {
    id: newCandidateId, name: data.fullName, email: data.email, title: data.professionalTitle,
    skills: data.skills?.split(',').map(s => s.trim()).filter(s => s), status: 'Nouveau',
    avatarUrl: `https://placehold.co/40x40.png?text=${data.fullName.substring(0,2).toUpperCase()}`,
    phone: data.phone, location: data.location, summary: data.summary,
    linkedin: data.linkedinUrl, github: data.githubUrl, portfolio: data.portfolioUrl,
  };
  mockCompanyCandidatesMap.set(newCandidateId, newCandidate);
  return { success: true, candidateId: newCandidateId };
};
export const addCandidateNote = async (candidateId: string, noteData: { author: string; text: string; timestamp: string; jobId?: string }): Promise<CompanyCandidate['internalNotes'][number]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const candidate = mockCompanyCandidatesMap.get(candidateId);
  if (!candidate) throw new Error("Candidat non trouvé");
  const newNote = { ...noteData, id: `note-${uuidv4().slice(0,4)}` };
  if (!candidate.internalNotes) candidate.internalNotes = [];
  candidate.internalNotes.push(newNote);
  return newNote;
};
export const deleteCandidateNote = async (candidateId: string, noteId: string): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const candidate = mockCompanyCandidatesMap.get(candidateId);
  if (candidate && candidate.internalNotes) {
    candidate.internalNotes = candidate.internalNotes.filter(note => note.id !== noteId);
    return { success: true };
  }
  return { success: false };
};


export const fetchTeamMembers = async (companyId: string | null): Promise<TeamMember[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return [];
  return JSON.parse(JSON.stringify(mockTeamMembers));
};

export const inviteTeamMember = async (companyId: string, email: string, role: string): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  mockTeamMembers.push({
    id: `tm-${uuidv4().slice(0,3)}`, name: email.split('@')[0], email, role, status: "En attente",
    lastLogin: "Jamais", avatarUrl: `https://placehold.co/40x40.png?text=${email.substring(0,1).toUpperCase()}`, joinDate: new Date().toISOString().split('T')[0]
  });
  return { success: true };
};

export const fetchTeamMemberDetails = async (memberId: string | null): Promise<TeamMember | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!memberId) return null;
  const member = mockTeamMembers.find(m => m.id === memberId);
  return member ? JSON.parse(JSON.stringify(member)) : null;
};
export const updateTeamMember = async (memberId: string, data: Partial<TeamMember>): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const index = mockTeamMembers.findIndex(m => m.id === memberId);
  if (index !== -1) mockTeamMembers[index] = { ...mockTeamMembers[index], ...data };
  return { success: index !== -1 };
};
export const fetchTeamMemberPermissions = async (memberId: string): Promise<Record<string, boolean> | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  const member = mockTeamMembers.find(m => m.id === memberId);
  if (!member) return null;
  if (member.role === "Administrateur") return { manage_jobs: true, view_candidates: true, manage_candidates: true, access_billing: true, manage_team: true, edit_company_settings: true, view_analytics: true, access_integrations: true };
  if (member.role === "Recruteur") return { manage_jobs: true, view_candidates: true, manage_candidates: true, view_analytics: true };
  if (member.role === "Manager RH") return { manage_jobs: true, view_candidates: true, manage_candidates: true, manage_team: true, view_analytics: true };
  return { view_candidates: true };
};
export const updateTeamMemberPermissions = async (memberId: string, permissions: Record<string, boolean>): Promise<{success: boolean}> => {
  console.log("API: Updating permissions for", memberId, permissions);
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  return { success: true };
};


export const fetchBillingInfo = async (companyId: string | null): Promise<BillingInfo | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return null;
  return JSON.parse(JSON.stringify({ ...mockBillingInfo }));
};
export const updateBillingInfo = async (companyId: string, data: Partial<BillingInfo>): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  Object.assign(mockBillingInfo, data);
  return { success: true };
};

export const fetchInvoices = async (companyId: string | null): Promise<Invoice[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return [];
  return JSON.parse(JSON.stringify(mockInvoices));
};
export const fetchInvoiceDetails = async (invoiceId: string | null): Promise<Invoice | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!invoiceId) return null;
  const invoice = mockInvoices.find(inv => inv.id === invoiceId);
  return invoice ? JSON.parse(JSON.stringify(invoice)) : null;
};

export const fetchPaymentMethods = async (companyId: string | null): Promise<PaymentMethod[] | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!companyId) return null;
    return JSON.parse(JSON.stringify(mockPaymentMethods));
};
export const addPaymentMethod = async (companyId: string, methodDetails: Pick<PaymentMethod, 'type'|'last4'|'expiry'>): Promise<PaymentMethod> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const newMethod: PaymentMethod = { id: `pm-${uuidv4().slice(0,4)}`, ...methodDetails, isPrimary: mockPaymentMethods.length === 0 };
    mockPaymentMethods.push(newMethod);
    return newMethod;
};
export const deletePaymentMethod = async (companyId: string, methodId: string): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const index = mockPaymentMethods.findIndex(pm => pm.id === methodId);
    if (index !== -1 && !mockPaymentMethods[index].isPrimary) {
        mockPaymentMethods.splice(index, 1);
        return { success: true };
    }
    return { success: false };
};
export const setPrimaryPaymentMethod = async (companyId: string, methodId: string): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    mockPaymentMethods.forEach(pm => pm.isPrimary = (pm.id === methodId));
    return { success: true };
};
export const cancelSubscription = async (companyId: string): Promise<{success: boolean}> => {
    console.log("API: Cancelling subscription for", companyId);
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    mockBillingInfo.planName = "Annulé";
    mockBillingInfo.price = "0€";
    return { success: true };
};


export const fetchCompanyApplications = async (companyId: string | null): Promise<DashboardCompanyApplication[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return [];
  return JSON.parse(JSON.stringify(mockDashboardCompanyApplications.filter(app => {
      const job = mockJobPostings.get(app.jobId);
      return job?.companyId === companyId;
  })));
};

export const fetchCompanyApplicationDetails = async (applicationId: string | null): Promise<DashboardCompanyApplication | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!applicationId) return null;
  const app = mockDashboardCompanyApplications.find(a => a.id === applicationId);
  return app ? JSON.parse(JSON.stringify(app)) : null;
};

export const updateCompanyApplicationStatus = async (applicationId: string, newStatus: string, notes?: string): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const appIndex = mockDashboardCompanyApplications.findIndex(a => a.id === applicationId);
    if (appIndex !== -1) {
        mockDashboardCompanyApplications[appIndex].status = newStatus;
        console.log(`API: Application ${applicationId} status to ${newStatus}. Notes: ${notes}`);
        const candidateApp = mockCandidateApplications.find(ca => ca.id === applicationId);
        if (candidateApp) candidateApp.status = newStatus;

        const candidate = mockCompanyCandidatesMap.get(mockDashboardCompanyApplications[appIndex].candidateId);
        if (candidate && candidate.applications) {
            const candAppIndex = candidate.applications.findIndex(ca => ca.jobId === mockDashboardCompanyApplications[appIndex].jobId);
            if (candAppIndex !== -1) {
                candidate.applications[candAppIndex].status = newStatus;
            }
        }

        return { success: true };
    }
    return { success: false };
};

export const submitApplicationFeedback = async (applicationId: string, feedback: { text: string; rating: string }): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const appIndex = mockDashboardCompanyApplications.findIndex(a => a.id === applicationId);
    if (appIndex !== -1) {
        if (!mockDashboardCompanyApplications[appIndex].feedback) mockDashboardCompanyApplications[appIndex].feedback = [];
        mockDashboardCompanyApplications[appIndex].feedback!.push({
            author: "Recruteur (auto)",
            date: new Date().toISOString(),
            text: feedback.text,
            rating: feedback.rating
        });
        const candidateAppIndex = mockCandidateApplications.findIndex(ca => ca.id === applicationId);
        if(candidateAppIndex !== -1) {
            if(!mockCandidateApplications[candidateAppIndex].feedback) mockCandidateApplications[candidateAppIndex].feedback = [];
            mockCandidateApplications[candidateAppIndex].feedback!.push({
                 author: "L'équipe de recrutement",
                 date: new Date().toISOString(),
                 text: feedback.text,
                 rating: feedback.rating
            });
        }
        return { success: true };
    }
    return { success: false };
};

export const fetchUserConversations = async (userId: string | null): Promise<UserConversation[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!userId) return [];
  return JSON.parse(JSON.stringify(mockUserConversations.filter(c => c.candidateId === userId || c.recruiterId === userId)));
};
export const fetchUserConversationDetails = async (conversationId: string | null): Promise<UserConversation | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!conversationId) return null;
    const conversation = mockUserConversations.find(c => c.id === conversationId);
    return conversation ? JSON.parse(JSON.stringify(conversation)) : null;
};

export const fetchUserMessages = async (conversationId: string | null): Promise<UserMessage[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!conversationId) return [];
  return JSON.parse(JSON.stringify(mockUserMessages[conversationId] || []));
};
export const sendUserMessage = async (conversationId: string, message: Omit<UserMessage, 'id' | 'timestamp' | 'conversationId'>): Promise<UserMessage> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newMessage: UserMessage = { ...message, id: uuidv4(), timestamp: new Date().toISOString(), conversationId };
  if (!mockUserMessages[conversationId]) mockUserMessages[conversationId] = [];
  mockUserMessages[conversationId].push(newMessage);
  const convIndex = mockUserConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockUserConversations[convIndex].lastMessage = newMessage.text;
    mockUserConversations[convIndex].timestamp = newMessage.timestamp;
    if (message.senderRole === 'candidate') {
        mockUserConversations[convIndex].unreadCount = (mockUserConversations[convIndex].unreadCount || 0) + 1;
    } else {
        mockUserConversations[convIndex].unreadCount = 0;
    }
  }
  return newMessage;
};

export const fetchUserNotifications = async (userId: string | null): Promise<UserNotification[]> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!userId) return [];
  return JSON.parse(JSON.stringify(mockUserNotifications.filter(n => n.userId === userId || n.userId === "all_candidates")));
};
export const markNotificationAsRead = async (notificationId: string): Promise<{success: boolean}> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const notification = mockUserNotifications.find(n => n.id === notificationId);
  if (notification) notification.isRead = true;
  return { success: true };
};

export const fetchAnalyticsOverviewData = async (companyId: string | null): Promise<AnalyticsOverviewData | null> => {
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
  if (!companyId) return null;
  return JSON.parse(JSON.stringify(mockAnalyticsOverviewData));
};

// Settings
export const fetchCompanyProfileSettings = async (companyId: string | null): Promise<CompanyProfileSettings | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!companyId) return null;

    // Check if this companyId matches our main default company settings
    if (companyId === defaultCompanySettings.companyId) {
        return JSON.parse(JSON.stringify(defaultCompanySettings));
    }

    // Check if this companyId exists in our mockCompanies array (for companies created through the UI)
    const existingCompany = mockCompanies.find(c => c.id === companyId);
    if (existingCompany) {
      return {
        companyId: existingCompany.id,
        companyName: existingCompany.name,
        companyWebsite: existingCompany.website || "",
        companyDescription: existingCompany.description || "",
        companyIndustry: existingCompany.industry || "",
        companyLocation: existingCompany.location || "",
        logoUrl: existingCompany.logoUrl || "",
      };
    }

    // If not found in defaults or existing mockCompanies, check if a user has this companyId
    const user = mockUsers.find(u => u.companyId === companyId && u.role === 'recruiter_unassociated');
    if (user) {
      // This is a newly registered recruiter whose company profile is not yet fully created
      return {
        companyId: companyId,
        companyName: user.companyName || "Nouvelle Entreprise (À compléter)", // Should be from user obj if set
        companyWebsite: "",
        companyDescription: "Veuillez compléter la description de votre entreprise.",
        companyIndustry: "",
        companyLocation: "",
        logoUrl: `https://placehold.co/80x80.png?text=${(user.companyName || "NE").substring(0,2).toUpperCase()}`
      };
    }
    return null; // No matching company found
}
export const updateCompanyProfileSettings = async (companyId: string, data: Partial<CompanyProfileSettingsFormData>): Promise<{success: boolean, companyName?: string}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

    let companyUpdated = false;

    // Try to update defaultCompanySettings if IDs match
    if (defaultCompanySettings.companyId === companyId) {
        Object.assign(defaultCompanySettings, { ...data, companyId });
        companyUpdated = true;
    }

    // Try to update in mockCompanies array
    const companyIndexInCompanies = mockCompanies.findIndex(c => c.id === companyId);
    if (companyIndexInCompanies !== -1) {
        mockCompanies[companyIndexInCompanies] = {
            ...mockCompanies[companyIndexInCompanies],
            name: data.companyName || mockCompanies[companyIndexInCompanies].name,
            website: data.companyWebsite || mockCompanies[companyIndexInCompanies].website,
            description: data.companyDescription || mockCompanies[companyIndexInCompanies].description,
            industry: data.companyIndustry || mockCompanies[companyIndexInCompanies].industry,
            location: data.companyLocation || mockCompanies[companyIndexInCompanies].location,
            logoUrl: data.logoUrl || mockCompanies[companyIndexInCompanies].logoUrl,
        };
        companyUpdated = true;
    }

    // If no existing company was found to update, and it's a valid creation attempt (e.g., companyName is present)
    // This handles the case where a 'recruiter_unassociated' creates their company profile.
    if (!companyUpdated && data.companyName) {
        const newCompanyEntry: Company = {
            id: companyId,
            name: data.companyName,
            logoUrl: data.logoUrl || `https://placehold.co/80x80.png?text=${data.companyName.substring(0,2).toUpperCase()}`,
            tagline: data.companyDescription?.substring(0, 50) || "Nouvelle entreprise",
            industry: data.companyIndustry || "Non spécifié",
            location: data.companyLocation || "Non spécifié",
            size: "1-10 employés",
            activeJobs: 0,
            rating: 0,
            website: data.companyWebsite,
            description: data.companyDescription,
            founded: new Date().getFullYear().toString(),
            values: ["Innovation"],
        };
        mockCompanies.push(newCompanyEntry);
        console.log(`API: Created new company profile entry for ${companyId}`);
        companyUpdated = true;
    }


    if (companyUpdated) {
        const userToUpdate = mockUsers.find(u => u.companyId === companyId);
        if(userToUpdate && data.companyName) {
            userToUpdate.companyName = data.companyName;
            if (userToUpdate.role === 'recruiter_unassociated') {
                 userToUpdate.role = 'recruiter'; // Promote role
            }
        }
        return {success: true, companyName: data.companyName};
    }
    return {success: false};
}
export const fetchCompanyNotificationPreferences = async (companyId: string | null): Promise<CompanyNotificationPreferences | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!companyId) return null;
    return JSON.parse(JSON.stringify(mockCompanyNotificationPrefs));
}
export const updateCompanyNotificationPreferences = async (companyId: string, data: Partial<CompanyNotificationPreferences>): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    Object.assign(mockCompanyNotificationPrefs, data);
    return {success: true};
}

export const fetchUserAccountSettings = async (userId: string | null): Promise<UserAccountSettings | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const user = mockUsers.find(u => u.id === userId);
    return user ? { email: user.email } : null;
}
export const updateUserAccountSettings = async (userId: string, data: UserAccountSettings): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) mockUsers[userIndex].email = data.email;
    return {success: userIndex !== -1};
}
export const fetchUserNotificationSettings = async (userId: string | null): Promise<UserNotificationSettings | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if(!userId) return null;
    return JSON.parse(JSON.stringify(mockUserNotificationSettings));
}
export const updateUserNotificationSettings = async (userId: string, data: Partial<UserNotificationSettings>): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    Object.assign(mockUserNotificationSettings, data);
    return {success: true};
}
export const fetchUserPrivacySettings = async (userId: string | null): Promise<UserPrivacySettings | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!userId) return null;
    return JSON.parse(JSON.stringify(mockUserPrivacySettings));
}
export const updateUserPrivacySettings = async (userId: string, data: Partial<UserPrivacySettings>): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    Object.assign(mockUserPrivacySettings, data);
    return {success: true};
}

// Portfolio
export const fetchUserPortfolioItems = async (userId: string | null): Promise<PortfolioItem[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!userId) return [];
    return JSON.parse(JSON.stringify(mockUserPortfolioItems));
}
export const addUserPortfolioItem = async (userId: string, data: PortfolioItemFormData): Promise<PortfolioItem> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const newItem: PortfolioItem = { ...data, id: `portfolio-${uuidv4().slice(0,4)}`};
    mockUserPortfolioItems.push(newItem);
    return newItem;
}
export const fetchUserPortfolioItemDetails = async (itemId: string | null): Promise<PortfolioItem | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!itemId) return null;
    const item = mockUserPortfolioItems.find(item => item.id === itemId);
    return item ? JSON.parse(JSON.stringify(item)) : null;
}
export const updateUserPortfolioItem = async (itemId: string, data: Partial<PortfolioItemFormData>): Promise<PortfolioItem | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const index = mockUserPortfolioItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        mockUserPortfolioItems[index] = { ...mockUserPortfolioItems[index], ...data };
        return mockUserPortfolioItems[index];
    }
    return null;
}
export const deleteUserPortfolioItem = async (itemId: string): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const index = mockUserPortfolioItems.findIndex(item => item.id === itemId);
    if (index !== -1) mockUserPortfolioItems.splice(index, 1);
    return {success: index !== -1};
}

// Certifications
export const fetchUserCertifications = async (userId: string | null): Promise<Certification[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!userId) return [];
    return JSON.parse(JSON.stringify(mockUserCertifications));
}
export const addUserCertification = async (userId: string, data: CertificationFormData): Promise<Certification> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const newCert: Certification = { ...data, id: `cert-${uuidv4().slice(0,4)}`, issueDate: format(new Date(data.issueDate), 'yyyy-MM-dd'), expirationDate: data.expirationDate ? format(new Date(data.expirationDate), 'yyyy-MM-dd') : undefined};
    mockUserCertifications.push(newCert);
    return newCert;
}
export const fetchUserCertificationDetails = async (certId: string | null): Promise<Certification | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!certId) return null;
    const cert = mockUserCertifications.find(cert => cert.id === certId);
    return cert ? JSON.parse(JSON.stringify(cert)) : null;
}
export const deleteUserCertification = async (certId: string): Promise<{success: boolean}> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const index = mockUserCertifications.findIndex(cert => cert.id === certId);
    if (index !== -1) mockUserCertifications.splice(index, 1);
    return {success: index !== -1};
}

// Referrals
export const fetchUserReferrals = async (userId: string | null): Promise<Referral[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!userId) return [];
    return JSON.parse(JSON.stringify(mockUserReferrals));
}
export const requestUserReferral = async (userId: string, data: ReferralRequestFormData): Promise<Referral> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const newRef: Referral = {
        id: `ref-${uuidv4().slice(0,4)}`, type: 'requested', contactName: data.contactName,
        contactEmail: data.contactEmail, contactCompany: data.contactCompany, message: data.message,
        status: 'pending', date: new Date().toISOString().split('T')[0]
    };
    mockUserReferrals.push(newRef);
    return newRef;
}

// Interviews (Dashboard)
export const fetchDashboardInterviews = async (companyId: string | null): Promise<Interview[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!companyId) return [];
    return JSON.parse(JSON.stringify(mockDashboardInterviews));
}
export const scheduleDashboardInterview = async (companyId: string, data: ScheduleInterviewFormData): Promise<Interview> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const candidate = mockCompanyCandidatesMap.get(data.candidateId);
    const job = mockJobPostings.get(data.jobId);
    const newInterview: Interview = {
        id: `int-dash-${uuidv4().slice(0,4)}`,
        candidateId: data.candidateId,
        candidateName: candidate?.name || "N/A",
        candidateAvatarUrl: candidate?.avatarUrl,
        jobId: data.jobId,
        jobTitle: job?.jobTitle || "N/A",
        date: format(data.interviewDate, "yyyy-MM-dd"),
        time: data.interviewTime,
        type: data.interviewType!,
        interviewers: data.interviewers,
        status: "Planifié",
        notes: data.notes,
        data: { companyId: companyId, companyName: mockCompanies.find(c => c.id === companyId)?.name || "Votre Entreprise" }
    };
    mockDashboardInterviews.push(newInterview);
    const cand = mockCompanyCandidatesMap.get(data.candidateId);
    if(cand && cand.applications){
        const appIndex = cand.applications.findIndex(app => app.jobId === data.jobId);
        if(appIndex !== -1) cand.applications[appIndex].status = "Entretien Planifié";
    }
    const companyAppIndex = mockDashboardCompanyApplications.findIndex(app => app.jobId === data.jobId && app.candidateId === data.candidateId);
    if(companyAppIndex !== -1) mockDashboardCompanyApplications[companyAppIndex].status = "Entretien Planifié";

    return newInterview;
}
export const fetchDashboardInterviewDetails = async (interviewId: string | null): Promise<Interview | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!interviewId) return null;
    const interview = mockDashboardInterviews.find(i => i.id === interviewId);
    return interview ? JSON.parse(JSON.stringify(interview)) : null;
}
export const updateDashboardInterviewNotes = async (interviewId: string, notes: string): Promise<Interview | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    const interview = mockDashboardInterviews.find(i => i.id === interviewId);
    if (interview) {
        interview.notes = notes;
        interview.feedback = notes;
        interview.status = "Terminé";
        return interview;
    }
    return null;
}

// Interviews (User)
export const fetchUserInterviews = async (userId: string | null): Promise<Interview[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!userId) return [];
    return JSON.parse(JSON.stringify(mockUserInterviews.filter(i => i.candidateId === userId)));
}
export const fetchUserInterviewDetails = async (interviewId: string | null): Promise<Interview | null> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    if (!interviewId) return null;
    const interview = mockUserInterviews.find(i => i.id === interviewId);
    return interview ? JSON.parse(JSON.stringify(interview)) : null;
}

// Calendar Events
export const fetchCalendarEvents = async (userIdOrCompanyId: string, rangeStart: Date, rangeEnd: Date): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
    let relevantInterviews: Interview[] = [];
    if (userIdOrCompanyId.startsWith('user-')) {
        relevantInterviews = mockUserInterviews.filter(i => i.candidateId === userIdOrCompanyId);
    } else { // Assume companyId
        relevantInterviews = mockDashboardInterviews.filter(i => i.data?.companyId === userIdOrCompanyId);
    }

    const interviewEvents: CalendarEvent[] = relevantInterviews.map(i => ({
        id: `interview-${i.id}`,
        title: userIdOrCompanyId.startsWith('user-') ? `Mon Entretien: ${i.jobTitle}` : `Entretien: ${i.candidateName} (${i.type})`,
        start: new Date(`${i.date.split('T')[0]}T${i.time}:00`),
        end: new Date(new Date(`${i.date.split('T')[0]}T${i.time}:00`).getTime() + 60 * 60 * 1000),
        type: 'interview' as CalendarEvent['type'],
        data: i
    }));
    return interviewEvents.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= rangeStart && eventStart <= rangeEnd;
    });
};
