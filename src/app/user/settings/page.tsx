
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Bell, Lock, ShieldAlert, Trash2, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore"; // To get user info for display
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock service, replace with actual API calls
const fetchUserSettings = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        email: "john.doe@example.com", // Fetched from user store or API
        jobAlerts: true,
        applicationUpdates: true,
        messageNotifications: false,
        newsletter: true,
        profileVisibility: "public", // public, recruiters_only, private
        searchEngineIndexing: false,
        dataSharingRecruiters: true,
    };
};

const updateUserSettings = async (userId: string, settings: any) => {
    console.log("Updating user settings for", userId, settings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};


export default function UserSettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [settingsData, setSettingsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserSettings(user.id).then(data => {
        setSettingsData(data);
        setIsLoading(false);
      });
    } else {
        setIsLoading(false);
    }
  }, [user?.id]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settingsData) return;
    setSettingsData({ ...settingsData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    if (!settingsData) return;
    setSettingsData({ ...settingsData, [id]: checked });
  };
  
  const handlePrivacyChange = (id: string, checked: boolean) => {
    if (!settingsData) return;
    setSettingsData({ ...settingsData, [id]: checked });
  };


  const handleSaveSettings = async (section: string) => {
      if (!user?.id || !settingsData) return;
      setIsSaving(true);
      try {
          // In a real app, send only relevant section data
          await updateUserSettings(user.id, settingsData);
          toast({ title: "Paramètres Sauvegardés", description: `Vos paramètres de ${section} ont été mis à jour.` });
      } catch (error) {
          toast({ title: "Erreur", description: "Impossible de sauvegarder les paramètres.", variant: "destructive" });
      }
      setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    toast({ title: "Compte Supprimé (Simulation)", description: "Votre compte a été marqué pour suppression.", variant: "destructive" });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full rounded-md mb-6" />
          <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <Card className="shadow-lg">
        <CardHeader><CardTitle className="text-2xl text-primary">Paramètres Compte</CardTitle><CardDescription>Gérez infos, notifications, confidentialité.</CardDescription></CardHeader>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="account" className="py-2.5"><UserCircle className="mr-2 h-5 w-5"/>Compte</TabsTrigger>
          <TabsTrigger value="notifications" className="py-2.5"><Bell className="mr-2 h-5 w-5"/>Notifications</TabsTrigger>
          <TabsTrigger value="security" className="py-2.5"><Lock className="mr-2 h-5 w-5"/>Sécurité</TabsTrigger>
          <TabsTrigger value="privacy" className="py-2.5"><ShieldAlert className="mr-2 h-5 w-5"/>Confidentialité</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="shadow-md">
            <CardHeader><CardTitle>Infos Compte</CardTitle><CardDescription>Modifiez email ou mot de passe.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={settingsData?.email || user?.email || ""} onChange={handleAccountChange} /><Button variant="outline" size="sm" className="mt-1">Changer Email</Button></div>
              <div className="space-y-2"><Label htmlFor="currentPassword">Mot de Passe Actuel</Label><Input id="currentPassword" type="password" placeholder="********" /></div>
              <div className="space-y-2"><Label htmlFor="newPassword">Nouveau Mot de Passe</Label><Input id="newPassword" type="password" placeholder="Nouveau mot de passe" /></div>
              <div className="space-y-2"><Label htmlFor="confirmNewPassword">Confirmer Nouveau</Label><Input id="confirmNewPassword" type="password" placeholder="Confirmez nouveau" /></div>
              <Button onClick={() => handleSaveSettings("compte")} disabled={isSaving}> {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enregistrer Compte</Button>
            </CardContent>
            <CardHeader className="border-t pt-6"><CardTitle className="text-lg text-destructive">Zone Dangereuse</CardTitle></CardHeader>
            <CardContent><AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Supprimer Compte</Button></AlertDialogTrigger>
              <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Absolument sûr(e) ?</AlertDialogTitle><AlertDialogDescription>Action irréversible. Vos données (profil, candidatures) seront perdues.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">Oui, Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog><p className="text-xs text-muted-foreground mt-2">Suppression définitive et irréversible.</p></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-md"><CardHeader><CardTitle>Préférences Notifications</CardTitle><CardDescription>Choix des notifications.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="jobAlerts" className="font-medium">Alertes Offres</Label><p className="text-sm text-muted-foreground">Emails pour nlles offres.</p></div><Switch id="jobAlerts" checked={settingsData?.jobAlerts} onCheckedChange={(c) => handleNotificationChange("jobAlerts", c)} /></div>
              <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="applicationUpdates" className="font-medium">MàJ Candidatures</Label><p className="text-sm text-muted-foreground">Notifs changements de statut.</p></div><Switch id="applicationUpdates" checked={settingsData?.applicationUpdates} onCheckedChange={(c) => handleNotificationChange("applicationUpdates", c)} /></div>
              <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="messageNotifications" className="font-medium">Notifs Messages</Label><p className="text-sm text-muted-foreground">Alerte nvx messages recruteurs.</p></div><Switch id="messageNotifications" checked={settingsData?.messageNotifications} onCheckedChange={(c) => handleNotificationChange("messageNotifications", c)} /></div>
              <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="newsletter" className="font-medium">Newsletter</Label><p className="text-sm text-muted-foreground">Conseils carrière, actus.</p></div><Switch id="newsletter" checked={settingsData?.newsletter} onCheckedChange={(c) => handleNotificationChange("newsletter", c)} /></div>
              <Button onClick={() => handleSaveSettings("notifications")} disabled={isSaving}> {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Enregistrer Notifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security"><Card className="shadow-md"><CardHeader><CardTitle>Sécurité Compte</CardTitle><CardDescription>Options de sécurité.</CardDescription></CardHeader><CardContent className="space-y-6">
            <div className="p-4 border rounded-lg"><h4 className="font-medium mb-2">Authentification à 2 Facteurs (2FA)</h4><p className="text-sm text-muted-foreground mb-3">Ajoutez une couche de sécurité.</p><Button variant="outline" disabled>Activer 2FA (Bientôt)</Button></div>
            <div className="p-4 border rounded-lg"><h4 className="font-medium mb-2">Appareils Connectés</h4><p className="text-sm text-muted-foreground mb-3">Gérez les appareils ayant accès.</p><p className="text-sm text-muted-foreground italic">Aucun appareil (Bientôt).</p><Button variant="outline" size="sm" className="mt-2" disabled>Gérer (Bientôt)</Button></div>
        </CardContent></Card></TabsContent>

        <TabsContent value="privacy"><Card className="shadow-md"><CardHeader><CardTitle>Confidentialité Profil</CardTitle><CardDescription>Contrôlez la visibilité.</CardDescription></CardHeader><CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="profileVisibilityPublic" className="font-medium">Visibilité Profil Public</Label><p className="text-sm text-muted-foreground">Qui peut voir votre profil ?</p></div>
                {/* TODO: Replace Switch with Select for more options */}
                <Switch id="profileVisibilityPublic" checked={settingsData?.profileVisibility === 'public'} onCheckedChange={(c) => handlePrivacyChange("profileVisibility", c ? 'public' : 'private')} /> <span className="text-sm ml-2">{settingsData?.profileVisibility === 'public' ? 'Public' : 'Privé (Recruteurs après postulation)'}</span>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="searchEngineIndexing" className="font-medium">Indexation Moteurs Recherche</Label><p className="text-sm text-muted-foreground">Autoriser Google & co. à indexer.</p></div><Switch id="searchEngineIndexing" checked={settingsData?.searchEngineIndexing} onCheckedChange={(c) => handlePrivacyChange("searchEngineIndexing", c)} /></div>
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="dataSharingRecruiters" className="font-medium">Partage Données Anonymisées</Label><p className="text-sm text-muted-foreground">Pour statistiques.</p></div><Switch id="dataSharingRecruiters" checked={settingsData?.dataSharingRecruiters} onCheckedChange={(c) => handlePrivacyChange("dataSharingRecruiters", c)} /></div>
            <div className="p-4 border rounded-lg"><h4 className="font-medium mb-2">Télécharger vos données</h4><p className="text-sm text-muted-foreground mb-3">Obtenez une copie de vos données.</p><Button variant="outline" disabled>Demander (Bientôt)</Button></div>
            <Button onClick={() => handleSaveSettings("confidentialité")} disabled={isSaving}> {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Sauvegarder Confidentialité</Button>
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

    