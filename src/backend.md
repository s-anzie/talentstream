
# Conception Backend pour TalentSphere SaaS de Recrutement

## 1. Introduction

Ce document décrit l'architecture backend, les endpoints API RESTful et le schéma de base de données conceptuel pour TalentSphere, une plateforme SaaS multi-tenant de gestion de recrutement pour PME. L'objectif est de fournir une API robuste, sécurisée et scalable pour supporter les fonctionnalités frontend.

**Stack Technologique Suggérée (pour rappel) :**
*   **Backend :** Node.js avec un framework comme NestJS (pour la structure et TypeScript) ou Express.js.
*   **Base de Données :** PostgreSQL (pour la flexibilité des schémas et les capacités relationnelles).
*   **Authentification :** JWT (JSON Web Tokens) avec refresh tokens.
*   **Recherche :** Elasticsearch (pour la recherche avancée sur les offres et les profils).
*   **Messagerie :** WebSockets (par exemple, avec Socket.io).

## 2. Authentification et Gestion des Utilisateurs

### Modèles de Données Associés :
*   `User` (voir section Schéma de Base de Données)

### Endpoints API :

*   **`POST /auth/register`**
    *   Description : Inscription d'un nouvel utilisateur (candidat ou recruteur initial).
    *   Requête : `fullName`, `email`, `password`, `intendedRole ('candidate' | 'recruiter')`.
    *   Réponse : `User` object (sans le mot de passe), `accessToken`, `refreshToken`.
    *   Logique : Crée un utilisateur avec un rôle (`candidate` ou `recruiter_unassociated`). Génère un `companyId` unique si `intendedRole` est `recruiter`.

*   **`POST /auth/login`**
    *   Description : Connexion d'un utilisateur existant.
    *   Requête : `email`, `password`.
    *   Réponse : `User` object (sans le mot de passe), `accessToken`, `refreshToken`.

*   **`POST /auth/refresh-token`**
    *   Description : Obtention d'un nouveau `accessToken` en utilisant un `refreshToken`.
    *   Requête : `refreshToken`.
    *   Réponse : `accessToken`.

*   **`POST /auth/logout`**
    *   Description : Déconnexion de l'utilisateur (invalide le `refreshToken` côté serveur si stocké).
    *   Requête : (Optionnel `refreshToken` pour l'invalider spécifiquement).
    *   Réponse : `200 OK`.

*   **`POST /auth/forgot-password`**
    *   Description : Déclenche l'envoi d'un email de réinitialisation de mot de passe.
    *   Requête : `email`.
    *   Réponse : `200 OK` (même si l'email n'existe pas, pour des raisons de sécurité).

*   **`POST /auth/reset-password`**
    *   Description : Réinitialise le mot de passe en utilisant un token reçu par email.
    *   Requête : `token`, `newPassword`.
    *   Réponse : `200 OK`.

*   **`GET /users/me`**
    *   Description : Récupère le profil de l'utilisateur actuellement authentifié.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `User` object.

*   **`PUT /users/me`**
    *   Description : Met à jour le profil de l'utilisateur actuellement authentifié (nom, email, mot de passe, etc.).
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `User` object partiel.
    *   Réponse : `User` object mis à jour.

## 3. Gestion des Entreprises (Tenants)

### Modèles de Données Associés :
*   `Company` (voir section Schéma de Base de Données)
*   `User` (pour la liaison recruteur-entreprise)

### Endpoints API :

*   **`POST /companies`** (ou `/auth/company-create` via le flux d'onboarding)
    *   Description : Création du profil d'une nouvelle entreprise par un utilisateur (`recruiter_unassociated`).
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `companyName`, `companyWebsite?`, `companyDescription?`, `companyIndustry?`, `companyLocation?`, `logoUrl?`. L'ID de l'entreprise est déjà associé à l'utilisateur lors de son inscription.
    *   Réponse : `Company` object complet.
    *   Logique : Met à jour les détails de l'entreprise associée au `companyId` de l'utilisateur. Change le rôle de l'utilisateur de `recruiter_unassociated` à `recruiter`.

*   **`GET /companies/my-company`** (ou `/dashboard/settings/profile` via le frontend)
    *   Description : Récupère le profil de l'entreprise de l'utilisateur recruteur authentifié.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `Company` object.

*   **`PUT /companies/my-company`** (ou `/dashboard/settings/profile` via le frontend)
    *   Description : Met à jour le profil de l'entreprise de l'utilisateur recruteur authentifié.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `Company` object partiel.
    *   Réponse : `Company` object mis à jour.

*   **`GET /companies/{companyId}`** (Public)
    *   Description : Récupère le profil public d'une entreprise.
    *   Réponse : `Company` object (avec des informations publiques).

*   **`GET /companies`** (Public)
    *   Description : Liste les entreprises publiques (avec pagination, filtres).
    *   Requête : `?page=1&limit=10&industry=tech&location=paris`.
    *   Réponse : Liste paginée de `Company` objects.

## 4. Gestion des Offres d'Emploi (ATS)

### Modèles de Données Associés :
*   `JobPosting` (voir section Schéma de Base de Données)
*   `Company`
*   `Application`

### Endpoints API (pour les recruteurs authentifiés) :

*   **`POST /dashboard/jobs`**
    *   Description : Crée une nouvelle offre d'emploi pour l'entreprise du recruteur.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `JobPostingFormData` (titre, description, compétences, etc.).
    *   Réponse : `JobPosting` object créé.

*   **`GET /dashboard/jobs`**
    *   Description : Liste toutes les offres d'emploi de l'entreprise du recruteur (avec pagination, filtres).
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `?page=1&limit=10&status=ouvert`.
    *   Réponse : Liste paginée de `JobPosting` objects.

*   **`GET /dashboard/jobs/{jobId}`**
    *   Description : Récupère les détails d'une offre d'emploi spécifique de l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `JobPosting` object.

*   **`PUT /dashboard/jobs/{jobId}`**
    *   Description : Met à jour une offre d'emploi existante.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `JobPostingFormData` partielle.
    *   Réponse : `JobPosting` object mis à jour.

*   **`DELETE /dashboard/jobs/{jobId}`** (ou PATCH pour changer le statut en "Archivé")
    *   Description : Archive ou supprime une offre d'emploi.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `200 OK` ou `204 No Content`.

*   **`GET /jobs`** (Public)
    *   Description : Liste toutes les offres d'emploi publiques (avec pagination, filtres avancés).
    *   Requête : `?page=1&limit=10&keywords=react&location=paris&contractType=CDI`.
    *   Réponse : Liste paginée de `PublicJob` objects.

*   **`GET /jobs/{jobId}`** (Public)
    *   Description : Récupère les détails publics d'une offre d'emploi.
    *   Réponse : `PublicJob` object.

## 5. Gestion des Candidats et Candidatures (ATS)

### Modèles de Données Associés :
*   `CandidateProfile` (pour la base de données de candidats de l'entreprise)
*   `Application`
*   `JobPosting`
*   `User`

### Endpoints API (pour les recruteurs authentifiés) :

*   **`GET /dashboard/jobs/{jobId}/candidates`**
    *   Description : Liste tous les candidats ayant postulé à une offre spécifique.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `?stage=entretien_rh&sortBy=matchScore`.
    *   Réponse : Liste de `CompanyCandidate` objects (profils enrichis avec données de candidature).

*   **`GET /dashboard/candidates`**
    *   Description : Accède à la base de données de tous les candidats de l'entreprise (avec filtres, recherche).
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `?skill=react&location=paris`.
    *   Réponse : Liste paginée de `CompanyCandidate` objects.

*   **`POST /dashboard/candidates`** (Ajout Manuel)
    *   Description : Ajoute manuellement un candidat à la base de données de l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `AddCandidateFormData`.
    *   Réponse : `CompanyCandidate` object créé.

*   **`GET /dashboard/candidates/{candidateId}`**
    *   Description : Récupère le profil détaillé d'un candidat spécifique de la base de l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `CompanyCandidate` object.

*   **`PUT /dashboard/candidates/{candidateId}`** (Non implémenté, mais possible)
    *   Description : Met à jour les informations d'un profil candidat (par un recruteur).
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `CompanyCandidate` partiel.
    *   Réponse : `CompanyCandidate` mis à jour.

*   **`GET /dashboard/applications`**
    *   Description : Liste toutes les candidatures reçues par l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `?jobId=xxx&status=nouveau`.
    *   Réponse : Liste paginée de `DashboardCompanyApplication` objects.

*   **`GET /dashboard/applications/{applicationId}`**
    *   Description : Récupère les détails d'une candidature spécifique.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `DashboardCompanyApplication` object.

*   **`PUT /dashboard/applications/{applicationId}/status`**
    *   Description : Met à jour le statut d'une candidature (ex: "En Examen", "Entretien RH").
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ status: string, notes?: string }`.
    *   Réponse : `Application` object mis à jour.

*   **`POST /dashboard/applications/{applicationId}/feedback`**
    *   Description : Ajoute un feedback interne à une candidature.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ text: string, rating: string, authorId: string }`.
    *   Réponse : `Feedback` object créé.

## 6. Espace Candidat

### Modèles de Données Associés :
*   `CandidateProfile`
*   `User`
*   `Application`
*   `SavedJob`
*   `PortfolioItem`
*   `Certification`
*   `Referral`

### Endpoints API (pour les candidats authentifiés) :

*   **`GET /user/profile`**
    *   Description : Récupère le profil complet du candidat connecté.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `ProfileFormData` (ou un type `CandidateProfileDetail`).

*   **`PUT /user/profile`**
    *   Description : Met à jour le profil du candidat connecté.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `ProfileFormData`.
    *   Réponse : `ProfileFormData` mise à jour.

*   **`POST /user/resume/upload`** (Probablement géré par un service de stockage de fichiers)
    *   Description : Téléverse un fichier CV.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), Fichier CV.
    *   Réponse : URL du CV stocké ou informations de succès.

*   **`GET /user/applications`**
    *   Description : Liste toutes les candidatures soumises par le candidat.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `CandidateApplication` objects.

*   **`GET /user/applications/{applicationId}`**
    *   Description : Récupère les détails d'une candidature spécifique du candidat.
    *   Réponse : `CandidateApplication` object.

*   **`GET /user/jobs-saved`**
    *   Description : Liste les offres d'emploi sauvegardées par le candidat.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `SavedJob` objects.

*   **`POST /user/jobs-saved`**
    *   Description : Sauvegarde une offre d'emploi.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ jobId: string }`.
    *   Réponse : `201 Created`.

*   **`DELETE /user/jobs-saved/{jobId}`**
    *   Description : Retire une offre des sauvegardes.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `204 No Content`.

*   **Portfolio, Certifications, Recommandations :** Endpoints CRUD similaires (GET liste, POST créer, GET détail, PUT mettre à jour, DELETE supprimer) pour chaque entité, préfixés par `/user/portfolio`, `/user/certifications`, `/user/referrals`.

## 7. Messagerie Intégrée

### Modèles de Données Associés :
*   `Conversation`
*   `Message`
*   `User`

### Endpoints API :

*   **`GET /messages/conversations`**
    *   Description : Récupère la liste des conversations de l'utilisateur connecté (candidat ou recruteur).
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `UserConversation` objects.

*   **`GET /messages/conversations/{conversationId}`**
    *   Description : Récupère les messages d'une conversation spécifique.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `?page=1&limit=20`.
    *   Réponse : Liste paginée de `UserMessage` objects.

*   **`POST /messages/conversations/{conversationId}`** (ou `/messages` si création de nouvelle conversation)
    *   Description : Envoie un message dans une conversation ou démarre une nouvelle conversation.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ receiverId: string, text: string, jobId?: string }`.
    *   Réponse : `UserMessage` object créé.
    *   Note : L'implémentation réelle utilisera probablement des WebSockets pour la communication en temps réel.

## 8. Gestion d'Équipe et Invitations (pour les recruteurs)

### Modèles de Données Associés :
*   `TeamMember` (peut être une vue ou un type dérivé de `User`)
*   `CompanyInvitation`
*   `Company`

### Endpoints API :

*   **`GET /dashboard/team`**
    *   Description : Liste les membres de l'équipe de l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `TeamMember` objects.

*   **`POST /dashboard/team/invite`**
    *   Description : Envoie une invitation à rejoindre l'équipe de l'entreprise.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ email: string, role: string }`.
    *   Réponse : `CompanyInvitation` object créé.

*   **`GET /auth/invitations`** (pour l'utilisateur qui reçoit les invitations)
    *   Description : Récupère les invitations en attente pour l'utilisateur authentifié.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `CompanyInvitation` objects.

*   **`POST /auth/invitations/{invitationId}/respond`**
    *   Description : Permet à un utilisateur d'accepter ou de refuser une invitation.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ accept: boolean }`.
    *   Réponse : Message de succès/échec. Si acceptée, met à jour le rôle et le `companyId` de l'utilisateur.

*   **`PUT /dashboard/team/{memberId}/role`** (ou permissions)
    *   Description : Met à jour le rôle ou les permissions d'un membre de l'équipe.
    *   Requête : (Header `Authorization: Bearer <accessToken>`), `{ role: string }` ou objet de permissions.
    *   Réponse : `TeamMember` object mis à jour.

*   **`DELETE /dashboard/team/{memberId}`**
    *   Description : Retire un membre de l'équipe.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `204 No Content`.


## 9. Fonctionnalités IA (Genkit Flows exposés via API)

Ces endpoints pourraient appeler directement des flux Genkit ou des services dédiés.

*   **`POST /ai/parse-resume`**
    *   Description : Analyse un CV et extrait les informations.
    *   Requête : `{ resumeDataUri: string }` (Data URI du fichier CV).
    *   Réponse : `ParseResumeOutput` (structure JSON des données extraites).

*   **`POST /ai/suggest-job-categories`**
    *   Description : Suggère des catégories d'emploi basées sur un titre et une description.
    *   Requête : `{ jobTitle: string, jobDescription: string }`.
    *   Réponse : `{ categories: string[] }`.

## 10. Notifications

### Modèles de Données Associés :
*   `Notification`

### Endpoints API :

*   **`GET /notifications`**
    *   Description : Récupère les notifications pour l'utilisateur authentifié.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : Liste de `UserNotification` objects.

*   **`POST /notifications/{notificationId}/read`**
    *   Description : Marque une notification comme lue.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `200 OK`.

*   **`POST /notifications/read-all`**
    *   Description : Marque toutes les notifications comme lues.
    *   Requête : (Header `Authorization: Bearer <accessToken>`).
    *   Réponse : `200 OK`.

## 11. Facturation et Abonnements (Simplifié)

### Modèles de Données Associés :
*   `Subscription`
*   `Invoice`
*   `PaymentMethod`

### Endpoints API (pour les recruteurs/admins) :

*   **`GET /dashboard/billing/subscription`**
    *   Description : Récupère les détails de l'abonnement actuel de l'entreprise.
    *   Réponse : `BillingInfo` object.

*   **`POST /dashboard/billing/subscription/cancel`**
    *   Description : Annule l'abonnement actuel.
    *   Réponse : Message de confirmation.

*   **`GET /dashboard/billing/invoices`**
    *   Description : Liste les factures de l'entreprise.
    *   Réponse : Liste de `Invoice` objects.

*   **`GET /dashboard/billing/invoices/{invoiceId}`**
    *   Description : Récupère les détails d'une facture spécifique.
    *   Réponse : `Invoice` object (incluant un lien vers le PDF).

*   **`GET /dashboard/billing/payment-methods`**
    *   Description : Liste les méthodes de paiement enregistrées.
    *   Réponse : Liste de `PaymentMethod` objects.

*   **`POST /dashboard/billing/payment-methods`** (intégration avec un processeur de paiement)
    *   Description : Ajoute une nouvelle méthode de paiement.
    *   Réponse : `PaymentMethod` object créé.

*   **`DELETE /dashboard/billing/payment-methods/{methodId}`**
    *   Description : Supprime une méthode de paiement.
    *   Réponse : `204 No Content`.

## 12. Schéma de Base de Données Conceptuel (PostgreSQL)

```sql
-- Table des Utilisateurs
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin', 'recruiter_unassociated')), -- recruiter_unassociated pour les nouveaux recruteurs
    avatar_url TEXT,
    professional_title VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),
    company_id UUID REFERENCES Companies(id) ON DELETE SET NULL, -- Lien vers l'entreprise pour les recruteurs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Entreprises (Tenants)
CREATE TABLE Companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    website_url TEXT,
    description TEXT,
    industry VARCHAR(255),
    location VARCHAR(255),
    logo_url TEXT,
    cover_image_url TEXT,
    founded_year CHAR(4),
    size_range VARCHAR(100), -- ex: "10-50 employés"
    -- Autres champs spécifiques à l'entreprise
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Offres d'Emploi
CREATE TABLE JobPostings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Users(id), -- Recruteur qui a posté
    title VARCHAR(255) NOT NULL,
    full_description TEXT NOT NULL,
    short_description TEXT,
    skills TEXT, -- Pourrait être une table de jointure ou un tableau de tags
    location VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100),
    job_category VARCHAR(255),
    salary_min INTEGER,
    salary_max INTEGER,
    currency VARCHAR(10) DEFAULT 'EUR',
    experience_level VARCHAR(100),
    responsibilities TEXT, -- Séparé par des sauts de ligne ou JSON
    qualifications TEXT, -- Séparé par des sauts de ligne ou JSON
    benefits TEXT, -- Séparé par des sauts de ligne ou JSON
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'closed', 'pending_approval')),
    views_count INTEGER DEFAULT 0,
    application_deadline DATE,
    date_posted TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
    -- Champs pour l'intégration avec les job boards (ex: linkedIn_job_id)
);

-- Table des Profils Candidats (informations que le candidat gère)
CREATE TABLE CandidateProfiles (
    user_id UUID PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    bio TEXT,
    resume_url TEXT, -- URL du CV principal
    linkedin_url TEXT,
    portfolio_url TEXT,
    github_url TEXT,
    -- Les compétences pourraient être une table de jointure si on veut une recherche avancée
    skills_summary TEXT, -- Version simple : liste de compétences séparées par des virgules
    profile_visibility VARCHAR(50) DEFAULT 'recruiters_only' CHECK (profile_visibility IN ('public', 'recruiters_only', 'private')),
    search_engine_indexing BOOLEAN DEFAULT FALSE,
    data_sharing_recruiters BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Expériences Professionnelles (liées à CandidateProfiles)
CREATE TABLE Experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_profile_user_id UUID NOT NULL REFERENCES CandidateProfiles(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    dates_range VARCHAR(100), -- ex: "Jan 2020 - Présent" ou "2018 - 2019"
    description TEXT,
    display_order INTEGER
);

-- Table des Formations (liées à CandidateProfiles)
CREATE TABLE Educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_profile_user_id UUID NOT NULL REFERENCES CandidateProfiles(user_id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    dates_range VARCHAR(100),
    description TEXT,
    display_order INTEGER
);

-- Table des Projets du Portfolio (liées à CandidateProfiles)
CREATE TABLE PortfolioItems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_profile_user_id UUID NOT NULL REFERENCES CandidateProfiles(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    tags TEXT, -- Séparées par des virgules
    display_order INTEGER
);

-- Table des Certifications (liées à CandidateProfiles)
CREATE TABLE Certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_profile_user_id UUID NOT NULL REFERENCES CandidateProfiles(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT
);

-- Table des Langues (liées à CandidateProfiles)
CREATE TABLE Languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_profile_user_id UUID NOT NULL REFERENCES CandidateProfiles(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Débutant', 'Intermédiaire', 'Avancé', 'C1/C2 (Courant)', 'Langue Maternelle'))
);

-- Table des Candidatures
CREATE TABLE Applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES JobPostings(id) ON DELETE CASCADE,
    candidate_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE, -- L'utilisateur candidat
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE, -- L'entreprise qui a posté l'offre
    application_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(100) NOT NULL DEFAULT 'Nouveau', -- ex: Nouveau, En Examen, Entretien RH, Offre, Rejeté
    cover_letter TEXT,
    resume_snapshot_url TEXT, -- URL vers le CV utilisé pour cette candidature spécifique
    -- 'pipeline_stage' pourrait être une FK vers une table Stages si le pipeline est dynamique
    match_score INTEGER, -- Score d'adéquation calculé par l'IA
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Notes Internes sur les Candidatures (ou candidats)
CREATE TABLE ApplicationNotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES Applications(id) ON DELETE CASCADE,
    -- OU candidate_user_id UUID REFERENCES Users(id) pour des notes générales sur un candidat
    recruiter_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE, -- L'auteur de la note
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Entretiens
CREATE TABLE Interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES Applications(id) ON DELETE CASCADE,
    job_posting_id UUID NOT NULL REFERENCES JobPostings(id) ON DELETE CASCADE,
    candidate_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    interview_date TIMESTAMPTZ NOT NULL,
    interview_type VARCHAR(100), -- ex: RH, Technique, Manager
    interviewers TEXT, -- Noms des intervenants, séparés par virgule
    status VARCHAR(50) DEFAULT 'Planifié' CHECK (status IN ('Planifié', 'Terminé', 'Annulé', 'Reporté')),
    notes TEXT, -- Instructions pour l'entretien
    feedback TEXT, -- Feedback post-entretien du recruteur
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Offres Sauvegardées par les Candidats
CREATE TABLE SavedJobs (
    candidate_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    job_posting_id UUID NOT NULL REFERENCES JobPostings(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (candidate_user_id, job_posting_id)
);

-- Table des Conversations de Messagerie
CREATE TABLE Conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Pourrait être lié à une candidature spécifique ou à un job
    application_id UUID REFERENCES Applications(id) ON DELETE SET NULL,
    job_posting_id UUID REFERENCES JobPostings(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Participants aux Conversations
CREATE TABLE ConversationParticipants (
    conversation_id UUID NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    unread_count INTEGER DEFAULT 0,
    PRIMARY KEY (conversation_id, user_id)
);

-- Table des Messages
CREATE TABLE Messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
    sender_user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE -- Peut être plus complexe avec une table de statut de lecture par participant
);

-- Table des Invitations d'Entreprise (pour rejoindre une équipe)
CREATE TABLE CompanyInvitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    role_assigned VARCHAR(50) NOT NULL, -- Rôle proposé dans l'entreprise
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    token VARCHAR(255) UNIQUE, -- Token unique pour l'invitation
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Notifications
CREATE TABLE Notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100), -- ex: 'application_status', 'new_message', 'interview_reminder'
    link_url TEXT, -- Lien vers la page pertinente
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Abonnements (Simplifié)
CREATE TABLE Subscriptions (
    company_id UUID PRIMARY KEY REFERENCES Companies(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL, -- ex: Essentiel, Business, Enterprise
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
    current_period_end_date DATE,
    -- stripe_customer_id, stripe_subscription_id pour l'intégration Stripe
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Factures (Simplifié)
CREATE TABLE Invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES Subscriptions(company_id), -- Optionnel, si lié à un abonnement
    amount_due NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    due_date DATE,
    paid_date DATE,
    invoice_pdf_url TEXT, -- Lien vers le PDF généré
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des Méthodes de Paiement (Simplifié, nécessiterait intégration Stripe/etc.)
CREATE TABLE PaymentMethods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES Companies(id) ON DELETE CASCADE,
    type VARCHAR(50), -- ex: 'card', 'sepa_debit'
    brand VARCHAR(50), -- ex: 'visa', 'mastercard'
    last4 VARCHAR(4),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    -- payment_processor_token (ex: stripe_payment_method_id)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log (Exemple simplifié)
CREATE TABLE AuditLogs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES Users(id),
    company_id UUID REFERENCES Companies(id),
    action VARCHAR(255) NOT NULL, -- ex: 'job_created', 'user_logged_in'
    details JSONB, -- Données contextuelles de l'action
    ip_address VARCHAR(50),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_jobpostings_company_id ON JobPostings(company_id);
CREATE INDEX idx_jobpostings_status ON JobPostings(status);
CREATE INDEX idx_applications_job_posting_id ON Applications(job_posting_id);
CREATE INDEX idx_applications_candidate_user_id ON Applications(candidate_user_id);
CREATE INDEX idx_messages_conversation_id ON Messages(conversation_id);
CREATE INDEX idx_users_email ON Users(email);
```

Ce document devrait fournir une base solide pour le développement de l'API et de la base de données de TalentSphere.

