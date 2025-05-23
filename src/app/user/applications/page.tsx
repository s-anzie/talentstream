
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, CalendarDays, ChevronDown, Eye, Trash2, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFetchCandidateApplications } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "entretien planifié": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
    case "en attente de réponse": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    case "candidature rejetée": return "bg-red-100 text-red-700 hover:bg-red-200";
    case "cv consulté": return "bg-green-100 text-green-700 hover:bg-green-200";
    default: return "bg-gray-100 text-gray-700 hover:bg-gray-200";
  }
};

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { data: applications, isLoading, error } = useFetchCandidateApplications(user?.id || null);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Mes Candidatures</CardTitle>
          <CardDescription>Suivez l'avancement de toutes vos candidatures en un seul endroit.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Rechercher par titre ou entreprise..." className="pl-10 bg-background" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" className="bg-background">Statut <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Tous</DropdownMenuItem>
                <DropdownMenuItem>Entretien Planifié</DropdownMenuItem>
                <DropdownMenuItem>En attente</DropdownMenuItem>
                <DropdownMenuItem>Rejetée</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="bg-background"><Filter className="mr-2 h-4 w-4" /> Filtres Avancés</Button>
          </div>

          {isLoading && (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {error && <p className="text-destructive text-center">Erreur de chargement des candidatures: {error.message}</p>}
          {!isLoading && !error && applications && applications.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Poste</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Date de Candidature</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/10">
                      <TableCell>
                        <Link href={`/jobs/${app.jobId}`} className="font-medium text-primary hover:underline">{app.jobTitle}</Link>
                        <p className="text-xs text-muted-foreground">{app.location}</p>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Image src={app.companyLogo || "https://placehold.co/24x24.png"} alt={`${app.company} logo`} width={24} height={24} className="rounded-sm" data-ai-hint="company logo"/>
                        {app.company}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground"><CalendarDays className="mr-1.5 h-4 w-4"/> {new Date(app.dateApplied).toLocaleDateString('fr-FR')}</div>
                       </TableCell>
                      <TableCell><Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(app.status))}>{app.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><ChevronDown className="h-4 w-4" /><span className="sr-only">Actions</span></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/jobs/${app.jobId}`}><Eye className="mr-2 h-4 w-4" /> Voir l'offre</Link></DropdownMenuItem>
                            <DropdownMenuItem disabled><Trash2 className="mr-2 h-4 w-4" /> Retirer (Bientôt)</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && !error && (!applications || applications.length === 0) && (
            <div className="text-center py-12"><Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold">Aucune candidature pour le moment.</p>
              <p className="text-muted-foreground">Commencez par explorer les offres et postulez !</p>
              <Button asChild className="mt-6"><Link href="/jobs">Explorer les Offres</Link></Button>
            </div>
          )}
        </CardContent>
        {!isLoading && applications && applications.length > 0 && (
            <CardFooter className="justify-center border-t pt-6">
                <Button variant="outline" size="sm" className="mr-2">Précédent</Button>
                <Button variant="outline" size="sm">Suivant</Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

    