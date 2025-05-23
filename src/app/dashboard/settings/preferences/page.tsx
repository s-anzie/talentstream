
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, SlidersHorizontal, Bell, Briefcase, Users, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFetchCompanyNotificationPreferences } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import type { CompanyNotificationPreferences } from '@/lib/types';
import { updateCompanyNotificationPreferences as apiUpdatePrefs } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompanyPreferencesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: initialPrefs, isLoading, error, setData: setFetchedPrefs } = useFetchCompanyNotificationPreferences(user?.companyId || null);

  const [prefs, setPrefs] = useState<Partial<CompanyNotificationPreferences>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialPrefs) {
      setPrefs(initialPrefs);
    }
  }, [initialPrefs]);

  const handleSwitchChange = (id: keyof CompanyNotificationPreferences, checked: boolean) => {
    setPrefs(prev => ({ ...prev, [id]: checked }));
  };

  const handleSavePreferences = async () => {
    if(!user?.companyId) return;
    setIsSaving(true);
    try {
        await apiUpdatePrefs(user.companyId, prefs as CompanyNotificationPreferences);
        setFetchedPrefs(prev => prev ? ({...prev, ...prefs} as CompanyNotificationPreferences) : null);
        toast({title: "Préférences Sauvegardées", description: "Vos préférences de notification ont été mises à jour."});
    } catch (e) {
        toast({title: "Erreur", description: "Impossible de sauvegarder les préférences.", variant: "destructive"});
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-64 w-full"/>
        </div>
    );
  }
  if (error) return <p className="text-destructive text-center">Erreur de chargement des préférences: {error.message}</p>;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><SlidersHorizontal className="mr-3 h-7 w-7"/>Préférences de l'Entreprise</CardTitle>
          <CardDescription>Configurez les notifications et certains workflows de recrutement pour votre entreprise.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <section>
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center"><Bell className="mr-2 h-5 w-5"/>Notifications par Email</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                        <div><Label htmlFor="newApplicationAlerts" className="font-medium">Alertes Nouvelles Candidatures</Label><p className="text-sm text-muted-foreground">Recevoir un email pour chaque nouvelle candidature reçue.</p></div>
                        <Switch id="newApplicationAlerts" checked={prefs.newApplicationAlerts || false} onCheckedChange={(c) => handleSwitchChange("newApplicationAlerts", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                        <div><Label htmlFor="candidateMessages" className="font-medium">Notifications Messages Candidats</Label><p className="text-sm text-muted-foreground">Être notifié par email des nouveaux messages de candidats.</p></div>
                        <Switch id="candidateMessages" checked={prefs.candidateMessages || false} onCheckedChange={(c) => handleSwitchChange("candidateMessages", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                        <div><Label htmlFor="interviewReminders" className="font-medium">Rappels d'Entretiens</Label><p className="text-sm text-muted-foreground">Recevoir des rappels pour les entretiens planifiés.</p></div>
                        <Switch id="interviewReminders" checked={prefs.interviewReminders || false} onCheckedChange={(c) => handleSwitchChange("interviewReminders", c)} />
                    </div>
                </div>
            </section>
             {/* Placeholder for Workflow Preferences */}
            <section>
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center"><Briefcase className="mr-2 h-5 w-5"/>Workflows de Recrutement</h3>
                <p className="text-sm text-muted-foreground"> (Section pour personnaliser les étapes du pipeline, modèles d'emails, etc. - Bientôt disponible)</p>
            </section>

        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSavePreferences} size="lg" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les Préférences
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    