
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, BellRing, Briefcase, MessageSquare, CheckCircle, Newspaper, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFetchUserNotificationSettings } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import type { UserNotificationSettings } from '@/lib/types';
import { updateUserNotificationSettings as apiUpdateSettings } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserNotificationPreferencesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: initialSettings, isLoading, error, setData: setFetchedSettings } = useFetchUserNotificationSettings(user?.id || null);
  
  const [settings, setSettings] = useState<Partial<UserNotificationSettings>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleSwitchChange = (id: keyof UserNotificationSettings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
        await apiUpdateSettings(user.id, settings as UserNotificationSettings);
        setFetchedSettings(prev => prev ? ({...prev, ...settings} as UserNotificationSettings) : null);
        toast({title: "Préférences de Notification Sauvegardées"});
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
          <CardTitle className="flex items-center text-2xl text-primary"><BellRing className="mr-3 h-7 w-7"/>Préférences de Notification</CardTitle>
          <CardDescription>Choisissez comment et quand vous souhaitez être notifié par TalentSphere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="jobAlerts" className="font-medium flex items-center"><Briefcase className="mr-2 h-5 w-5 text-secondary"/>Alertes Nouvelles Offres</Label><p className="text-sm text-muted-foreground">Recevoir des emails pour les nouvelles offres correspondant à votre profil.</p></div>
                <Switch id="jobAlerts" checked={settings.jobAlerts || false} onCheckedChange={(c) => handleSwitchChange("jobAlerts", c)} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="applicationUpdates" className="font-medium flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-secondary"/>Mises à Jour des Candidatures</Label><p className="text-sm text-muted-foreground">Être notifié des changements de statut de vos candidatures.</p></div>
                <Switch id="applicationUpdates" checked={settings.applicationUpdates || false} onCheckedChange={(c) => handleSwitchChange("applicationUpdates", c)} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="messageNotifications" className="font-medium flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-secondary"/>Notifications de Messages</Label><p className="text-sm text-muted-foreground">Recevoir une alerte pour les nouveaux messages des recruteurs.</p></div>
                <Switch id="messageNotifications" checked={settings.messageNotifications || false} onCheckedChange={(c) => handleSwitchChange("messageNotifications", c)} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm">
                <div><Label htmlFor="newsletter" className="font-medium flex items-center"><Newspaper className="mr-2 h-5 w-5 text-secondary"/>Newsletter TalentSphere</Label><p className="text-sm text-muted-foreground">Conseils carrière, actualités de la plateforme et informations utiles.</p></div>
                <Switch id="newsletter" checked={settings.newsletter || false} onCheckedChange={(c) => handleSwitchChange("newsletter", c)} />
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder les Préférences
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    