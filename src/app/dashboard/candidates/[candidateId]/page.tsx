
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Linkedin,
  Github,
  Link as LinkIcon,
  Star,
  MessageSquare,
  PlusCircle, // Ensured PlusCircle is imported
  CalendarDays,
  FileText,
  Edit3,
  ArrowLeft,
  Download,
  Printer,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced Dummy Data for a single candidate profile
const dummyCandidateProfile = {
  id: "cand001",
  name: "Alice Wonderland",
  avatarUrl: "https://placehold.co/120x120.png?text=AW",
  title: "Développeuse Full-Stack Senior",
  email: "alice.wonderland@example.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  linkedin: "https://linkedin.com/in/alicewonderland",
  github: "https://github.com/alicewonderland",
  portfolio: "https://alicew.dev",
  summary: "Développeuse Full-Stack passionnée avec plus de 8 ans d'expérience dans la conception, le développement et le déploiement d'applications web scalables et performantes. Experte en React, Node.js, TypeScript et architectures microservices. J'aime résoudre des problèmes complexes et apprendre continuellement de nouvelles technologies. Je recherche un rôle stimulant où je peux contribuer à des projets innovants et collaborer avec une équipe talentueuse.",
  skills: ["React", "Node.js", "TypeScript", "GraphQL", "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB", "CI/CD", "Agile", "Scrum"],
  status: "Contacté", // e.g. Nouveau, Contacté, Entretien RH, Entretien Technique, Offre, Embauché, Rejeté
  suitabilityScore: 88, // Example
  resumeUrl: "/path/to/alice_wonderland_cv.pdf", // Placeholder
  experiences: [
    {
      id: "exp1",
      title: "Développeuse Full-Stack Senior",
      company: "Tech Solutions Inc.",
      location: "Paris, France",
      dates: "Janvier 2020 - Présent",
      description: "Leadership technique sur des projets web majeurs. Conception et implémentation d'API RESTful et GraphQL. Mentorat de développeurs juniors. Optimisation des performances et de la scalabilité des applications.",
    },
    {
      id: "exp2",
      title: "Développeuse Web Full-Stack",
      company: "Innovatech",
      location: "Lyon, France",
      dates: "Juin 2017 - Décembre 2019",
      description: "Développement de fonctionnalités front-end et back-end pour une plateforme SaaS. Participation active au cycle de vie complet du développement logiciel, de la conception aux tests et au déploiement.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Master en Ingénierie Logicielle",
      institution: "Université Paris-Saclay",
      dates: "2015 - 2017",
      description: "Spécialisation en développement web et architectures distribuées.",
    },
    {
      id: "edu2",
      degree: "Licence en Informatique",
      institution: "Université Claude Bernard Lyon 1",
      dates: "2012 - 2015",
      description: null, // Explicitly null if no description
    },
  ],
  applications: [
    { jobId: "job001", jobTitle: "Développeur Full-Stack Senior (React & Node.js)", companyId: "tech-solutions-inc", appliedDate: "2024-07-20", status: "Entretien Technique Planifié" },
    { jobId: "job005", jobTitle: "Ingénieur Logiciel Principal", companyId: "cloud-innovators", appliedDate: "2024-06-15", status: "Rejeté après entretien" },
  ],
  internalNotes: [
    { id: "note1", author: "Sophie R.", text: "Excellent profil technique, très bonne communication lors du premier entretien. Semble bien correspondre à la culture d'équipe.", timestamp: "2024-07-25 14:30" },
    { id: "note2", author: "Marc D.", text: "Vérifier les références de son expérience chez Innovatech. Le projet sur lequel elle a travaillé semble très pertinent.", timestamp: "2024-07-26 10:15" },
  ],
  interviews: [
    { id: "int1", jobTitle: "Développeur Full-Stack Senior", type: "Entretien RH", date: "2024-07-28", time: "10:00", interviewer: "Sophie R.", status: "Terminé" },
    { id: "int2", jobTitle: "Développeur Full-Stack Senior", type: "Entretien Technique", date: "2024-08-02", time: "14:00", interviewer: "Marc D., Chef d'équipe Tech", status: "Planifié" },
  ],
};

const getStatusBadgeVariant = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "contacté": return "bg-blue-100 text-blue-700";
    case "entretien rh":
    case "entretien technique":
    case "entretien rh planifié":
    case "entretien technique planifié": return "bg-orange-100 text-orange-700";
    case "offre": return "bg-indigo-100 text-indigo-700";
    case "embauché": return "bg-green-100 text-green-700";
    case "rejeté":
    case "rejeté après entretien": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function CandidateProfilePage() {
  const params = useParams();
  const candidateId = params.candidateId as string;
  const router = useRouter();

  // In a real app, fetch candidate data based on candidateId
  const candidate = dummyCandidateProfile; // Using dummy data

  if (!candidate) {
    return <div className="container mx-auto py-12 text-center">Profil candidat non trouvé.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/candidates")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Base de Candidats
      </Button>

      {/* Candidate Header */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/20">
            <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person avatar" />
            <AvatarFallback className="text-4xl">{candidate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{candidate.name}</CardTitle>
            <CardDescription className="text-lg text-foreground/80">{candidate.title}</CardDescription>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              <Badge variant="secondary" className={cn("text-sm", getStatusBadgeVariant(candidate.status))}>{candidate.status}</Badge>
              <Badge variant="outline" className="border-green-500 text-green-600">
                <Star className="mr-1.5 h-4 w-4 fill-green-500" /> Score: {candidate.suitabilityScore}%
              </Badge>
              <Badge variant="outline"><MapPin className="mr-1.5 h-4 w-4 text-muted-foreground"/> {candidate.location}</Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 mt-4 md:mt-0 shrink-0">
            <Button className="w-full md:w-auto"><MessageSquare className="mr-2 h-4 w-4"/>Contacter</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">Changer Statut <ChevronDown className="ml-2 h-4 w-4"/></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Passer à "Entretien RH"</DropdownMenuItem>
                <DropdownMenuItem>Passer à "Entretien Technique"</DropdownMenuItem>
                <DropdownMenuItem>Faire une Offre</DropdownMenuItem>
                <DropdownMenuItem>Marquer comme Embauché</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">Rejeter la Candidature</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4"/>Ajouter Note</Button>
            <Button variant="outline" className="w-full md:w-auto"><CalendarDays className="mr-2 h-4 w-4"/>Planifier Entretien</Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-6">
          <TabsTrigger value="overview"><User className="mr-1.5 h-4 w-4"/>Aperçu</TabsTrigger>
          <TabsTrigger value="resume"><FileText className="mr-1.5 h-4 w-4"/>CV/Docs</TabsTrigger>
          <TabsTrigger value="experience"><Briefcase className="mr-1.5 h-4 w-4"/>Expérience</TabsTrigger>
          <TabsTrigger value="education"><GraduationCap className="mr-1.5 h-4 w-4"/>Formation</TabsTrigger>
          <TabsTrigger value="applications"><Briefcase className="mr-1.5 h-4 w-4"/>Candidatures</TabsTrigger>
          <TabsTrigger value="notes"><MessageSquare className="mr-1.5 h-4 w-4"/>Notes & Entretiens</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-xl text-primary">Aperçu du Candidat</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-semibold mb-2 text-secondary">Résumé</h3>
                <p className="text-sm text-foreground/80 leading-relaxed">{candidate.summary}</p>
              </div>
              <Separator/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center"><Mail className="mr-2 h-4 w-4"/>Email</h4>
                  <a href={`mailto:${candidate.email}`} className="text-sm text-primary hover:underline">{candidate.email}</a>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center"><Phone className="mr-2 h-4 w-4"/>Téléphone</h4>
                  <p className="text-sm text-foreground/90">{candidate.phone || "Non fourni"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center"><Linkedin className="mr-2 h-4 w-4"/>LinkedIn</h4>
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">{candidate.linkedin}</a>
                </div>
                 <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center"><Github className="mr-2 h-4 w-4"/>GitHub</h4>
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">{candidate.github || "Non fourni"}</a>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center"><LinkIcon className="mr-2 h-4 w-4"/>Portfolio/Site Web</h4>
                  <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">{candidate.portfolio || "Non fourni"}</a>
                </div>
              </div>
              <Separator/>
              <div>
                <h3 className="text-md font-semibold mb-3 text-secondary">Compétences Clés</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-sm bg-accent/10 text-accent-foreground/90 font-medium">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resume/Documents Tab */}
        <TabsContent value="resume">
          <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl text-primary">CV et Documents</CardTitle>
                <CardDescription>Consultez ou téléchargez le CV et autres documents du candidat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 border rounded-md flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary"/>
                        <div>
                            <p className="font-medium">CV Principal - {candidate.name.replace(/\s+/g, '_')}.pdf</p>
                            <p className="text-xs text-muted-foreground">Téléversé le 20/07/2024 (simulé)</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <a href={candidate.resumeUrl} download target="_blank"><Download className="mr-2 h-4 w-4"/>Télécharger</a>
                    </Button>
                </div>
                 <p className="text-sm text-muted-foreground text-center py-4">Aucun autre document pour le moment.</p>
                 <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4"/>Demander un document (Bientôt)</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-xl text-primary">Expérience Professionnelle</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {candidate.experiences.map(exp => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-border">
                  <div className="absolute -left-[0.6rem] top-0 h-3 w-3 rounded-full bg-primary border-2 border-background"></div>
                  <h3 className="text-lg font-semibold text-foreground/90">{exp.title}</h3>
                  <p className="text-md text-secondary font-medium">{exp.company} <span className="text-xs text-muted-foreground">({exp.location})</span></p>
                  <p className="text-xs text-muted-foreground mb-2">{exp.dates}</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
              {candidate.experiences.length === 0 && <p className="text-muted-foreground">Aucune expérience professionnelle renseignée.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-xl text-primary">Formation et Diplômes</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {candidate.education.map(edu => (
                <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-border">
                   <div className="absolute -left-[0.6rem] top-0 h-3 w-3 rounded-full bg-primary border-2 border-background"></div>
                  <h3 className="text-lg font-semibold text-foreground/90">{edu.degree}</h3>
                  <p className="text-md text-secondary font-medium">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mb-2">{edu.dates}</p>
                  {edu.description && <p className="text-sm text-foreground/80">{edu.description}</p>}
                </div>
              ))}
              {candidate.education.length === 0 && <p className="text-muted-foreground">Aucune formation renseignée.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application History Tab */}
        <TabsContent value="applications">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Historique des Candidatures chez Tech Solutions Inc.</CardTitle>
                    <CardDescription>Liste des postes pour lesquels {candidate.name} a postulé au sein de votre entreprise.</CardDescription>
                </CardHeader>
                <CardContent>
                    {candidate.applications.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Poste</TableHead>
                                    <TableHead>Date de Candidature</TableHead>
                                    <TableHead>Statut Actuel</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidate.applications.map(app => (
                                    <TableRow key={app.jobId}>
                                        <TableCell className="font-medium">
                                            <Link href={`/dashboard/jobs/${app.jobId}`} className="hover:text-primary hover:underline">
                                                {app.jobTitle}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{new Date(app.appliedDate).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(getStatusBadgeVariant(app.status))}>{app.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/dashboard/jobs/${app.jobId}/candidates?candidateId=${candidate.id}`}>Voir dans le Pipeline</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-6">Aucune candidature de {candidate.name} pour votre entreprise pour le moment.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Internal Notes & Interviews Tab */}
        <TabsContent value="notes">
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-primary">Notes Internes de l'Équipe</CardTitle>
                        <CardDescription>Commentaires et mémos sur {candidate.name}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea placeholder={`Ajouter une note sur ${candidate.name}...`} rows={3} />
                        <Button size="sm">Ajouter Note</Button>
                        <Separator className="my-4"/>
                        {candidate.internalNotes.map(note => (
                            <div key={note.id} className="p-3 border rounded-md bg-muted/30">
                                <p className="text-sm text-foreground/90">{note.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">Par {note.author} - {new Date(note.timestamp).toLocaleString('fr-FR')}</p>
                            </div>
                        ))}
                        {candidate.internalNotes.length === 0 && <p className="text-sm text-muted-foreground">Aucune note interne pour ce candidat.</p>}
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-primary">Entretiens avec {candidate.name}</CardTitle>
                        <CardDescription>Suivi des entretiens planifiés et passés.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" size="sm" className="w-full"><CalendarDays className="mr-2 h-4 w-4"/>Planifier un Nouvel Entretien</Button>
                         <Separator className="my-4"/>
                        {candidate.interviews.map(interview => (
                            <Card key={interview.id} className="bg-muted/30">
                                <CardHeader className="pb-2 pt-3 px-4">
                                    <CardTitle className="text-md">{interview.type} pour {interview.jobTitle}</CardTitle>
                                    <CardDescription className="text-xs">
                                        Le {new Date(interview.date).toLocaleDateString('fr-FR')} à {interview.time} avec {interview.interviewer}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="px-4 pb-3 pt-2">
                                    <Badge variant={interview.status === "Planifié" ? "default" : "secondary"} className={cn(interview.status === "Planifié" ? "bg-blue-500 text-white" : "bg-green-100 text-green-700")}>
                                        {interview.status}
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="ml-auto text-xs">Voir détails</Button>
                                </CardFooter>
                            </Card>
                        ))}
                         {candidate.interviews.length === 0 && <p className="text-sm text-muted-foreground">Aucun entretien planifié pour ce candidat.</p>}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    