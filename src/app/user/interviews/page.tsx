
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarClock, ListFilter, Search, Eye, Loader2, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useFetchUserInterviews } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "planifié": return "bg-blue-100 text-blue-700";
    case "terminé": return "bg-green-100 text-green-700";
    case "annulé": return "bg-red-100 text-red-700";
    case "à venir": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function UserInterviewsPage() {
  const { user } = useAuthStore();
  const { data: interviews, isLoading, error } = useFetchUserInterviews(user?.id || null);
  
  // Placeholder for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filteredInterviews = interviews?.filter(interview => {
    const matchesSearch = interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (interview.data?.companyName && interview.data.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'Tous' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-64 w-full"/>
        </div>
    );
  }
  if (error) return <p className="text-destructive text-center">Erreur de chargement des entretiens: {error.message}</p>;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-2xl text-primary"><CalendarClock className="mr-3 h-7 w-7"/>Mes Entretiens</CardTitle>
            <CardDescription>Consultez vos entretiens planifiés, à venir et passés.</CardDescription>
          </div>
          {/* Placeholder for "Request Reschedule" or other actions */}
        </CardHeader>
        <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Rechercher par poste, entreprise..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut: {statusFilter} <ListFilter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {['Tous', 'Planifié', 'Terminé', 'Annulé', 'À venir'].map(s => (
                            <DropdownMenuItem key={s} onSelect={() => setStatusFilter(s)}>{s}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {filteredInterviews && filteredInterviews.length > 0 ? (
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Poste</TableHead>
                                <TableHead className="w-[200px]">Entreprise</TableHead>
                                <TableHead>Date & Heure</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInterviews.map((interview) => (
                                <TableRow key={interview.id} className="hover:bg-muted/10">
                                    <TableCell className="font-medium"><Link href={`/jobs/${interview.jobId}`} className="hover:underline text-primary">{interview.jobTitle}</Link></TableCell>
                                    <TableCell className="text-sm text-foreground/90">{interview.data?.companyName || 'N/A'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{format(new Date(interview.date), "PPP", {locale: fr})} à {interview.time}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{interview.type}</TableCell>
                                    <TableCell className="text-center"><Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(interview.status))}>{interview.status}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/user/interviews/${interview.id}`}>
                                                <Eye className="mr-2 h-4 w-4" /> Voir Détails
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
            ) : (<div className="text-center py-12 text-muted-foreground"><CalendarDays className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun entretien trouvé.</h3><p className="mt-2">Vos entretiens planifiés apparaîtront ici.</p></div>)}
        </CardContent>
         {filteredInterviews && filteredInterviews.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    