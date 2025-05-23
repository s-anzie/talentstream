
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Send, User, Briefcase, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFetchCompanyApplicationDetails } from '@/hooks/useDataFetching';
import { submitApplicationFeedback } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProvideApplicationFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const applicationId = params.applicationId as string;

  const { data: application, isLoading: isLoadingApplication, error: applicationError, setData: setApplicationData } = useFetchCompanyApplicationDetails(applicationId);
  
  const [feedbackText, setFeedbackText] = useState("");
  const [overallRating, setOverallRating] = useState<string | undefined>(undefined); // e.g., 'positif', 'neutre', 'negatif'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim() || !overallRating || !application) {
        toast({title: "Champs Requis", description: "Veuillez fournir un feedback et une évaluation globale.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    try {
        await submitApplicationFeedback(applicationId, {
            text: feedbackText,
            rating: overallRating,
            // Add more structured feedback fields if needed (e.g., skills, experience ratings)
        });
        // Optimistically update or refetch if feedback is stored with the application
        setApplicationData(prev => prev ? ({ ...prev, feedback: [...(prev.feedback || []), { text: feedbackText, rating: overallRating, author: "Vous", date: new Date().toISOString() }] }) : null);
        toast({title: "Feedback Envoyé", description: "Votre retour d'information a été enregistré."});
        setFeedbackText("");
        setOverallRating(undefined);
        // router.push(`/dashboard/applications/${applicationId}`); // Or stay on page to see history
    } catch (err) {
        toast({title: "Erreur d'Envoi", description: "Impossible d'enregistrer le feedback.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoadingApplication) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (applicationError || !application) {
     return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/applications/${applicationId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails
        </Button>
        <p className="text-destructive">Erreur: {applicationError?.message || "Candidature non trouvée."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/applications/${applicationId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de la candidature
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><MessageCircle className="mr-3 h-7 w-7"/> Feedback sur la Candidature</CardTitle>
          <CardDescription>
            Fournir un retour d'information interne sur <Link href={`/dashboard/candidates/${application.candidateId}`} className="text-secondary hover:underline font-medium">{application.candidateName}</Link> pour l'offre <Link href={`/dashboard/jobs/${application.jobId}`} className="text-secondary hover:underline font-medium">{application.jobTitle}</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="overallRating" className="text-md font-medium block mb-2">Évaluation Globale</Label>
                <RadioGroup id="overallRating" value={overallRating} onValueChange={setOverallRating} className="flex flex-wrap gap-4">
                    {['Très Positif', 'Positif', 'Neutre', 'Négatif', 'Très Négatif'].map(rating => (
                        <div key={rating} className="flex items-center space-x-2">
                            <RadioGroupItem value={rating.toLowerCase().replace(' ', '_')} id={`rating-${rating.toLowerCase().replace(' ', '_')}`} />
                            <Label htmlFor={`rating-${rating.toLowerCase().replace(' ', '_')}`} className="font-normal">{rating}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            <div>
                <Label htmlFor="feedbackText" className="text-md font-medium">Commentaires Détaillés</Label>
                <Textarea 
                    id="feedbackText"
                    placeholder="Points forts, points faibles, adéquation culturelle, prochaines étapes suggérées..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={6}
                    className="mt-1"
                />
            </div>
            {/* Placeholder for structured feedback (e.g., rating skills) */}
            {/* <div className="space-y-2">
                <Label className="text-md font-medium">Évaluation des Compétences (Optionnel)</Label>
                <div className="flex items-center justify-between"><span>Compétence Technique:</span> <div><Star className="inline text-yellow-400"/> ...</div></div>
                <div className="flex items-center justify-between"><span>Communication:</span> <div><Star className="inline text-yellow-400"/> ...</div></div>
            </div> */}
            <Button onClick={handleSubmitFeedback} disabled={isSubmitting || !feedbackText.trim() || !overallRating} size="lg" className="w-full sm:w-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" /> Enregistrer le Feedback
            </Button>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Ce feedback est interne à votre équipe de recrutement et aide à la prise de décision.</p>
        </CardFooter>
      </Card>
      
      {application.feedback && application.feedback.length > 0 && (
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Historique des Feedbacks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application.feedback.map((fb, index) => (
              <div key={index} className="p-3 border rounded-md bg-muted/20">
                <p className="text-sm whitespace-pre-wrap">{fb.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Par: {fb.author} - Le: {new Date(fb.date).toLocaleDateString('fr-FR')} - Évaluation: <span className="font-medium">{fb.rating}</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    