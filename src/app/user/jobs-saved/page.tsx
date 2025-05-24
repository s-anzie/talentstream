
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Search, Bookmark, ExternalLink, Trash2, Building, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFetchSavedJobs } from "@/hooks/useDataFetching"; 
import { removeSavedJob } from "@/lib/mock-api-services"; // Corrected import path
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedJobsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: savedJobs, isLoading, error, setData: setSavedJobs } = useFetchSavedJobs(user?.id || null);

  const handleUnsaveJob = async (savedJobId: string) => {
    if (!user?.id) return;
    try {
      // Call mock API to remove
      await removeSavedJob(user.id, savedJobId); 
      // Update local state optimistically or after confirmation
      setSavedJobs?.(prev => prev?.filter(job => job.id !== savedJobId) || null);
      toast({ title: "Offre Retirée", description: "L'offre a été retirée de vos sauvegardes." });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de retirer l'offre.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center"><Bookmark className="mr-3 h-7 w-7" /> Offres d'Emploi Sauvegardées</CardTitle>
          <CardDescription>Retrouvez ici toutes les opportunités que vous avez mises de côté.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8"><div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Rechercher dans vos offres sauvegardées..." className="pl-10 bg-background" />
          </div></div>

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="flex flex-col shadow-md">
                  <CardHeader><div className="flex items-center space-x-3"><Skeleton className="h-12 w-12 rounded-md" /><div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div></CardHeader>
                  <CardContent className="flex-grow space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent>
                  <CardFooter className="border-t pt-4 grid grid-cols-2 gap-2"><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /></CardFooter>
                </Card>
              ))}
            </div>
          )}
          {error && <p className="text-destructive text-center">Erreur de chargement des offres sauvegardées: {error.message}</p>}
          {!isLoading && !error && savedJobs && savedJobs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <Card key={job.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Image src={job.logoUrl || `https://placehold.co/60x60.png?text=${job.company.substring(0,1)}`} alt={`${job.company} logo`} width={50} height={50} className="rounded-md border" data-ai-hint="company logo"/>
                        <div>
                          <CardTitle className="text-lg leading-tight hover:text-primary transition-colors"><Link href={`/jobs/${job.id}`}>{job.title}</Link></CardTitle>
                          <Link href={`/companies/${job.companyId || job.company.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-muted-foreground hover:underline flex items-center"><Building className="h-3 w-3 mr-1" /> {job.company}</Link>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 text-sm">
                    <div className="flex items-center text-foreground/80"><MapPin className="h-4 w-4 mr-2 text-primary" /> {job.location}</div>
                    <div className="flex items-center text-foreground/80"><Briefcase className="h-4 w-4 mr-2 text-primary" /> {job.type}</div>
                    {job.salary && (<div className="flex items-center text-foreground/80"><span className="font-bold text-primary mr-1.5 text-base">€</span> {job.salary}</div>)}
                    <p className="mt-2 text-xs text-muted-foreground">Sauvegardé le {new Date(job.postedDate).toLocaleDateString('fr-FR')}</p>
                     <div className="pt-2">{job.skills.slice(0,3).map(skill => (<span key={skill} className="inline-block bg-accent/20 text-accent-foreground/80 text-xs font-medium mr-1.5 mb-1.5 px-2 py-0.5 rounded-full">{skill}</span>))}
                        {job.skills.length > 3 && (<span className="text-xs text-muted-foreground italic">+{job.skills.length - 3} autres</span>)}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm"><Link href={`/jobs/${job.id}`}><ExternalLink className="mr-2 h-4 w-4" /> Voir l'Offre</Link></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleUnsaveJob(job.id)}><Trash2 className="mr-2 h-4 w-4" /> Retirer</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
           {!isLoading && !error && (!savedJobs || savedJobs.length === 0) && (
            <div className="text-center py-12 text-muted-foreground"><Bookmark className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground">Aucune offre sauvegardée.</h3>
              <p className="mt-2">Cliquez sur l'icône "Sauvegarder" sur une offre pour la retrouver ici.</p>
              <Button asChild className="mt-6"><Link href="/jobs">Explorer les Offres</Link></Button>
            </div>
          )}
        </CardContent>
        {!isLoading && savedJobs && savedJobs.length > 0 && (
            <CardFooter className="justify-center border-t pt-6">
                <Button variant="outline" size="sm" className="mr-2">Précédent</Button>
                <Button variant="outline" size="sm">Suivant</Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

