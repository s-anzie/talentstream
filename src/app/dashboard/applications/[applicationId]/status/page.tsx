
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFetchCompanyApplicationDetails } from '@/hooks/useDataFetching';
import { updateCompanyApplicationStatus } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const applicationStatuses = ["Nouveau", "En Examen", "Entretien RH", "Entretien Technique", "Test Technique", "Offre", "Embauché", "Rejeté", "En Attente Candidat", "Retiré"];

export default function ChangeApplicationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const applicationId = params.applicationId as string;

  const { data: application, isLoading: isLoadingApplication, error: applicationError, setData: setApplicationData } = useFetchCompanyApplicationDetails(applicationId);
  
  const [newStatus, setNewStatus] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setNewStatus(application.status);
    }
  }, [application]);

  const handleSaveStatus = async () => {
    if (!applicationId || !newStatus) {
      toast({ title: "Erreur", description: "Statut non sélectionné.", variant: "destructive"});
      return;
    }
    setIsSaving(true);
    try {
      await updateCompanyApplicationStatus(applicationId, newStatus, notes);
      // Optimistically update local state or refetch
      setApplicationData(prev => prev ? ({ ...prev, status: newStatus, notes: [...(prev.notes || []), {author: "Moi", text: notes, date: new Date().toISOString()}] }) : null); // Simplified notes update
      toast({ title: "Statut Mis à Jour", description: `Le statut de la candidature est maintenant : ${newStatus}` });
      router.push(`/dashboard/applications/${applicationId}`);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le statut.", variant: "destructive"});
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingApplication) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (applicationError || !application) {
    return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/applications/${applicationId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails
        </Button>
        <p className="text-destructive">Erreur: {applicationError?.message || "Candidature non trouvée"}</p>
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
          <CardTitle className="flex items-center text-2xl text-primary"><ListChecks className="mr-3 h-7 w-7"/> Changer le Statut de la Candidature</CardTitle>
          <CardDescription>
            Pour {application.candidateName} concernant l'offre {application.jobTitle}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="statusSelect" className="text-md font-medium">Nouveau Statut</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="statusSelect" className="mt-1 w-full md:w-1/2">
                        <SelectValue placeholder="Sélectionnez un statut..." />
                    </SelectTrigger>
                    <SelectContent>
                        {applicationStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="statusNotes" className="text-md font-medium">Notes Internes (Optionnel)</Label>
                <Textarea 
                    id="statusNotes"
                    placeholder="Raison du changement de statut, prochaines étapes, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="mt-1"
                />
            </div>
            <Button onClick={handleSaveStatus} disabled={isSaving || !newStatus || newStatus === application.status} size="lg" className="w-full sm:w-auto">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4"/>
                Mettre à Jour le Statut
            </Button>
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Les candidats peuvent être notifiés de certains changements de statut (configurable).</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    