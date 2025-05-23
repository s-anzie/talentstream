
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarPlus, ListFilter, Eye, Edit, Trash2, MoreHorizontal, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFetchDashboardInterviews } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "planifié": return "bg-blue-100 text-blue-700";
    case "terminé": return "bg-green-100 text-green-700";
    case "annulé": return "bg-red-100 text-red-700";
    case "à venir": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function InterviewManagementPage() {
  const { user } = useAuthStore();
  const { data: interviews, isLoading, error } = useFetchDashboardInterviews(user?.companyId || null);
  
  // Placeholder for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filteredInterviews = interviews?.filter(interview => {
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tous' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><CalendarPlus className="mr-3 h-7 w-7"/>Gestion des Entretiens</CardTitle>
            <CardDescription>Planifiez, suivez et gérez tous les entretiens de recrutement.</CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/interviews/schedule"><CalendarPlus className="mr-2 h-4 w-4"/> Planifier un Entretien</Link>
          </Button>
        </CardHeader>
        <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Rechercher (candidat, poste...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut: {statusFilter} <ListFilter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {['Tous', 'Planifié', 'Terminé', 'Annulé', 'À venir'].map(s => (
                            <DropdownMenuItem key={s} onSelect={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Add more filters like date range, interviewer, etc. */}
            </div>

            {isLoading && (<div className="space-y-3"><Skeleton className="h-12 w-full rounded-md" /><Skeleton className="h-12 w-full rounded-md" /><Skeleton className="h-12 w-full rounded-md" /></div>)}
            {error && <p className="text-destructive text-center py-6">Erreur: {error.message}</p>}
            {!isLoading && !error && filteredInterviews && filteredInterviews.length > 0 ? (
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Candidat</TableHead>
                                <TableHead className="w-[250px]">Offre</TableHead>
                                <TableHead>Date & Heure</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInterviews.map((interview) => (
                                <TableRow key={interview.id} className="hover:bg-muted/10">
                                    <TableCell className="font-medium"><Link href={`/dashboard/candidates/${interview.candidateId}`} className="hover:underline text-primary">{interview.candidateName}</Link></TableCell>
                                    <TableCell className="text-sm text-foreground/90"><Link href={`/dashboard/jobs/${interview.jobId}`} className="hover:underline">{interview.jobTitle}</Link></TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{new Date(interview.date).toLocaleDateString('fr-FR')} à {interview.time}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{interview.type}</TableCell>
                                    <TableCell className="text-center"><Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(interview.status))}>{interview.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild><Link href={`/dashboard/interviews/${interview.id}`}><Eye className="mr-2 h-4 w-4" /> Voir Détails</Link></DropdownMenuItem>
                                                <DropdownMenuItem disabled><Edit className="mr-2 h-4 w-4" /> Modifier (Bientôt)</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" disabled><Trash2 className="mr-2 h-4 w-4" /> Annuler (Bientôt)</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
            ) : !isLoading && (<div className="text-center py-12 text-muted-foreground"><CalendarPlus className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun entretien trouvé.</h3><p className="mt-2">Planifiez de nouveaux entretiens ou ajustez vos filtres.</p></div>)}
        </CardContent>
         {!isLoading && filteredInterviews && filteredInterviews.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    