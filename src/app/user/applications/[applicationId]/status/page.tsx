
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, CheckCircle, CircleDot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCandidateApplicationDetails } from '@/hooks/useDataFetching'; // Assuming this hook can fetch status history
import { Skeleton } from '@/components/ui/skeleton';

// Example status history - this would be part of the application details
const dummyStatusHistory = [
  { status: "CV Envoyé", date: "2024-07-25 10:00", notes: "Candidature initiale reçue." },
  { status: "CV Consulté", date: "2024-07-26 14:30", notes: "Votre CV a été examiné par le recruteur." },
  { status: "Entretien Planifié", date: "2024-07-27 09:15", notes: "Un entretien est prévu pour le 02/08/2024 à 10h00." },
];

export default function CandidateApplicationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  const { data: application, isLoading, error } = useFetchCandidateApplicationDetails(applicationId);
  // For now, use dummyStatusHistory. In a real app, this would come from application.statusHistory or similar.
  const statusHistory = application?.statusHistory || dummyStatusHistory; 

  if (isLoading) {
     return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !application) {
     return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push(`/user/applications/${applicationId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Détails de la candidature non trouvés."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push(`/user/applications/${applicationId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de la candidature
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><Activity className="mr-3 h-7 w-7"/> Statut de ma Candidature</CardTitle>
          <CardDescription>
            Suivez l'évolution de votre candidature pour l'offre : <Link href={`/jobs/${application.jobId}`} className="text-secondary hover:underline font-medium">{application.jobTitle}</Link> chez {application.company}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusHistory.length > 0 ? (
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:left-[0.68rem] before:w-0.5 before:bg-border">
              {statusHistory.slice().reverse().map((entry, index) => ( // Reverse to show newest first
                <div key={index} className="relative">
                  <div className="absolute -left-[0.05rem] top-1 h-6 w-6 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                    {index === 0 ? <CheckCircle className="h-4 w-4 text-primary-foreground" /> : <CircleDot className="h-3 w-3 text-primary-foreground/70" />}
                  </div>
                  <div className="ml-10 p-4 border rounded-lg bg-card shadow-sm hover:shadow-md">
                    <h4 className="font-semibold text-md text-primary">{entry.status}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{new Date(entry.date).toLocaleString('fr-FR', {dateStyle: 'full', timeStyle: 'short'})}</p>
                    {entry.notes && <p className="text-sm text-foreground/80">{entry.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Aucun historique de statut disponible pour cette candidature.</p>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Les statuts sont mis à jour par l'équipe de recrutement. Certaines mises à jour peuvent prendre du temps.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    