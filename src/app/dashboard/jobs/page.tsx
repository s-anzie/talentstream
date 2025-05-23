
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, PlusCircle, Edit, Trash2, Users, Eye, MoreHorizontal, Search, Filter, CalendarDays, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFetchDashboardJobs } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDashboardJob } from "@/lib/mock-api-services";
import { useToast } from "@/hooks/use-toast";

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "ouvert": return "bg-green-100 text-green-700 hover:bg-green-200";
    case "en attente d'approbation": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    case "fermé": return "bg-red-100 text-red-700 hover:bg-red-200";
    case "brouillon": return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  }
};

export default function ManageJobsPage() {
  const { user } = useAuthStore();
  const { data: jobs, isLoading, error, refetch } = useFetchDashboardJobs(user?.companyId || null);
  const { toast } = useToast();

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!user?.companyId) return;
    if (confirm(`Êtes-vous sûr de vouloir archiver l'offre "${jobTitle}" ? Cette action est généralement réversible.`)) {
      try {
        await deleteDashboardJob(jobId); // Assumes this service updates the mock data
        toast({ title: "Offre Archivée", description: `L'offre "${jobTitle}" a été archivée.` });
        refetch?.(); // Re-fetch data to update the list
      } catch (e) {
        toast({ title: "Erreur", description: "Impossible d'archiver l'offre.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><Briefcase className="mr-3 h-7 w-7" /> Gestion des Offres</CardTitle>
            <CardDescription>Visualisez, modifiez et gérez toutes les offres de votre entreprise.</CardDescription>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto"><Link href="/dashboard/jobs/create"><PlusCircle className="mr-2 h-5 w-5" /> Publier une Offre</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher par titre, localisation..." className="pl-10 bg-background" /></div>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel><DropdownMenuSeparator />
                <DropdownMenuItem>Tous</DropdownMenuItem><DropdownMenuItem>Ouvert</DropdownMenuItem>
                <DropdownMenuItem>En attente d'approbation</DropdownMenuItem><DropdownMenuItem>Fermé</DropdownMenuItem><DropdownMenuItem>Brouillon</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="bg-background w-full md:w-auto">Plus de Filtres <Filter className="ml-2 h-4 w-4" /></Button>
          </div>

          {isLoading && (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {error && <p className="text-destructive text-center">Erreur de chargement des offres: {error.message}</p>}
          {!isLoading && !error && jobs && jobs.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Titre de l'Offre</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Date de Publication</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Candidatures</TableHead>
                    <TableHead className="text-center">Vues</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-muted/10">
                      <TableCell><Link href={`/dashboard/jobs/${job.id}`} className="font-medium text-primary hover:underline">{job.title}</Link></TableCell>
                      <TableCell className="text-sm text-muted-foreground"><div className="flex items-center"><MapPin className="mr-1.5 h-4 w-4"/> {job.location}</div></TableCell>
                      <TableCell><div className="flex items-center text-sm text-muted-foreground"><CalendarDays className="mr-1.5 h-4 w-4"/> {new Date(job.datePosted).toLocaleDateString('fr-FR')}</div></TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className={cn("text-xs font-medium", getStatusBadgeVariant(job.status))}>{job.status}</Badge></TableCell>
                      <TableCell className="text-center">{job.applicationsCount}</TableCell>
                      <TableCell className="text-center">{job.views}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/dashboard/jobs/${job.id}/candidates`}><Users className="mr-2 h-4 w-4" /> Voir les Candidats</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/dashboard/jobs/${job.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Modifier l'Offre</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/jobs/${job.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" /> Annonce Publique</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDeleteJob(job.id, job.title)}><Trash2 className="mr-2 h-4 w-4" /> Archiver l'Offre</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && !error && (!jobs || jobs.length === 0) && (
             <div className="text-center py-12"><Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" /><p className="text-xl font-semibold text-foreground">Aucune offre d'emploi publiée.</p><p className="text-muted-foreground">Cliquez sur "Publier une Nouvelle Offre".</p></div>
          )}
        </CardContent>
        {!isLoading && jobs && jobs.length > 0 && (
            <CardFooter className="justify-center border-t pt-6">
                <Button variant="outline" size="sm" className="mr-2">Précédent</Button>
                <Button variant="outline" size="sm">Suivant</Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

    