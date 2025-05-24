
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CalendarCheck2, ListFilter, Search, Eye, Loader2, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchCalendarEvents } from '@/hooks/useDataFetching'; // Using the same hook as calendar page
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { CalendarEvent } from '@/lib/types';

export default function CalendarEventsListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // For list view, we might fetch a broader range or all future events by default
  const defaultStartDate = startOfMonth(new Date());
  const defaultEndDate = endOfMonth(addMonths(new Date(), 3)); // Example: next 3 months
  
  const { data: events, isLoading, error } = useFetchCalendarEvents(user?.companyId || null, defaultStartDate, defaultEndDate);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.data?.candidateName && event.data.candidateName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'Tous' || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-64 w-full"/>
        </div>
    );
  }
  if (error) return <p className="text-destructive text-center">Erreur de chargement des événements: {error.message}</p>;


  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/calendar')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au calendrier
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><CalendarCheck2 className="mr-3 h-7 w-7"/>Liste des Événements</CardTitle>
          <CardDescription>Tous les entretiens et autres événements de recrutement planifiés.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Rechercher événement, candidat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Type: {typeFilter} <ListFilter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {['Tous', 'interview', 'reminder', 'meeting'].map(t => ( // Assuming these types
                            <DropdownMenuItem key={t} onSelect={() => setTypeFilter(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                 {/* Add Date Range Filter here if needed */}
            </div>

            {filteredEvents && filteredEvents.length > 0 ? (
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Titre / Description</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Heure</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((event) => (
                                <TableRow key={event.id} className="hover:bg-muted/10">
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{format(new Date(event.start), "PPP", {locale: fr})}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{format(new Date(event.start), "HH:mm", {locale: fr})} - {format(new Date(event.end), "HH:mm", {locale: fr})}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={event.data?.id ? `/dashboard/interviews/${event.data.id}` : "#"}>
                                                <Eye className="mr-2 h-4 w-4" /> Voir Détails
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 </div>
            ) : (<div className="text-center py-12 text-muted-foreground"><CalendarDays className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun événement trouvé.</h3><p className="mt-2">Planifiez des entretiens ou ajustez vos filtres.</p></div>)}
        </CardContent>
         {filteredEvents && filteredEvents.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    