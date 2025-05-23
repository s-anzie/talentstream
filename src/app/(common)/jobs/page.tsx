
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Clock, Search, Filter, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Données fictives pour les offres d'emploi
const dummyJobs = [
  {
    id: "1",
    title: "Développeur Full-Stack Senior",
    company: "Tech Solutions Inc.",
    logoUrl: "https://placehold.co/60x60.png",
    location: "Paris, France",
    type: "Temps plein",
    category: "Développement Web",
    postedDate: "2024-07-20",
    salary: "60k€ - 80k€",
    shortDescription: "Rejoignez une équipe dynamique pour développer des solutions web innovantes.",
    skills: ["React", "Node.js", "TypeScript", "GraphQL"],
  },
  {
    id: "2",
    title: "Chef de Projet Marketing Digital",
    company: "Innovate Hub",
    logoUrl: "https://placehold.co/60x60.png",
    location: "Lyon, France",
    type: "CDI",
    category: "Marketing",
    postedDate: "2024-07-18",
    salary: "45k€ - 55k€",
    shortDescription: "Pilotez des campagnes marketing d'envergure et contribuez à notre croissance.",
    skills: ["SEO", "SEA", "Content Marketing", "Google Analytics"],
  },
  {
    id: "3",
    title: "Designer UX/UI Junior",
    company: "Creative Minds Agency",
    logoUrl: "https://placehold.co/60x60.png",
    location: "Télétravail",
    type: "Stage",
    category: "Design",
    postedDate: "2024-07-22",
    salary: "Selon profil",
    shortDescription: "Opportunité passionnante pour un designer talentueux de façonner des expériences utilisateur exceptionnelles.",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
  },
  {
    id: "4",
    title: "Ingénieur DevOps Confirmé",
    company: "CloudNine Systems",
    logoUrl: "https://placehold.co/60x60.png",
    location: "Bordeaux, France",
    type: "Temps plein",
    category: "Infrastructure",
    postedDate: "2024-07-15",
    salary: "55k€ - 70k€",
    shortDescription: "Gérez et optimisez notre infrastructure cloud avec les dernières technologies.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
  }
];

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <section className="text-center pt-8 pb-12 md:pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Trouvez Votre Prochaine Opportunité
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Parcourez des milliers d'offres d'emploi de PME innovantes et trouvez le poste qui vous correspond.
        </p>
      </section>

      {/* Search and Filters Bar */}
      <section className="mb-10 p-6 bg-muted/50 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="keywords" className="block text-sm font-medium text-foreground/90 mb-1">Mots-clés (Titre, Compétences)</label>
            <Input id="keywords" placeholder="Ex: Développeur React, Commercial B2B..." className="bg-background"/>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground/90 mb-1">Lieu</label>
            <Input id="location" placeholder="Ex: Paris, Lyon, Télétravail..." className="bg-background"/>
          </div>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 md:mt-0 mt-4">
            <Search className="mr-2 h-5 w-5" /> Rechercher
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
           {/* Placeholder for more filters */}
            <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-background">
                    <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full-time">Temps plein</SelectItem>
                    <SelectItem value="part-time">Temps partiel</SelectItem>
                    <SelectItem value="contract">Contrat</SelectItem>
                    <SelectItem value="internship">Stage</SelectItem>
                </SelectContent>
            </Select>
             <Select>
                <SelectTrigger className="w-full md:w-[180px] bg-background">
                    <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="dev">Développement</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Vente</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" className="bg-background">
                <Filter className="mr-2 h-4 w-4" /> Plus de Filtres
            </Button>
        </div>
      </section>

      {/* Job Listings */}
      <section>
        <h2 className="text-2xl font-semibold text-primary mb-6">Offres d'Emploi Récentes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyJobs.map((job) => (
            <Card key={job.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Image src={job.logoUrl || `https://placehold.co/60x60.png?text=${job.company.substring(0,1)}`} alt={`${job.company} logo`} width={50} height={50} className="rounded-md border" data-ai-hint="company logo"/>
                        <div>
                            <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                            </CardTitle>
                            <Link href={`/companies/${job.company.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-muted-foreground hover:underline">{job.company}</Link>
                        </div>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm text-foreground/80">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" /> {job.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-primary" /> {job.type}
                  </div>
                   {job.salary && (
                    <div className="flex items-center">
                       {/* Using a simple currency icon placeholder as Lucide doesn't have a direct Euro icon */}
                       <span className="font-bold text-primary mr-2 text-lg">€</span> {job.salary}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" /> Posté le {new Date(job.postedDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/70 line-clamp-3">{job.shortDescription}</p>
                 <div className="mt-3">
                    {job.skills.slice(0,3).map(skill => (
                        <span key={skill} className="inline-block bg-accent/20 text-accent-foreground/80 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 3 && (
                         <span className="text-xs text-muted-foreground italic">+{job.skills.length - 3} autres</span>
                    )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/jobs/${job.id}`}>
                    Voir l'Offre <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {/* Pagination Placeholder */}
        <div className="mt-12 flex justify-center">
            <Button variant="outline" className="mr-2">Précédent</Button>
            <Button variant="outline">Suivant</Button>
        </div>
      </section>
    </div>
  );
}
