
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useFetchCompanyCandidateDetails } from '@/hooks/useDataFetching'; // To get candidate name and existing notes
import { useAuthStore } from '@/stores/authStore'; // To get current user for note author
import { addCandidateNote, deleteCandidateNote } from '@/lib/mock-api-services'; // Mock services
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CandidateNotesForJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();
  const jobId = params.jobId as string;
  const candidateId = params.candidateId as string;

  const { data: candidate, isLoading, error, setData: setCandidateData } = useFetchCompanyCandidateDetails(candidateId);
  
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const jobSpecificNotes = candidate?.internalNotes?.filter(note => note.jobId === jobId) || [];
  // For simplicity, we'll add job-specific notes to the general internalNotes with a jobId property

  const handleAddNote = async () => {
    if (!newNote.trim() || !currentUser || !candidate) return;
    setIsAddingNote(true);
    try {
      const addedNote = await addCandidateNote(candidate.id, {
        author: currentUser.fullName || "Recruteur",
        text: newNote,
        timestamp: new Date().toISOString(),
        jobId: jobId, // Associate note with this job
      });
      setCandidateData(prev => prev ? ({ ...prev, internalNotes: [...(prev.internalNotes || []), addedNote] }) : null);
      setNewNote("");
      toast({ title: "Note Ajoutée", description: "Votre note a été enregistrée." });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible d'ajouter la note.", variant: "destructive" });
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!candidate) return;
    try {
      await deleteCandidateNote(candidate.id, noteId);
      setCandidateData(prev => prev ? ({ ...prev, internalNotes: prev.internalNotes?.filter(n => n.id !== noteId) }) : null);
      toast({ title: "Note Supprimée", description: "La note a été supprimée." });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de supprimer la note.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au candidat
        </Button>
        <p className="text-destructive">Erreur de chargement des notes: {error?.message || "Candidat non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au candidat pour l'offre
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center"><FileText className="mr-3 h-7 w-7"/>Notes Internes pour {candidate.name}</CardTitle>
          <CardDescription>
            Notes spécifiques à la candidature pour l'offre (ID: {jobId}). Visibles uniquement par votre équipe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Textarea 
                    placeholder="Ajouter une note (contexte, feedback entretien, etc.)..." 
                    rows={4} 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mb-2"
                />
                <Button onClick={handleAddNote} disabled={isAddingNote || !newNote.trim()} className="w-full sm:w-auto">
                    {isAddingNote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <PlusCircle className="mr-2 h-4 w-4"/> Ajouter la Note
                </Button>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary">Notes Existantes:</h3>
                {jobSpecificNotes.length > 0 ? (
                    jobSpecificNotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(note => (
                        <Card key={note.id} className="bg-muted/30">
                            <CardContent className="p-4">
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.text}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-muted-foreground">
                                        Par {note.author} - {new Date(note.timestamp).toLocaleString('fr-FR', {dateStyle: 'medium', timeStyle: 'short'})}
                                    </p>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleDeleteNote(note.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                        <span className="sr-only">Supprimer note</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">Aucune note pour cette candidature pour le moment.</p>
                )}
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Les notes sont cruciales pour un suivi collaboratif.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    