
"use client"; // Ensure client-only code if using browser APIs directly

import { format, addMonths, subDays } from 'date-fns';
import { fr } from 'date-fns/locale'; // Ensure this is at the top
import type {
  PublicJob,
  Company,
  BlogPost,
  FAQItem,
  CandidateApplication,
  SavedJob,
  DashboardJob,
  CompanyCandidate,
  TeamMember,
  BillingInfo,
  Invoice,
  PaymentMethod,
  User,
  BlogCategory,
  CompanyApplication as DashboardCompanyApplication,
  UserMessage,
  UserConversation,
  UserNotification,
  AnalyticsOverviewData,
  JobPostingFormData,
  CompanyProfileSettings,
  CompanyNotificationPreferences,
  UserAccountSettings,
  UserNotificationSettings,
  UserPrivacySettings,
  PortfolioItem,
  Certification,
  Referral,
  Interview,
  CVData,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  LanguageEntry,
  LanguageLevel,
  CompanyInvitation // Ensure CompanyInvitation is imported if used here, or defined
} from './types';
import { v4 as uuidv4 } from 'uuid';

export const mockCandidateUser: User = {
  id: 'user-cand-001',
  fullName: 'John Doe',
  email: 'candidate@example.com',
  role: 'candidate',
  avatarUrl: 'https://placehold.co/40x40.png?text=JD',
  professionalTitle: 'Développeur Full-Stack',
  location: 'Paris, France',
};

export const mockRecruiterUser: User = {
  id: 'user-rec-001',
  fullName: 'Jane Smith (Recruiter)',
  email: 'recruiter@example.com',
  role: 'recruiter',
  avatarUrl: 'https://placehold.co/40x40.png?text=JS',
  companyId: 'comp-tsi-001', // Specific ID for Tech Solutions Inc.
  companyName: 'Tech Solutions Inc.',
};

export const mockAdminUser: User = {
    id: 'user-admin-001',
    fullName: 'Super Admin',
    email: 'admin@talentsphere.com',
    role: 'admin',
    avatarUrl: 'https://placehold.co/40x40.png?text=SA',
};

export const mockUsers: User[] = [mockCandidateUser, mockRecruiterUser, mockAdminUser];

export const mockJobs: PublicJob[] = [
  {
    id: "job-public-1",
    title: "Développeur Frontend Vue.js (Public)",
    company: "WebInnov",
    companyId: "webinnov-id",
    logoUrl: "https://placehold.co/60x60.png?text=WI",
    location: "Nantes, France",
    type: "CDI",
    category: "Développement Web",
    postedDate: "2024-07-25",
    salary: "45k€ - 60k€",
    shortDescription: "Créez des interfaces utilisateur modernes et réactives avec Vue.js.",
    skills: ["Vue.js", "JavaScript", "HTML5", "CSS3", "Git"],
    fullDescription: "<p>Nous recherchons un Développeur Frontend passionné par Vue.js pour rejoindre notre équipe innovante à Nantes. Vous participerez à la conception et au développement d'applications web interactives et performantes pour nos clients.</p><h3>Vos missions :</h3><ul><li>Développer de nouvelles fonctionnalités en Vue.js.</li><li>Collaborer avec les designers UX/UI pour intégrer les maquettes.</li><li>Assurer la qualité du code et la maintenabilité des projets.</li><li>Participer aux choix techniques et à l'amélioration continue.</li></ul>",
    responsibilities: ["Développement Vue.js", "Intégration de maquettes", "Tests unitaires", "Veille technologique"],
    qualifications: ["Bac+3/5 en informatique", "Expérience significative avec Vue.js", "Bonne connaissance de l'écosystème JavaScript moderne", "Esprit d'équipe et proactivité"],
    benefits: ["Télétravail partiel possible", "Tickets restaurant", "Mutuelle d'entreprise", "Environnement stimulant"],
    applicationDeadline: "2024-09-30",
  },
  {
    id: "job-public-2",
    title: "Data Scientist Senior (Public)",
    company: "Data Insights Co.",
    companyId: "datainsights-id",
    logoUrl: "https://placehold.co/60x60.png?text=DI",
    location: "Télétravail (France)",
    type: "Temps plein",
    category: "Data Science",
    postedDate: "2024-07-22",
    salary: "60k€ - 80k€",
    shortDescription: "Analysez des ensembles de données complexes et construisez des modèles prédictifs.",
    skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
  },
];

export const mockJobPostings = new Map<string, JobPostingFormData & { id: string, companyId: string, status: string, views: number, applications: number, datePosted: string }>([
  ["job-dash-001", {
    id: "job-dash-001",
    companyId: "comp-tsi-001", // Tech Solutions Inc.
    jobTitle: "Développeur Full-Stack (Dashboard)",
    fullDescription: "Rejoignez notre équipe dashboard pour développer des solutions innovantes. Vous travaillerez sur l'ensemble de la stack, du backend Node.js au frontend React. Nous recherchons une personne autonome, force de proposition et passionnée par les défis techniques.",
    skills: "React, Node.js, TypeScript, PostgreSQL, Docker",
    location: "Paris, France",
    contractType: "CDI",
    jobCategory: "Développement Web",
    salaryMin: 60000, salaryMax: 80000,
    experienceLevel: "Senior (5+ ans)",
    responsibilities: "Développement backend et frontend\nConception d'API\nTests et déploiement",
    qualifications: "Bac+5 en informatique\nExpérience avérée en React et Node.js",
    benefits: "RTT, Mutuelle d'entreprise, Télétravail partiel",
    applicationDeadline: new Date("2024-10-31"),
    status: "Ouvert", views: 150, applications: 25, datePosted: "2024-07-01"
  }],
  ["job-dash-002", {
    id: "job-dash-002",
    companyId: "comp-tsi-001", // Tech Solutions Inc.
    jobTitle: "Product Manager (Dashboard)",
    fullDescription: "Gérez le cycle de vie de nos produits SaaS. Vous serez responsable de la vision produit, de la définition des fonctionnalités et du suivi des développements en méthode Agile.",
    skills: "Agile, Jira, Product Strategy, User Research, Roadmapping",
    location: "Lyon, France",
    contractType: "Temps plein",
    jobCategory: "Gestion de Produit",
    salaryMin: 55000, salaryMax: 75000,
    experienceLevel: "Confirmé (3-5 ans)",
    responsibilities: "Définition de la roadmap produit\nRédaction des user stories\nSuivi des KPIs produit",
    qualifications: "Expérience significative en gestion de produit SaaS\nExcellente communication",
    benefits: "Remote flexible, Primes sur objectifs, Formations",
    applicationDeadline: new Date("2024-11-15"),
    status: "Ouvert", views: 95, applications: 12, datePosted: "2024-07-10"
  }],
  ["job-dash-003", {
    id: "job-dash-003",
    companyId: "webinnov-id",
    jobTitle: "Spécialiste Marketing Digital (Dashboard)",
    fullDescription: "Développez et mettez en œuvre la stratégie de marketing digital pour nos clients. Vous gérerez les campagnes publicitaires, optimiserez le SEO et analyserez les performances.",
    skills: "SEO, SEA, Google Ads, Google Analytics, Content Marketing",
    location: "Nantes, France",
    contractType: "CDI",
    jobCategory: "Marketing Digital",
    salaryMin: 40000, salaryMax: 55000,
    experienceLevel: "Intermédiaire (2-4 ans)",
    responsibilities: "Gestion de campagnes publicitaires (Google, Social Media)\nOptimisation SEO on-page et off-page\nReporting et analyse des performances",
    qualifications: "Bac+3/5 en Marketing ou Communication\nMaîtrise des outils d'analyse web",
    benefits: "Tickets restaurant, Ambiance startup, Projets variés",
    applicationDeadline: new Date("2024-12-01"),
    status: "Ouvert", views: 120, applications: 18, datePosted: "2024-07-15"
  }],
]);

export const mockCompanies: Company[] = [
  {
    id: "comp-tsi-001", // Specific ID for Tech Solutions Inc.
    name: "Tech Solutions Inc.",
    logoUrl: "https://placehold.co/80x80.png?text=TS",
    tagline: "Solutions technologiques innovantes pour un avenir meilleur.",
    industry: "Technologie de l'Information et Logiciels",
    location: "Paris, France",
    size: "50-200 employés",
    activeJobs: Array.from(mockJobPostings.values()).filter(j => j.companyId === "comp-tsi-001" && j.status === "Ouvert").length,
    rating: 4.5,
    website: "https://techsolutions.example.com",
    founded: "2010",
    description: "Tech Solutions Inc. est un leader dans la création de solutions logicielles sur mesure pour les entreprises de taille moyenne. Nous nous spécialisons dans le développement d'applications web et mobiles, l'intelligence artificielle et le cloud computing. Notre mission est d'aider nos clients à transformer leurs opérations grâce à la technologie.",
    mission: "Fournir des solutions technologiques de pointe qui résolvent des problèmes complexes et créent de la valeur durable pour nos clients.",
    vision: "Être le partenaire technologique de référence pour les PME innovantes en Europe.",
    values: ["Innovation", "Collaboration", "Excellence", "Intégrité", "Orientation Client"],
    coverImageUrl: "https://placehold.co/1200x300.png?text=Tech+Solutions+Cover",
    gallery: ["https://placehold.co/600x400.png?text=Office+Space", "https://placehold.co/600x400.png?text=Team+Meeting", "https://placehold.co/600x400.png?text=Company+Event"],
    reviews: [{id: "rev1", author: "Ancien Employé", rating: 5, title: "Excellente entreprise pour évoluer", text: "J'ai beaucoup appris chez Tech Solutions, l'ambiance est top et les projets stimulants.", date: "2024-03-10"}],
  },
  {
    id: "webinnov-id",
    name: "WebInnov",
    logoUrl: "https://placehold.co/80x80.png?text=WI",
    tagline: "Créateurs d'expériences web uniques.",
    industry: "Agence Web et Design Digital",
    location: "Nantes, France",
    size: "10-50 employés",
    activeJobs: Array.from(mockJobPostings.values()).filter(j => j.companyId === "webinnov-id" && j.status === "Ouvert").length,
    rating: 4.2,
    website: "https://webinnov.example.com",
    founded: "2018",
    description: "WebInnov est une agence digitale créative spécialisée dans la conception et le développement de sites web et d'applications mobiles percutants. Nous accompagnons nos clients de la stratégie à la mise en production.",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "optimiser-cv-2024",
    title: "Optimiser son CV en 2024 pour les Recruteurs Modernes",
    category: "Conseils Carrière",
    author: "Alice Martin",
    authorAvatar: "https://placehold.co/40x40.png?text=AM",
    date: "2024-07-15",
    excerpt: "Découvrez les dernières astuces pour faire de votre CV un atout majeur dans votre recherche d'emploi. De la structure aux mots-clés, ne laissez rien au hasard.",
    imageUrl: "https://placehold.co/600x400.png?text=CV+Tips",
    content: "<p>Le CV reste la pierre angulaire de toute candidature. En 2024, il doit être non seulement informatif mais aussi optimisé pour les ATS (Applicant Tracking Systems) et capter l'attention des recruteurs en quelques secondes...</p><h3>Sections Clés d'un CV Moderne</h3><ul><li>Coordonnées claires et professionnelles</li><li>Titre de profil percutant</li><li>Résumé de carrière ou objectif</li><li>Expériences professionnelles quantifiables</li><li>Compétences techniques et comportementales</li><li>Formation et certifications</li></ul><p>Pensez à adapter votre CV à chaque offre d'emploi !</p>",
    tags: ["CV", "Carrière", "Recherche d'emploi", "Conseils"],
    commentsCount: 12,
    likes: 45,
  },
  {
    slug: "ia-recrutement-pme",
    title: "L'Intelligence Artificielle au Service du Recrutement des PME",
    category: "Tendances RH",
    author: "Marc Dubois",
    authorAvatar: "https://placehold.co/40x40.png?text=MD",
    date: "2024-07-10",
    excerpt: "Comment les petites et moyennes entreprises peuvent tirer parti de l'IA pour attirer les meilleurs talents sans se ruiner. Des outils concrets et des stratégies efficaces.",
    imageUrl: "https://placehold.co/600x400.png?text=AI+Recruitment",
    content: "<p>L'IA n'est plus réservée aux grandes entreprises. Les PME peuvent également bénéficier de ses avantages pour optimiser leur processus de recrutement...</p>",
    tags: ["IA", "Recrutement", "PME", "Technologie"],
    commentsCount: 8,
    likes: 33,
  }
];

export const mockBlogCategories: BlogCategory[] = [
  { name: "Conseils Carrière", slug: "conseils-carriere", postCount: 15, description: "Astuces et stratégies pour faire progresser votre carrière et réussir vos recherches d'emploi." },
  { name: "Tendances RH", slug: "tendances-rh", postCount: 12, description: "Les dernières innovations et évolutions dans le monde des ressources humaines et du recrutement." },
  { name: "Actualités TalentSphere", slug: "actualites-talentsphere", postCount: 5, description: "Mises à jour, nouvelles fonctionnalités et annonces de la plateforme TalentSphere." },
];

export const mockFaqItems: FAQItem[] = [
  { question: "Comment puis-je postuler à une offre d'emploi sur TalentSphere ?", answer: "Trouvez l'offre qui vous intéresse dans la section 'Offres d'Emploi', cliquez dessus pour voir les détails, puis utilisez le bouton 'Postuler'. Vous pourrez soumettre votre CV et une lettre de motivation.", value: "faq1" },
  { question: "L'utilisation de TalentSphere est-elle gratuite pour les candidats ?", answer: "Oui, la création de profil, la recherche d'offres et la postulation sont entièrement gratuites pour les chercheurs d'emploi.", value: "faq2" },
  { question: "Comment puis-je modifier mon profil candidat ?", answer: "Une fois connecté, rendez-vous dans votre 'Espace Candidat' et sélectionnez 'Modifier mon Profil'. Vous pourrez y mettre à jour toutes vos informations.", value: "faq3" },
  { question: "Quels types d'entreprises publient des offres sur TalentSphere ?", answer: "TalentSphere se concentre principalement sur les Petites et Moyennes Entreprises (PME) dans divers secteurs, mais vous pourriez également trouver des offres de plus grandes structures.", value: "faq4" },
];

export const mockCandidateApplications: CandidateApplication[] = [
  { id: "app-cand-001", jobId: "job-public-1", jobTitle: "Développeur Frontend Vue.js (Public)", company: "WebInnov", dateApplied: "2024-07-28", status: "CV Envoyé", location: "Nantes", companyId: "webinnov-id", companyLogo: "https://placehold.co/60x60.png?text=WI" },
  { id: "app-cand-002", jobId: "job-public-2", jobTitle: "Data Scientist Senior (Public)", company: "Data Insights Co.", dateApplied: "2024-07-25", status: "Entretien Planifié", location: "Télétravail", companyId: "datainsights-id", companyLogo: "https://placehold.co/60x60.png?text=DI" },
  { id: "app-cand-003", jobId: "job-dash-001", jobTitle: "Développeur Full-Stack (Dashboard)", company: "Tech Solutions Inc.", dateApplied: "2024-07-20", status: "CV Consulté", location: "Paris, France", companyId: "comp-tsi-001", companyLogo: "https://placehold.co/60x60.png?text=TS" },
];

export const mockSavedJobs: SavedJob[] = [
  JSON.parse(JSON.stringify({ ...mockJobs[0], id: "saved-" + mockJobs[0].id, dateSaved: "2024-07-27" })),
  JSON.parse(JSON.stringify({ ...mockJobs[1], id: "saved-" + mockJobs[1].id, dateSaved: "2024-07-26" })),
];

export const mockCompanyCandidatesMap = new Map<string, CompanyCandidate>([
  ["cand001", {
    id: "cand001", name: "Alice Wonderland", avatarUrl: "https://placehold.co/40x40.png?text=AW", title: "Développeuse Full-Stack",
    applicationDate: "2024-07-20", matchScore: 85, status: "Nouveau",
    email: "alice@example.com", phone: "0611223344", location: "Paris",
    skills: ["React", "Node.js"],
    applications: [{ jobId: "job-dash-001", jobTitle: "Développeur Full-Stack (Dashboard)", companyId: "comp-tsi-001", appliedDate: "2024-07-20", status: "Nouveau" }]
  }],
  ["cand002", {
    id: "cand002", name: "Bob The Builder", avatarUrl: "https://placehold.co/40x40.png?text=BB", title: "Architecte Logiciel",
    applicationDate: "2024-07-18", matchScore: 92, status: "Entretien RH",
    email: "bob@example.com", phone: "0655667788", location: "Lyon",
    skills: ["Java", "AWS"],
    applications: [{ jobId: "job-dash-001", jobTitle: "Développeur Full-Stack (Dashboard)", companyId: "comp-tsi-001", appliedDate: "2024-07-18", status: "Entretien RH" }]
  }],
  ["cand003", {
    id: "cand003", name: "Charlie Chaplin", avatarUrl: "https://placehold.co/40x40.png?text=CC", title: "Ingénieur Commercial",
    applicationDate: "2024-07-22", matchScore: 78, status: "En Examen",
    email: "charlie@example.com", phone: "0612341234", location: "Paris",
    skills: ["Vente B2B", "CRM"],
    applications: [{ jobId: "job-dash-002", jobTitle: "Product Manager (Dashboard)", companyId: "comp-tsi-001", appliedDate: "2024-07-22", status: "En Examen" }]
  }],
]);

export const mockTeamMembers: TeamMember[] = [
  { id: "tm1", name: "Sophie Dubois", email: "sophie@techsolutions.com", role: "Administrateur", status: "Actif", lastLogin: "2024-07-29 10:00", avatarUrl:"https://placehold.co/40x40.png?text=SD", joinDate: "2023-01-15" },
  { id: "tm2", name: "Marc Petit", email: "marc@techsolutions.com", role: "Recruteur", status: "Actif", lastLogin: "2024-07-28 15:00", avatarUrl:"https://placehold.co/40x40.png?text=MP", joinDate: "2023-03-20" },
];

export const mockBillingInfo: BillingInfo = {
  planName: "Business", price: "129€/mois", renewalDate: format(addMonths(new Date(), 1), "dd MMMM yyyy", { locale: fr }),
  features: ["Jusqu'à 15 offres actives", "Fonctionnalités ATS avancées", "Outils de collaboration d'équipe", "Support prioritaire"],
  companyName: "Tech Solutions Inc.", addressLine1: "123 Rue de l'Innovation", city: "Paris", postalCode: "75001", country: "France", billingEmail: "billing@techsolutions.com"
};

export const mockInvoices: Invoice[] = [
  { id: "INV202407001", date: "2024-07-15", amount: "129.00€", status: "Payée", pdfLink: "#", planName: "Business", companyName: "Tech Solutions Inc.", companyAddress: "123 Rue de l'Innovation, Paris", billingEmail: "billing@techsolutions.com", dueDate: "2024-07-30", subTotal: "107.50€", taxAmount: "21.50€", totalAmount: "129.00€", paymentMethod: "Visa **** 4242" },
  { id: "INV202406001", date: "2024-06-15", amount: "129.00€", status: "Payée", pdfLink: "#", planName: "Business", companyName: "Tech Solutions Inc." },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: "pm_1", type: "Visa", last4: "4242", expiry: "12/25", isPrimary: true },
  { id: "pm_2", type: "Mastercard", last4: "5555", expiry: "06/26", isPrimary: false },
];

export const mockDashboardCompanyApplications: DashboardCompanyApplication[] = Array.from(mockCompanyCandidatesMap.values()).flatMap(candidate =>
    candidate.applications?.map(app => ({
        id: `app-dash-${candidate.id}-${app.jobId}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatarUrl: candidate.avatarUrl,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        applicationDate: app.appliedDate,
        status: app.status,
        matchScore: candidate.matchScore,
    })) || []
);

export const mockUserConversations: UserConversation[] = [
  { id: "conv-cand1-rec1", candidateId: "user-cand-001", recruiterId: "user-rec-001", userName: "Jane Smith (Recruiter)", userAvatar: mockRecruiterUser.avatarUrl, lastMessage: "Bonjour, votre profil est intéressant.", timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), unreadCount: 1, jobId: "job-dash-001", jobTitle: "Développeur Full-Stack (Dashboard)" },
  { id: "conv-cand1-rec2", candidateId: "user-cand-001", recruiterId: "user-rec-002", userName: "Recruteur WebInnov", userAvatar: "https://placehold.co/40x40.png?text=RW", lastMessage: "Avez-vous des questions sur l'offre Vue.js?", timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(), unreadCount: 0, jobId: "job-public-1", jobTitle: "Développeur Frontend Vue.js (Public)" },
];

export const mockUserMessages: Record<string, UserMessage[]> = {
  "conv-cand1-rec1": [
    { id: uuidv4(), conversationId: "conv-cand1-rec1", senderId: "user-rec-001", receiverId: "user-cand-001", senderRole: "recruiter", text: "Bonjour John, votre profil pour le poste de Développeur Full-Stack est intéressant.", timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), isRead: true },
    { id: uuidv4(), conversationId: "conv-cand1-rec1", senderId: "user-cand-001", receiverId: "user-rec-001", senderRole: "candidate", text: "Merci Jane ! Je suis très intéressé.", timestamp: new Date(Date.now() - 1*60*60*1000).toISOString(), isRead: false },
  ],
  "conv-cand1-rec2": [
      {id: uuidv4(), conversationId: "conv-cand1-rec2", senderId: "user-rec-002", receiverId: "user-cand-001", senderRole: "recruiter", text: "Bonjour John, nous avons bien reçu votre candidature pour le poste de Développeur Vue.js.", timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(), isRead: true},
  ]
};

export const mockUserNotifications: UserNotification[] = [
  { id: uuidv4(), userId: "user-cand-001", title: "Nouvelle offre correspondante", message: "L'offre 'DevOps Engineer' chez Cloud Corp pourrait vous intéresser.", timestamp: new Date().toISOString(), isRead: false, type: "new_job", link: "/jobs/some-devops-job" },
  { id: uuidv4(), userId: "user-cand-001", title: "Statut de candidature mis à jour", message: "Votre candidature pour 'Développeur Frontend Vue.js' est passée à 'CV Consulté'.", timestamp: new Date(Date.now() - 3600*1000*3).toISOString(), isRead: true, type: "application_status", link: "/user/applications" },
];

export const mockAnalyticsOverviewData: AnalyticsOverviewData = {
    kpis: [
        { title: "Offres Actives", value: "12", iconName: "Briefcase", trend: "+2 cette semaine" },
        { title: "Nvelles Candidatures", value: "34", iconName: "Users", trend: "+5 aujourd'hui" },
        { title: "Entretiens Planifiés", value: "8", iconName: "FileText", trend: "Pour cette semaine" },
        { title: "Tx. Réponse Moyen", value: "75%", iconName: "BarChart3", trend: "Amélioration de 5%" },
    ],
    candidateFlowData: [ { month: "Jan", new: 45, hired: 5 }, { month: "Fev", new: 50, hired: 7 }, { month: "Mar", new: 60, hired: 8 }, { month: "Avr", new: 55, hired: 6 }, { month: "Mai", new: 70, hired: 10 }, { month: "Juin", new: 65, hired: 9 } ],
    candidateSourcesData: [ { name: "Site Carrière", value: 450, fill: "hsl(var(--chart-1))" }, { name: "LinkedIn", value: 350, fill: "hsl(var(--chart-2))" }, { name: "Indeed", value: 280, fill: "hsl(var(--chart-3))"}, { name: "Cooptation", value: 120, fill: "hsl(var(--chart-4))"} ],
    recruitmentFunnelData: [ { value: 1200, name: 'Vues Offres', fill: 'hsl(var(--chart-1))' }, { value: 250, name: 'Candidatures', fill: 'hsl(var(--chart-2))' }, { value: 100, name: 'Présélectionnés', fill: 'hsl(var(--chart-3))'}, { value: 40, name: 'Entretiens', fill: 'hsl(var(--chart-4))'}, { value: 10, name: 'Offres', fill: 'hsl(var(--chart-5))'}, { value: 7, name: 'Embauchés', fill: 'hsl(var(--secondary))'} ],
};

export const mockCompanySettings: CompanyProfileSettings = {
    companyId: "comp-tsi-001", // Tech Solutions Inc.
    companyName: "Tech Solutions Inc. (Mock)",
    companyWebsite: "https://techsolutions.example.com",
    companyDescription: "Solutions technologiques innovantes pour entreprises modernes.",
    companyIndustry: "Technologie de l'Information",
    companyLocation: "123 Rue de l'Innovation, Paris, France",
    logoUrl: "https://placehold.co/80x80.png?text=TSI"
};
export const mockCompanyNotificationPrefs: CompanyNotificationPreferences = {
    newApplicationAlerts: true,
    candidateMessages: true,
    interviewReminders: false,
};

export const mockUserSettings: UserAccountSettings = {
    email: mockCandidateUser.email,
};
export const mockUserNotificationSettings: UserNotificationSettings = {
    jobAlerts: true,
    applicationUpdates: true,
    messageNotifications: true,
    newsletter: false,
};
export const mockUserPrivacySettings: UserPrivacySettings = {
    profileVisibility: "recruiters_only",
    searchEngineIndexing: false,
    dataSharingRecruiters: true,
};

export const mockUserPortfolioItems: PortfolioItem[] = [
    { id: "portfolio-1", title: "Application de e-commerce interactive", description: "Développement d'une plateforme e-commerce complète avec des fonctionnalités avancées de panier, de paiement et de gestion de produits, utilisant React, Node.js et Stripe.", imageUrl: "https://placehold.co/300x200.png?text=E-commerce", projectUrl: "https://example.com/ecommerce-project", tags: "React,Node.js,Stripe,E-commerce" },
    { id: "portfolio-2", title: "Blog personnel technique et design", description: "Création d'un blog personnel axé sur les nouvelles technologies et les tendances du design web, construit avec Next.js pour le SSR et MDX pour la rédaction de contenu.", imageUrl: "https://placehold.co/300x200.png?text=BlogTech", projectUrl: "https://example.com/my-blog", tags: "Next.js,MDX,TailwindCSS,Blog" },
];

export const mockUserCertifications: Certification[] = [
    { id: "cert-1", name: "AWS Certified Developer - Associate", issuingOrganization: "Amazon Web Services", issueDate: "2023-05-15", credentialId: "AWSCDA12345", credentialUrl: "https://www.credly.com/badges/xxxx" },
    { id: "cert-2", name: "Scrum Master Certified (SMC)", issuingOrganization: "Scrum Alliance", issueDate: "2022-11-20", expirationDate: "2024-11-20", credentialUrl: "https://www.scrumalliance.org/verify/yyyy" },
];

export const mockUserReferrals: Referral[] = [
    { id: "ref-1", type: "requested", contactName: "Jane Smith (Ancienne Collègue)", contactEmail: "jane.smith@example.com", status: "pending", date: "2024-07-20", jobTitle: "Développeur Full-Stack Senior", message:"Demande de recommandation pour Jane."},
    { id: "ref-2", type: "requested", contactName: "Prof. Alain Bernard", contactEmail: "alain.bernard@univ.fr", status: "completed", date: "2024-06-15", message:"Recommandation académique."},
];

const today = new Date();
export const mockDashboardInterviews: Interview[] = [
    { id: "int-dash-1", candidateId: "cand001", candidateName: mockCompanyCandidatesMap.get("cand001")!.name, candidateAvatarUrl: mockCompanyCandidatesMap.get("cand001")!.avatarUrl, jobId: "job-dash-001", jobTitle: mockJobPostings.get("job-dash-001")!.jobTitle, date: format(addMonths(today,0),"yyyy-MM-dd" ), time: "10:00", type: "Technique", interviewers: "Marc Petit, Lise Durand", status: "Planifié", notes: "Test technique à préparer. Vérifier la disponibilité de la salle virtuelle.", data: { companyId: "comp-tsi-001", companyName: "Tech Solutions Inc." } },
    { id: "int-dash-2", candidateId: "cand002", candidateName: mockCompanyCandidatesMap.get("cand002")!.name, candidateAvatarUrl: mockCompanyCandidatesMap.get("cand002")!.avatarUrl, jobId: "job-dash-001", jobTitle: mockJobPostings.get("job-dash-001")!.jobTitle, date: format(subDays(today, 2), "yyyy-MM-dd"), time: "14:30", type: "RH", interviewers: "Sophie Dubois", status: "Terminé", feedback: "Très bon profil, excellente communication. À avancer pour l'entretien technique.", data: { companyId: "comp-tsi-001", companyName: "Tech Solutions Inc." } },
    { id: "int-dash-3", candidateId: "cand003", candidateName: mockCompanyCandidatesMap.get("cand003")!.name, candidateAvatarUrl: mockCompanyCandidatesMap.get("cand003")!.avatarUrl, jobId: "job-dash-002", jobTitle: mockJobPostings.get("job-dash-002")!.jobTitle, date: format(addMonths(today,0),"yyyy-MM-dd" ), time: "16:00", type: "Manager", interviewers: "Le CEO", status: "À venir", data: { companyId: "comp-tsi-001", companyName: "Tech Solutions Inc." } },
];

export const mockUserInterviews: Interview[] = [
    { id: "int-user-1", candidateId: mockCandidateUser.id, candidateName: mockCandidateUser.fullName!, jobId: "job-public-1", jobTitle: "Développeur Frontend Vue.js", date: format(addMonths(today,0),"yyyy-MM-dd" ), time: "11:00", type: "Technique", interviewers: "Recruteur WebInnov", status: "Planifié", data: { companyName: "WebInnov"} },
];

export const initialCVData: CVData = {
  personalInfo: {
    fullName: "Marie Curie",
    professionalTitle: "Physicienne et Chimiste",
    email: "marie.curie@sorbonne.fr",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    linkedinUrl: "https://linkedin.com/in/mariecurie",
    portfolioUrl: "https://nobelprize.org/mariecurie",
    githubUrl: "",
  },
  summary: "Pionnière dans le domaine de la radioactivité, double lauréate du prix Nobel. Recherche passionnée et dévouement à la science.",
  skills: "Radioactivité, Physique Nucléaire, Chimie, Recherche Scientifique, Analyse de Données, Rayons X",
  experiences: [
    { id:uuidv4(), title: "Professeur de Physique Générale", company: "Université de Paris (Sorbonne)", dates: "1906 - 1934", description: "Enseignement et recherche en physique. Direction du laboratoire Curie à l'Institut du Radium." },
    { id:uuidv4(), title: "Chercheuse Scientifique", company: "École Municipale de Physique et de Chimie Industrielles", dates: "1894 - 1906", description: "Travaux sur le magnétisme, puis découverte du polonium et du radium avec Pierre Curie." },
  ],
  education: [
    { id:uuidv4(), degree: "Licence ès Sciences Physiques", institution: "Faculté des sciences de Paris (Sorbonne)", dates: "1893" },
    { id:uuidv4(), degree: "Licence ès Sciences Mathématiques", institution: "Faculté des sciences de Paris (Sorbonne)", dates: "1894" },
  ],
  projects: [
    { id:uuidv4(), title: "Découverte du Polonium et du Radium", description: "Isolation de ces deux nouveaux éléments radioactifs à partir de la pechblende.", dates: "1898", link: "https://fr.wikipedia.org/wiki/Découverte_du_radium_et_du_polonium" },
    { id:uuidv4(), title: "Les 'Petites Curies' - Unités de radiologie mobile", description: "Développement et déploiement d'unités de radiographie mobiles pendant la Première Guerre mondiale pour aider au diagnostic des blessés.", dates: "1914 - 1918" },
  ],
  languages: [
    { id:uuidv4(), name: "Français", level: "C1/C2 (Courant)" },
    { id:uuidv4(), name: "Polonais", level: "Langue Maternelle" },
    { id:uuidv4(), name: "Anglais", level: "Avancé" },
  ],
  interests: "Science, Recherche, Éducation, Humanitaire, Lecture",
};

export const mockCalendarEvents: CalendarEvent[] = [
    ...mockDashboardInterviews.map(i => ({
        id: `interview-${i.id}`,
        title: `Entretien: ${i.candidateName} (${i.type}) pour ${i.jobTitle}`,
        start: new Date(`${i.date.split('T')[0]}T${i.time}:00`), 
        end: new Date(new Date(`${i.date.split('T')[0]}T${i.time}:00`).getTime() + 60 * 60 * 1000), 
        type: 'interview' as CalendarEvent['type'],
        data: i
    })),
    ...mockUserInterviews.map(i => ({
        id: `interview-${i.id}`,
        title: `Mon Entretien: ${i.jobTitle} (${i.type})`,
        start: new Date(`${i.date.split('T')[0]}T${i.time}:00`),
        end: new Date(new Date(`${i.date.split('T')[0]}T${i.time}:00`).getTime() + 60 * 60 * 1000),
        type: 'interview' as CalendarEvent['type'],
        data: i
    }))
];

export const initialProfileFormData: ProfileFormData = {
  fullName: mockCandidateUser.fullName || "",
  email: mockCandidateUser.email || "",
  phone: mockCandidateUser.phone || "",
  location: mockCandidateUser.location || "",
  professionalTitle: mockCandidateUser.professionalTitle || "",
  bio: "Passionné par le développement web et les nouvelles technologies. Toujours prêt à apprendre et à relever de nouveaux défis.",
  skills: "React, TypeScript, Node.js, Next.js",
  linkedinUrl: "https://linkedin.com/in/johndoe-example",
  portfolioUrl: "https://johndoe.dev",
  githubUrl: "https://github.com/johndoe-example",
  experience1Title: "Développeur Web",
  experience1Company: "Startup Innovante",
  experience1Dates: "Jan 2022 - Présent",
  experience1Description: "- Développement de fonctionnalités front-end.\n- Participation aux sprints Agile.",
  education1Degree: "Master Informatique",
  education1Institution: "Université Exemplaire",
  education1Dates: "2020 - 2022",
};

// Added this export
export const mockCompanyInvitations: CompanyInvitation[] = [
    {id: "inv-001", companyId: "webinnov-id", companyName: "WebInnov", recipientEmail: "recruiter2@example.com", status: "pending", dateSent: "2024-07-28"},
    {id: "inv-002", companyId: "datainsights-id", companyName: "Data Insights Co.", recipientEmail: "recruiter2@example.com", status: "pending", dateSent: "2024-07-27"},
];

export const dummyJobDataForDetailsPage = mockJobPostings.get("job-dash-001");
export const dummyCompanyDataForDetailsPage = mockCompanies[0];
export const dummyTeamMemberData = mockTeamMembers[0];
export const dummyInvoiceDetails = mockInvoices[0];
export const dummyPaymentMethods = mockPaymentMethods;
    
    
