
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Building, Save, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFetchCompanyProfileSettings } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { updateCompanyProfileSettings as apiUpdateSettings } from '@/lib/mock-api-services';
import type { CompanyProfileSettings } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCompanyProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  // Utilisation du companyId de l'utilisateur authentifié pour fetcher les settings
  const { data: initialSettings, isLoading, error, setData: setFetchedSettings } = useFetchCompanyProfileSettings(user?.companyId || null);
  
  const [formData, setFormData] = useState<Partial<CompanyProfileSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialSettings) {
      setFormData(initialSettings);
      setLogoPreview(initialSettings.logoUrl || null);
    } else if (user?.companyId && !isLoading && !error) {
        // Cas où un recruteur vient de s'inscrire et que le profil est "vide"
        // initialSettings pourrait être null si fetchCompanyProfileSettings retourne null pour un nouveau companyId
        setFormData({
            companyId: user.companyId,
            companyName: user.companyName || "Nouvelle Entreprise (À compléter)",
            companyWebsite: "",
            companyDescription: "Veuillez compléter la description de votre entreprise.",
            companyIndustry: "",
            companyLocation: "",
            logoUrl: `https://placehold.co/80x80.png?text=${(user.companyName || "NE").substring(0,2).toUpperCase()}`
        });
        setLogoPreview(`https://placehold.co/80x80.png?text=${(user.companyName || "NE").substring(0,2).toUpperCase()}`);
    }
  }, [initialSettings, user, isLoading, error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = async () => {
    if (!user?.companyId || !formData.companyName) {
        toast({ title: "Erreur", description: "Nom de l'entreprise requis.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    try {
        await apiUpdateSettings(user.companyId, { ...formData, companyId: user.companyId } as CompanyProfileSettings);
        setFetchedSettings(prev => prev ? ({...prev, ...formData} as CompanyProfileSettings) : ({ ...formData } as CompanyProfileSettings) );
        toast({ title: "Profil Entreprise Sauvegardé", description: "Vos informations ont été mises à jour." });
    } catch (e) {
        toast({ title: "Erreur", description: "Impossible de sauvegarder le profil.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading && !initialSettings && !formData.companyId) { // Adjust loading condition
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-96 w-full"/>
        </div>
    );
  }
  if (error && !initialSettings) {
    return <p className="text-destructive text-center">Erreur de chargement du profil: {error.message}</p>;
  }
  
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><Building className="mr-3 h-7 w-7"/>Modifier le Profil de l'Entreprise</CardTitle>
          <CardDescription>
            {formData.companyName === "Nouvelle Entreprise (À compléter)" 
              ? "Bienvenue ! Veuillez compléter les informations de votre entreprise pour commencer."
              : "Mettez à jour les informations publiques et internes de votre entreprise."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-muted/30">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary/20">
                    <AvatarImage src={logoPreview || formData.logoUrl} alt={formData.companyName || "Logo"} data-ai-hint="company logo abstract"/>
                    <AvatarFallback className="text-3xl">{formData.companyName?.substring(0,2).toUpperCase() || "CO"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2 flex-1 w-full sm:w-auto">
                    <Label htmlFor="logoUpload" className="font-medium">Logo de l'Entreprise</Label>
                    <Input id="logoUpload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange} className="border-dashed border-primary/50 p-2 h-auto"/>
                    <p className="text-xs text-muted-foreground">Formats recommandés : PNG, JPG, SVG. Max 2MB.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label htmlFor="companyName" className="font-medium">Nom de l'Entreprise</Label><Input id="companyName" name="companyName" value={formData.companyName || ""} onChange={handleChange} placeholder="Ex: TalentSphere Solutions"/></div>
                <div><Label htmlFor="companyWebsite" className="font-medium">Site Web</Label><Input id="companyWebsite" name="companyWebsite" type="url" value={formData.companyWebsite || ""} onChange={handleChange} placeholder="https://votresite.com"/></div>
            </div>
            <div><Label htmlFor="companyDescription" className="font-medium">Description de l'Entreprise</Label><Textarea id="companyDescription" name="companyDescription" rows={4} value={formData.companyDescription || ""} onChange={handleChange} placeholder="Présentez brièvement votre entreprise, sa mission, sa culture..."/></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div><Label htmlFor="companyIndustry" className="font-medium">Secteur d'Activité</Label><Input id="companyIndustry" name="companyIndustry" value={formData.companyIndustry || ""} onChange={handleChange} placeholder="Ex: Technologie de l'Information, SaaS"/></div>
                 <div><Label htmlFor="companyLocation" className="font-medium">Localisation (Siège Social)</Label><Input id="companyLocation" name="companyLocation" value={formData.companyLocation || ""} onChange={handleChange} placeholder="Ex: Paris, France"/></div>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <Button onClick={handleSave} size="lg" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-5 w-5" /> 
                {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les Modifications"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    
