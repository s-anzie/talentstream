
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, ThumbsDown, Meh, MessageSquareText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchUserInterviewDetails } from '@/hooks/useDataFetching'; // Fetch details to get feedback
import { Skeleton } from '@/components/ui/skeleton';

const getRatingIcon = (rating?: string) // This might be a simplified rating for now
    : React.ReactElement | null => {
    switch (rating?.toLowerCase()) {
        case 'positif': return <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />;
        case 'négatif': return <ThumbsDown className="h-5 w-5 text-red-500 mr-2" />;
        case 'neutre': return <Meh className="h-5 w-5 text-yellow-500 mr-2" />;
        default: return null;
    }
};


export default function UserInterviewFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;

  const { data: interview, isLoading, error } = useFetchUserInterviewDetails(interviewId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !interview) {
     return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push(`/user/interviews/${interviewId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Détails de l'entretien non trouvés."}</p>
      </div>
    );
  }
  
  // Assuming feedback is a string or a more structured object within interview.data or interview itself
  const feedbackEntry = interview.feedback ? {
      text: interview.feedback,
      author: interview.data?.feedbackAuthor || "L'équipe de recrutement",
      date: interview.data?.feedbackDate || interview.date, // Use interview date if feedback date not specific
      rating: interview.data?.overallRating // Example rating field
  } : null;


  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push(`/user/interviews/${interviewId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de l'entretien
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><MessageSquareText className="mr-3 h-7 w-7"/>Feedback sur l'Entretien</CardTitle>
          <CardDescription>
            Retours des recruteurs concernant votre entretien pour l'offre <Link href={`/jobs/${interview.jobId}`} className="text-secondary hover:underline font-medium">{interview.jobTitle}</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackEntry ? (
            <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                    {getRatingIcon(feedbackEntry.rating)}
                    Feedback de {feedbackEntry.author}
                    {feedbackEntry.rating && <span className="ml-2 text-sm font-normal text-muted-foreground">({feedbackEntry.rating})</span>}
                </CardTitle>
                <CardDescription className="text-xs">{new Date(feedbackEntry.date).toLocaleDateString('fr-FR', {dateStyle:'long'})}</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm whitespace-pre-line">{feedbackEntry.text}</p>
                </CardContent>
            </Card>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
                <MessageSquareText className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                <h3 className="text-xl font-semibold text-foreground">Aucun feedback partagé pour cet entretien.</h3>
                <p className="mt-2">Les recruteurs peuvent choisir de ne pas partager de feedback détaillé.</p>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Ce feedback est fourni à titre indicatif. N'hésitez pas à contacter le recruteur pour plus de détails si nécessaire.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    