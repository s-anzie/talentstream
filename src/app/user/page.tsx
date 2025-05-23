
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TrendingUp, Edit3, ListChecks, UserCircle, Briefcase, Bookmark, MessageSquare, CalendarDays, BarChart3, AlertTriangle, BadgePercent, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Dummy data for recent applications and saved jobs
const recentApplications = [
  { id: "1", title: "Développeur Full-Stack", company: "Tech Innovators", status: "En attente", date: "2024-07-25" },
  { id: "2", title: "Designer UX/UI", company: "Creative Solutions", status: "Entretien prévu", date: "2024-07-22" },
  { id: "3", title: "Chef de Projet Web", company: "Digital Masters", status: "Rejetée", date: "2024-07-20" },
];

const savedJobs = [
  { id: "j1", title: "Ingénieur Logiciel Senior", company: "Cloud Systems", location: "Paris" },
  { id: "j2", title: "Product Owner", company: "Agile Corp", location: "Lyon" },
];

const recommendedJobs = [
    { id: "r1", title: "Spécialiste Marketing Digital", company: "Growth Co.", location: "Télétravail", logo: "https://placehold.co/40x40.png", dataAiHint: "company logo" },
    { id: "r2", title: "Data Scientist Junior", company: "AI Solutions", location: "Bordeaux", logo: "https://placehold.co/40x40.png", dataAiHint: "company logo" },
];

export default function UserHomePage() {
  const profileCompletion = 75; // Example percentage

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Bienvenue, John Doe !</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Votre espace personnel pour gérer votre carrière et trouver de nouvelles opportunités.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary flex items-center">
                <UserCircle className="mr-2 h-6 w-6" />
                Mon Profil
              </CardTitle>
              <span className="text-sm font-semibold text-primary">{profileCompletion}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Complétez votre profil pour augmenter vos chances.</p>
            <Progress value={profileCompletion} className="w-full h-2" />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/user/edit-profile">
                <Edit3 className="mr-2 h-4 w-4" /> Modifier mon Profil
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* My Applications */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <Briefcase className="mr-2 h-6 w-6" />
              Mes Candidatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Suivez l'état de vos candidatures récentes.</p>
            <ul className="space-y-2 text-sm">
              {recentApplications.slice(0, 2).map(app => (
                <li key={app.id} className="flex justify-between items-center">
                  <span>{app.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${app.status === 'Entretien prévu' ? 'bg-green-100 text-green-700' : app.status === 'Rejetée' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{app.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/user/applications">
                <ListChecks className="mr-2 h-4 w-4" /> Voir Toutes les Candidatures
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Saved Jobs */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <Bookmark className="mr-2 h-6 w-6" />
              Offres Sauvegardées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Retrouvez les offres qui ont retenu votre attention.</p>
             <ul className="space-y-1 text-sm">
              {savedJobs.slice(0, 2).map(job => (
                <li key={job.id} className="text-foreground/90">{job.title} chez {job.company}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/user/jobs-saved">
                <Bookmark className="mr-2 h-4 w-4" /> Gérer mes Offres Sauvegardées
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recommended Jobs */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <TrendingUp className="mr-3 h-7 w-7" />
            Offres Recommandées Pour Vous
          </CardTitle>
          <CardDescription>Basées sur votre profil et vos activités récentes.</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendedJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-3 pb-3">
                     <Image src={job.logo} alt={`${job.company} logo`} width={40} height={40} className="rounded-md border" data-ai-hint={job.dataAiHint}/>
                    <div>
                      <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-3 border-t">
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/jobs/${job.id}`}>Voir l'offre</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="mx-auto h-12 w-12 mb-4" />
              <p>Nous n'avons pas encore de recommandations pour vous.</p>
              <p className="text-sm">Complétez votre profil et sauvegardez des offres pour améliorer les suggestions.</p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Quick Actions */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild variant="outline" size="lg" className="flex-col h-auto py-4">
            <Link href="/jobs" className="text-center">
              <TrendingUp className="mb-1 h-6 w-6" /> Explorer les Offres
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-col h-auto py-4">
            <Link href="/user/messages" className="text-center">
              <MessageSquare className="mb-1 h-6 w-6" /> Messagerie
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-col h-auto py-4">
            <Link href="#" className="text-center text-muted-foreground cursor-not-allowed"> {/* Placeholder */}
              <CalendarDays className="mb-1 h-6 w-6" /> Entretiens (Bientôt)
            </Link>
          </Button>
           <Button asChild variant="outline" size="lg" className="flex-col h-auto py-4">
            <Link href="/user/settings" className="text-center">
              <Settings2 className="mb-1 h-6 w-6" /> Paramètres
            </Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
