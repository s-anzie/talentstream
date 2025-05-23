
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquareText, ThumbsUp, ThumbsDown, Meh, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCandidateApplicationDetails } from '@/hooks/useDataFetching'; // Hook for application details
import { Skeleton } from '@/components/ui/skeleton';

// Helper to determine icon based on rating text
const getRatingIcon = (rating?: string) => {
    switch (rating?.toLowerCase()) {
        case 'positif':
        case 'très positif':
            return <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />;
        case 'négatif':
        case 'très négatif':
            return <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />;
        case 'neutre':
            return <Meh className="h-5 w-5 text-yellow-500 mr-2" />;
        default:
            return null;
    }
};

export default function CandidateApplicationFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  // Assuming application details might contain feedback array
  const { data: application, isLoading, error } = useFetchCandidateApplicationDetails(applicationId);
  const feedbackEntries = application?.feedback || []; // Assuming feedback is an array in application data

  if (isLoading) {
     return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
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
          <CardTitle className="flex items-center text-2xl text-primary"><MessageSquareText className="mr-3 h-7 w-7"/> Feedback sur ma Candidature</CardTitle>
          <CardDescription>
            Retours des recruteurs concernant votre candidature pour l'offre <Link href={`/jobs/${application.jobId}`} className="text-secondary hover:underline font-medium">{application.jobTitle}</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackEntries.length > 0 ? (
            <div className="space-y-4">
              {feedbackEntries.map((fb, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      {getRatingIcon(fb.rating)}
                      Feedback de {fb.author || "l'équipe de recrutement"} 
                      {fb.rating && <span className="ml-2 text-sm font-normal text-muted-foreground">({fb.rating})</span>}
                    </CardTitle>
                    <CardDescription className="text-xs">{new Date(fb.date).toLocaleDateString('fr-FR', {dateStyle:'long'})}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{fb.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
                <MessageSquareText className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                <h3 className="text-xl font-semibold text-foreground">Aucun feedback disponible pour le moment.</h3>
                <p className="mt-2">Les recruteurs peuvent laisser un feedback à différentes étapes du processus.</p>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Le feedback est partagé à la discrétion de l'entreprise.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    