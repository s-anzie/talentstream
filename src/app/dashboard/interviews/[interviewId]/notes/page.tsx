
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardEdit, Save, Loader2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFetchDashboardInterviewDetails } from '@/hooks/useDataFetching';
import { updateDashboardInterviewNotes } from '@/lib/mock-api-services'; // New service function
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/authStore';

export default function InterviewNotesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();
  const interviewId = params.interviewId as string;

  const { data: interview, isLoading, error, setData: setInterviewData } = useFetchDashboardInterviewDetails(interviewId);
  
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (interview?.notes) {
      setNotes(interview.notes);
    }
    if (interview?.feedback && !interview.notes) { // If feedback exists but no notes, prefill notes with feedback for editing
        setNotes(interview.feedback);
    }
  }, [interview]);

  const handleSaveNotes = async () => {
    if (!interviewId) return;
    setIsSaving(true);
    try {
      const updatedInterview = await updateDashboardInterviewNotes(interviewId, notes);
      if(updatedInterview) {
        setInterviewData(updatedInterview); // Optimistic update
        toast({ title: "Notes d'Entretien Mises à Jour", description: "Vos notes ont été sauvegardées." });
        // Potentially redirect or just show success
      } else {
        throw new Error("L'entretien n'a pas été trouvé pour la mise à jour.");
      }
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder les notes.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/interviews/${interviewId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails
        </Button>
        <p className="text-destructive">Erreur de chargement des notes: {error?.message || "Entretien non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/interviews/${interviewId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de l'entretien
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><ClipboardEdit className="mr-3 h-7 w-7"/>Notes et Feedback d'Entretien</CardTitle>
          <CardDescription>
            Pour l'entretien avec {interview.candidateName} (Offre: {interview.jobTitle}).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="interviewNotes" className="text-md font-medium block mb-2">Vos Notes / Feedback :</Label>
                <Textarea 
                    id="interviewNotes"
                    placeholder="Entrez ici vos observations, questions, évaluation des compétences, adéquation culturelle, prochaines étapes recommandées, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={10}
                    className="mt-1"
                />
            </div>
             {/* Placeholder for structured feedback if needed in future */}
             {/* 
             <div className="space-y-2">
                <Label className="text-md font-medium">Grille d'évaluation (Exemple)</Label>
                 <div className="flex items-center gap-2"><span>Compétence Technique:</span> <Rating value={3}/></div>
            </div>
             */}
            <Button onClick={handleSaveNotes} disabled={isSaving} size="lg" className="w-full sm:w-auto">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4"/>
                Enregistrer les Notes
            </Button>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Ces notes sont cruciales pour une évaluation objective et un processus de recrutement collaboratif.</p>
        </CardFooter>
      </Card>
       {interview.feedback && interview.feedback !== notes && ( // Show previous feedback if different from current notes
          <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2"><CardTitle className="text-md text-blue-700 flex items-center"><FileText className="mr-2 h-5 w-5"/>Feedback Précédemment Enregistré</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-blue-600 whitespace-pre-wrap">{interview.feedback}</p></CardContent>
          </Card>
      )}
    </div>
  );
}
    