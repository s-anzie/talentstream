
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileEdit, Users, CalendarDays, Clock, Briefcase, User, Info, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchDashboardInterviewDetails } from '@/hooks/useDataFetching';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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

export default function InterviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;

  const { data: interview, isLoading, error } = useFetchDashboardInterviewDetails(interviewId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/interviews')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux entretiens
        </Button>
        <p className="text-destructive">Erreur de chargement des détails: {error?.message || "Entretien non trouvé."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/interviews')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la gestion des entretiens
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div>
                <CardTitle className="text-2xl text-primary flex items-center"><CalendarDays className="mr-3 h-7 w-7"/>Détails de l'Entretien</CardTitle>
                <CardDescription>
                    ID: {interview.id.substring(0,12)}... - Statut: <Badge variant="outline" className={cn("ml-1", getStatusBadgeVariant(interview.status))}>{interview.status}</Badge>
                </CardDescription>
            </div>
            <Button variant="outline" disabled>Modifier l'Entretien (Bientôt)</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><User className="mr-2 h-5 w-5 text-muted-foreground"/>Candidat</CardTitle></CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">{interview.candidateName}</p>
                        <Button size="sm" variant="link" asChild className="p-0 h-auto"><Link href={`/dashboard/candidates/${interview.candidateId}`}>Voir profil</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-muted-foreground"/>Offre Concernée</CardTitle></CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">{interview.jobTitle}</p>
                        <Button size="sm" variant="link" asChild className="p-0 h-auto"><Link href={`/dashboard/jobs/${interview.jobId}`}>Voir l'offre</Link></Button>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-muted-foreground"/>Informations sur l'Entretien</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong className="text-muted-foreground">Date :</strong> {new Date(interview.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong className="text-muted-foreground">Heure :</strong> {interview.time}</p>
                    <p><strong className="text-muted-foreground">Type :</strong> {interview.type}</p>
                    <p><strong className="text-muted-foreground">Intervenant(s) :</strong> {interview.interviewers}</p>
                </CardContent>
            </Card>
             {interview.notes && (
                <Card className="bg-muted/30">
                    <CardHeader className="pb-2"><CardTitle className="text-lg">Notes / Instructions</CardTitle></CardHeader>
                    <CardContent><p className="text-sm whitespace-pre-wrap">{interview.notes}</p></CardContent>
                </Card>
            )}
            {interview.feedback && (
                 <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2"><CardTitle className="text-lg text-green-700">Feedback Enregistré</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-green-600 whitespace-pre-wrap">{interview.feedback}</p></CardContent>
                </Card>
            )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
            <Button asChild variant="default"><Link href={`/dashboard/interviews/${interviewId}/notes`}><FileEdit className="mr-2 h-4 w-4"/>{interview.feedback ? "Modifier" : "Ajouter"} Feedback/Notes</Link></Button>
            <Button variant="outline" asChild><Link href={`/dashboard/candidates/${interview.candidateId}/messaging?jobId=${interview.jobId}`}><MessageSquare className="mr-2 h-4 w-4"/>Contacter Candidat</Link></Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" disabled>Annuler l'Entretien (Bientôt)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    