
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, CalendarDays, DollarSign, ExternalLink, Globe, MapPin, Users, Share2, Bookmark, AlertTriangle, ArrowLeft, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Dummy data for a single job posting - in a real app, this would be fetched based on jobId
const dummyJob = {
  id: "developpeur-full-stack-senior",
  title: "Développeur Full-Stack Senior",
  company: {
    id: "tech-solutions-inc",
    name: "Tech Solutions Inc.",
    logoUrl: "https://placehold.co/80x80.png",
    description: "Leader dans les solutions logicielles innovantes pour entreprises.",
    website: "https://techsolutions.example.com",
  },
  location: "Paris, France (Hybride)",
  type: "Temps plein",
  category: "Développement Web",
  postedDate: "2024-07-20",
  salaryMin: 60000,
  salaryMax: 80000,
  experienceLevel: "Senior (5+ ans)",
  shortDescription: "Rejoignez une équipe dynamique pour développer des solutions web innovantes en utilisant les dernières technologies.",
  fullDescription: "<p>Nous recherchons un Développeur Full-Stack Senior passionné et expérimenté pour rejoindre notre équipe en pleine croissance. Vous serez responsable de la conception, du développement et de la maintenance de nos applications web SaaS. Ce rôle clé implique de travailler en étroite collaboration avec les équipes produit, design et autres développeurs pour livrer des fonctionnalités de haute qualité.</p><p>Si vous êtes un problem-solver créatif, avec un solide bagage technique et une passion pour l'innovation, nous aimerions vous connaître !</p>",
  responsibilities: [
    "Concevoir, développer et déployer des applications web full-stack.",
    "Écrire du code propre, maintenable et testé (React, Node.js, TypeScript).",
    "Collaborer avec les chefs de produit et les designers pour traduire les maquettes en fonctionnalités.",
    "Participer aux revues de code et au mentorat des développeurs juniors.",
    "Optimiser les applications pour la performance et la scalabilité.",
    "Contribuer à l'amélioration continue de nos processus de développement.",
  ],
  qualifications: [
    "Diplôme en informatique ou expérience équivalente.",
    "Minimum 5 ans d'expérience en développement full-stack.",
    "Maîtrise de React, Node.js, et TypeScript.",
    "Expérience avec les bases de données (PostgreSQL, MongoDB).",
    "Connaissance des architectures microservices et des services cloud (AWS, Azure).",
    "Excellentes compétences en communication et en travail d'équipe.",
    "Capacité à travailler dans un environnement agile.",
  ],
  benefits: [
    "Salaire compétitif et avantages sociaux attractifs.",
    "Opportunités de développement professionnel et de formation continue.",
    "Environnement de travail flexible (hybride).",
    "Culture d'entreprise collaborative et innovante.",
    "Projets stimulants et impactants.",
    "Équipement moderne et performant.",
  ],
  skills: ["React", "Node.js", "TypeScript", "GraphQL", "Docker", "AWS", "PostgreSQL"],
  applicationDeadline: "2024-08-31",
};

const relatedJobs = [
  { id: "job-react-expert", title: "Expert React Frontend", company: "WebInnov", location: "Lyon", logoUrl: "https://placehold.co/40x40.png", dataAiHint: "company logo" },
  { id: "job-nodejs-backend", title: "Développeur Backend Node.js", company: "DataSystems", location: "Télétravail", logoUrl: "https://placehold.co/40x40.png", dataAiHint: "company logo" },
  { id: "job-lead-dev", title: "Lead Developer Full-Stack", company: "Tech Leaders", location: "Paris", logoUrl: "https://placehold.co/40x40.png", dataAiHint: "company logo" },
];


export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  // In a real app, fetch job data based on params.jobId
  const job = dummyJob; // Using React.use(params) is preferred in Server Components if params is a promise

  if (!job) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Offre d'emploi non trouvée</h1>
        <p className="text-muted-foreground">Désolé, l'offre que vous recherchez n'existe pas ou a été retirée.</p>
        <Button asChild className="mt-6">
          <Link href="/jobs">Retour aux offres</Link>
        </Button>
      </div>
    );
  }

  const salaryDisplay = job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}k€ - ${job.salaryMax/1000}k€ par an` : "Selon profil";

  return (
    <div className="bg-muted/20 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Offres</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent-foreground/80">{job.category}</Badge>
                        <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{job.title}</CardTitle>
                        <div className="flex items-center text-lg text-muted-foreground mt-1">
                            <Link href={`/companies/${job.company.id}`} className="hover:text-primary hover:underline flex items-center">
                                <Building className="mr-1.5 h-5 w-5"/>{job.company.name}
                            </Link>
                        </div>
                    </div>
                    <Avatar className="h-16 w-16 border hidden sm:flex">
                        <AvatarImage src={job.company.logoUrl} alt={`${job.company.name} logo`} data-ai-hint="company logo" />
                        <AvatarFallback>{job.company.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="mt-4 space-y-2 text-sm text-foreground/80">
                  <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-secondary" /> {job.location}</div>
                  <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-secondary" /> {job.type}</div>
                  <div className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-secondary" /> {salaryDisplay}</div>
                  <div className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-secondary" /> Posté le: {new Date(job.postedDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  {job.applicationDeadline && <div className="flex items-center text-destructive/80"><CalendarDays className="h-4 w-4 mr-2" /> Candidater avant le: {new Date(job.applicationDeadline).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
                </div>
              </CardHeader>
              <CardContent className="py-8">
                <section id="description" className="mb-8">
                  <h2 className="text-2xl font-semibold text-primary mb-3">Description du Poste</h2>
                  <div className="prose prose-lg max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: job.fullDescription }} />
                </section>

                <Separator className="my-8" />

                <section id="responsibilities" className="mb-8">
                  <h2 className="text-2xl font-semibold text-primary mb-3">Responsabilités</h2>
                  <ul className="list-disc list-inside space-y-2 text-foreground/90">
                    {job.responsibilities.map((resp, index) => <li key={index}>{resp}</li>)}
                  </ul>
                </section>

                <Separator className="my-8" />

                <section id="qualifications" className="mb-8">
                  <h2 className="text-2xl font-semibold text-primary mb-3">Qualifications Requises</h2>
                  <ul className="list-disc list-inside space-y-2 text-foreground/90">
                    {job.qualifications.map((qual, index) => <li key={index}>{qual}</li>)}
                  </ul>
                </section>
                
                {job.benefits && job.benefits.length > 0 && (
                  <>
                    <Separator className="my-8" />
                    <section id="benefits" className="mb-8">
                      <h2 className="text-2xl font-semibold text-primary mb-3">Avantages</h2>
                      <ul className="list-disc list-inside space-y-2 text-foreground/90">
                        {job.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
                      </ul>
                    </section>
                  </>
                )}

                <Separator className="my-8" />
                
                <section id="skills" className="mb-8">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Compétences Clés</h2>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-sm bg-accent/10 text-accent-foreground/80 hover:bg-accent/20">{skill}</Badge>
                        ))}
                    </div>
                </section>

              </CardContent>
              <CardFooter className="border-t py-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild>
                  <Link href={`/jobs/${job.id}/apply`}>Postuler Maintenant</Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Sauvegarder l'offre">
                        <Bookmark className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Partager l'offre">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar - Company Info & Related Jobs */}
          <aside className="lg:col-span-1 space-y-8">
            <Card className="shadow-md">
              <CardHeader className="items-center text-center border-b pb-4">
                 <Link href={`/companies/${job.company.id}`} className="block">
                    <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-primary/20">
                        <AvatarImage src={job.company.logoUrl} alt={job.company.name} data-ai-hint="company logo" />
                        <AvatarFallback>{job.company.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-primary hover:underline">{job.company.name}</CardTitle>
                 </Link>
                 {job.company.website && (
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:underline flex items-center justify-center mt-1">
                        <Globe className="h-3 w-3 mr-1"/> Visiter le site web
                    </a>
                 )}
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/80 line-clamp-4">{job.company.description}</p>
                <Button variant="secondary" size="sm" className="w-full mt-4" asChild>
                  <Link href={`/companies/${job.company.id}`}>Voir le Profil Complet</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Offres Similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedJobs.map(related => (
                  <Link key={related.id} href={`/jobs/${related.id}`} className="group block p-3 hover:bg-muted/50 rounded-md transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={related.logoUrl} alt={`${related.company} logo`} data-ai-hint={related.dataAiHint}/>
                            <AvatarFallback>{related.company.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold text-foreground group-hover:text-primary line-clamp-2">{related.title}</p>
                            <p className="text-xs text-muted-foreground">{related.company} - {related.location}</p>
                        </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/jobs?category=developpement-web">Plus d'offres en Développement Web</Link>
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

    