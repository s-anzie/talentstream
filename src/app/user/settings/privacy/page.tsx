
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, UserCog, Eye, SearchCheck, Share2, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchUserPrivacySettings } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import type { UserPrivacySettings } from '@/lib/types';
import { updateUserPrivacySettings as apiUpdateSettings } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserPrivacySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: initialSettings, isLoading, error, setData: setFetchedSettings } = useFetchUserPrivacySettings(user?.id || null);
  
  const [settings, setSettings] = useState<Partial<UserPrivacySettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSwitchChange = (id: keyof Pick<UserPrivacySettings, "searchEngineIndexing" | "dataSharingRecruiters">, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSelectChange = (value: UserPrivacySettings["profileVisibility"]) => {
    setSettings(prev => ({ ...prev, profileVisibility: value }));
  };

  const handleSave = async () => {
    if (!user?.id || !settings.profileVisibility) {
        toast({title: "Erreur", description: "La visibilité du profil est requise.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    try {
        await apiUpdateSettings(user.id, settings as UserPrivacySettings);
        setFetchedSettings(prev => prev ? ({...prev, ...settings} as UserPrivacySettings) : null);
        toast({title: "Paramètres de Confidentialité Sauvegardés"});
    } catch (e) {
        toast({title: "Erreur", description: "Impossible de sauvegarder.", variant: "destructive"});
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
  if (error) return <p className="text-destructive text-center">Erreur: {error.message}</p>;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/settings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><UserCog className="mr-3 h-7 w-7"/>Confidentialité de Votre Profil</CardTitle>
          <CardDescription>Contrôlez qui peut voir vos informations personnelles et comment elles sont utilisées.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Card className="p-4 border rounded-lg hover:shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <Label htmlFor="profileVisibility" className="font-medium text-lg flex items-center"><Eye className="mr-2 h-5 w-5 text-secondary"/>Visibilité de Votre Profil</Label>
                        <p className="text-sm text-muted-foreground mt-1">Choisissez qui peut voir votre profil complet (CV, expériences, etc.).</p>
                    </div>
                     <Select value={settings.profileVisibility || "recruiters_only"} onValueChange={handleSelectChange}>
                        <SelectTrigger id="profileVisibility" className="w-full sm:w-[280px] mt-2 sm:mt-0">
                            <SelectValue placeholder="Sélectionner visibilité" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public (Visible par tous, y compris les moteurs de recherche)</SelectItem>
                            <SelectItem value="recruiters_only">Recruteurs Uniquement (Visible par les recruteurs connectés)</SelectItem>
                            <SelectItem value="private">Privé (Visible uniquement par vous et les entreprises auxquelles vous postulez)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="searchEngineIndexing" className="font-medium flex items-center"><SearchCheck className="mr-2 h-5 w-5 text-secondary"/>Indexation par Moteurs de Recherche</Label><p className="text-sm text-muted-foreground">Permettre à Google, Bing, etc. d'indexer votre profil s'il est public.</p></div>
                <Switch id="searchEngineIndexing" checked={settings.searchEngineIndexing || false} onCheckedChange={(c) => handleSwitchChange("searchEngineIndexing", c)} disabled={settings.profileVisibility !== 'public'} />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="dataSharingRecruiters" className="font-medium flex items-center"><Share2 className="mr-2 h-5 w-5 text-secondary"/>Partage de Données Anonymisées</Label><p className="text-sm text-muted-foreground">Autoriser l'utilisation de vos données (anonymisées) pour des statistiques et l'amélioration de la plateforme.</p></div>
                <Switch id="dataSharingRecruiters" checked={settings.dataSharingRecruiters || false} onCheckedChange={(c) => handleSwitchChange("dataSharingRecruiters", c)} />
            </div>
             <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-2 text-blue-700">Télécharger vos données</h4>
                <p className="text-sm text-blue-600 mb-3">Vous pouvez demander une copie de toutes les données personnelles que TalentSphere détient à votre sujet.</p>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100" disabled>Demander une Archive (Bientôt)</Button>
            </div>
        </CardContent>
         <CardFooter className="border-t pt-6">
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les Préférences de Confidentialité
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    