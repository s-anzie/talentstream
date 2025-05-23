
"use client";

import { Settings, Building, Users, Bell, ShieldCheck, Puzzle, Palette, Trash2, PlusCircle, Users2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore"; // To get company info for display
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
// Assume a type for company settings if not already in types.ts
interface CompanySettingsData {
    companyName: string;
    companyWebsite: string;
    companyDescription: string;
    companyIndustry: string;
    companyLocation: string;
    logoUrl?: string;
}

// Mock service to fetch and update company settings
const fetchCompanySettings = async (companyId: string): Promise<CompanySettingsData | null> => {
    console.log("Fetching settings for company", companyId);
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, fetch from your backend
    return {
        companyName: "Tech Solutions Inc. (Mock)",
        companyWebsite: "https://techsolutions.example.com",
        companyDescription: "Solutions technologiques innovantes (Mock).",
        companyIndustry: "Technologie de l'Information (Mock)",
        companyLocation: "123 Rue de l'Innovation, Paris (Mock)",
        logoUrl: "https://placehold.co/80x80.png?text=LOGO"
    };
};
const updateCompanySettings = async (companyId: string, data: Partial<CompanySettingsData>): Promise<{success: boolean}> => {
    console.log("Updating settings for company", companyId, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
};


export default function CompanySettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<CompanySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanySettings(user.companyId).then(data => {
        setSettings(data);
        setIsLoading(false);
      });
    } else {
        setIsLoading(false); // No company ID, nothing to load
    }
  }, [user?.companyId]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    if (!user?.companyId || !settings) return;
    setIsSaving(true);
    try {
        await updateCompanySettings(user.companyId, settings);
        toast({ title: "Profil Entreprise Sauvegardé", description: "Vos informations ont été mises à jour." });
    } catch (error) {
        toast({ title: "Erreur", description: "Impossible de sauvegarder le profil.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    toast({ title: "Compte Supprimé (Simulation)", description: "Le compte a été marqué pour suppression.", variant: "destructive" });
  };

  if (isLoading) {
      return (
        <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full rounded-md mb-6" />
            <Skeleton className="h-96 w-full" />
        </div>
      );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader><CardTitle className="text-2xl text-primary flex items-center"><Settings className="mr-3 h-7 w-7" /> Paramètres Entreprise</CardTitle><CardDescription>Gérez infos entreprise, équipe, intégrations.</CardDescription></CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
          <TabsTrigger value="profile" className="py-2.5"><Building className="mr-2 h-5 w-5"/>Profil</TabsTrigger>
          <TabsTrigger value="team" className="py-2.5"><Users2 className="mr-2 h-5 w-5"/>Équipe</TabsTrigger>
          <TabsTrigger value="notifications" className="py-2.5"><Bell className="mr-2 h-5 w-5"/>Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="py-2.5"><Puzzle className="mr-2 h-5 w-5"/>Intégrations</TabsTrigger>
          <TabsTrigger value="advanced" className="py-2.5"><ShieldCheck className="mr-2 h-5 w-5"/>Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-md">
            <CardHeader><CardTitle>Profil Entreprise</CardTitle><CardDescription>Infos publiques de votre entreprise.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20"><AvatarImage src={settings?.logoUrl} alt="Logo" data-ai-hint="company logo abstract"/><AvatarFallback>{settings?.companyName?.substring(0,2) || "TE"}</AvatarFallback></Avatar>
                <div className="space-y-1.5"><Label htmlFor="logoUpload">Changer logo (PNG, JPG - Max 2MB)</Label><Input id="logoUpload" type="file" accept="image/png, image/jpeg" className="border-dashed border-primary/50" disabled /><p className="text-xs text-muted-foreground">Téléversement bientôt.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="companyName">Nom Entreprise</Label><Input id="companyName" name="companyName" value={settings?.companyName || ""} onChange={handleProfileChange} /></div>
                <div><Label htmlFor="companyWebsite">Site Web</Label><Input id="companyWebsite" name="companyWebsite" type="url" value={settings?.companyWebsite || ""} onChange={handleProfileChange} /></div>
              </div>
              <div><Label htmlFor="companyDescription">Description</Label><Textarea id="companyDescription" name="companyDescription" rows={4} value={settings?.companyDescription || ""} onChange={handleProfileChange} /></div>
              <div><Label htmlFor="companyIndustry">Secteur</Label><Input id="companyIndustry" name="companyIndustry" value={settings?.companyIndustry || ""} onChange={handleProfileChange} /></div>
              <div><Label htmlFor="companyLocation">Localisation</Label><Input id="companyLocation" name="companyLocation" value={settings?.companyLocation || ""} onChange={handleProfileChange} /></div>
              <Button onClick={handleProfileSave} className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isSaving ? "Sauvegarde..." : "Sauvegarder Profil"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team"><Card className="shadow-md"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Gestion Équipe</CardTitle><CardDescription>Ajoutez ou gérez les membres.</CardDescription></div><Button variant="default" asChild className="bg-primary hover:bg-primary/90"><Link href="/dashboard/team/invite"><PlusCircle className="mr-2 h-4 w-4" /> Inviter</Link></Button></CardHeader><CardContent><div className="text-center text-muted-foreground"><p className="mb-2">La gestion se fait sur la page dédiée.</p><Button variant="secondary" asChild><Link href="/dashboard/team">Gestion Équipe</Link></Button></div></CardContent></Card></TabsContent>
        <TabsContent value="notifications"><Card className="shadow-md"><CardHeader><CardTitle>Préférences Notifications</CardTitle><CardDescription>Choix des notifications entreprise.</CardDescription></CardHeader><CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="newApplicationAlerts" className="font-medium">Nlles Candidatures</Label><p className="text-sm text-muted-foreground">Email pour chaque candidature.</p></div><Switch id="newApplicationAlerts" defaultChecked /></div>
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="candidateMessages" className="font-medium">Messages Candidats</Label><p className="text-sm text-muted-foreground">Notifié des nvx messages.</p></div><Switch id="candidateMessages" defaultChecked /></div>
            <div className="flex items-center justify-between p-4 border rounded-lg"><div><Label htmlFor="interviewReminders" className="font-medium">Rappels Entretiens</Label><p className="text-sm text-muted-foreground">Rappels pour entretiens.</p></div><Switch id="interviewReminders" /></div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">Enregistrer Préférences</Button></CardContent></Card></TabsContent>
        <TabsContent value="integrations"><Card className="shadow-md"><CardHeader><CardTitle>Intégrations</CardTitle><CardDescription>Connectez vos outils.</CardDescription></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Gérez sur la page dédiée.</p><Button variant="secondary" asChild><Link href="/dashboard/settings/integrations">Gérer Intégrations</Link></Button></CardContent></Card></TabsContent>
        <TabsContent value="advanced"><Card className="shadow-md"><CardHeader><CardTitle>Avancé</CardTitle><CardDescription>Options avancées compte.</CardDescription></CardHeader><CardContent className="space-y-6"><Card className="border-destructive/50"><CardHeader><CardTitle className="text-lg text-destructive flex items-center"><Trash2 className="mr-2 h-5 w-5" /> Zone Dangereuse</CardTitle></CardHeader><CardContent><p className="text-sm text-destructive/90 mb-3">Suppression irréversible. Toutes données (offres, candidats) seront perdues.</p>
            <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Supprimer Compte</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Absolument sûr(e) ?</AlertDialogTitle><AlertDialogDescription>Action irréversible. Données de "{settings?.companyName || 'votre entreprise'}" perdues.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">Oui, Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></CardContent></Card></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

    