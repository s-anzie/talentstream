
"use client";

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, Filter, MoreHorizontal, Eye, MessageSquare, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFetchCompanyApplications } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status?: string) => { // Added optional chaining for status
  switch (status?.toLowerCase()) { // Added optional chaining for status
    case "nouveau": return "bg-blue-100 text-blue-700";
    case "en examen": return "bg-purple-100 text-purple-700";
    case "entretien rh": return "bg-orange-100 text-orange-700";
    case "entretien technique": return "bg-teal-100 text-teal-700";
    case "offre": return "bg-indigo-100 text-indigo-700";
    case "embauché": return "bg-green-100 text-green-700";
    case "rejeté": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function AllApplicationsPage() {
  const { user } = useAuthStore();
  const { data: applications, isLoading, error } = useFetchCompanyApplications(user?.companyId || null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [jobFilter, setJobFilter] = useState('Toutes les Offres');

  // In a real app, jobs would be fetched to populate the job filter dropdown
  const jobFilters = ['Toutes les Offres', 
    ...(applications ? Array.from(new Set(applications.map(app => app.jobTitle).filter(Boolean))) : []) // Ensure jobTitle is not null/undefined
  ];


  const filteredApplications = applications?.filter(app => {
    const matchesSearch = 
      (app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'Tous' || app.status === statusFilter;
    const matchesJob = jobFilter === 'Toutes les Offres' || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><ClipboardList className="mr-3 h-7 w-7" /> Toutes les Candidatures</CardTitle>
            <CardDescription>Gérez toutes les candidatures reçues pour les offres de votre entreprise.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher par candidat, offre..." className="pl-10 bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut: {statusFilter} <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {['Tous', 'Nouveau', 'En Examen', 'Entretien RH', 'Entretien Technique', 'Offre', 'Embauché', 'Rejeté'].map(s => (
                    <DropdownMenuItem key={s} onSelect={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
             <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Offre: {jobFilter} <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {jobFilters.map(jf => (
                    <DropdownMenuItem key={jf} onSelect={() => setJobFilter(jf)}>{jf}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading && (<div className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>)}
          {error && <p className="text-destructive text-center py-6">Erreur: {error.message}</p>}
          {!isLoading && !error && filteredApplications && filteredApplications.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[200px]">Candidat</TableHead><TableHead className="w-[250px]">Offre Postulée</TableHead><TableHead>Date</TableHead><TableHead className="text-center">Statut</TableHead><TableHead className="text-center">Score</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={app.candidateAvatarUrl} alt={app.candidateName} data-ai-hint="person avatar"/>
                            <AvatarFallback>{app.candidateName?.substring(0,2).toUpperCase() || "N/A"}</AvatarFallback> {/* Added fallback for name */}
                          </Avatar>
                          <Link href={`/dashboard/candidates/${app.candidateId}`} className="font-medium text-primary hover:underline">
                            {app.candidateName || "Nom Indisponible"} {/* Added fallback */}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/jobs/${app.jobId}`} className="text-sm text-foreground/90 hover:underline">
                          {app.jobTitle || "Titre Indisponible"} {/* Added fallback */}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(app.applicationDate).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(app.status))}>{app.status}</Badge></TableCell>
                      <TableCell className="text-center"><Badge variant={app.matchScore && app.matchScore > 80 ? "default" : "outline"} className={cn("text-xs font-semibold", app.matchScore && app.matchScore > 80 ? "bg-green-500 text-white" : "border-primary/50")}>{app.matchScore || 'N/A'}%</Badge></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/dashboard/applications/${app.id}`}><Eye className="mr-2 h-4 w-4" /> Voir Détails</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/dashboard/jobs/${app.jobId}/candidates?candidateId=${app.candidateId}`}><Users className="mr-2 h-4 w-4" /> Pipeline Offre</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/dashboard/candidates/${app.candidateId}`}><Users className="mr-2 h-4 w-4" /> Profil Candidat</Link></DropdownMenuItem>
                            <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Contacter</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
           {!isLoading && !error && (!filteredApplications || filteredApplications.length === 0) && (<div className="text-center py-12 text-muted-foreground"><ClipboardList className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucune candidature ne correspond à vos filtres.</h3><p className="mt-2">Essayez d'élargir votre recherche.</p></div>)}
        </CardContent>
        {!isLoading && filteredApplications && filteredApplications.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    
