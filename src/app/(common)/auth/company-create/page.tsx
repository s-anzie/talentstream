
"use client";

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Building, Save, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyProfileSettingsSchema, type CompanyProfileSettingsFormData } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { updateCompanyProfileSettings as apiUpdateSettings } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form"; // Corrected import
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUserCompanyAssociation, isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  const form = useForm<CompanyProfileSettingsFormData>({
    resolver: zodResolver(companyProfileSettingsSchema),
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      companyDescription: "",
      companyIndustry: "",
      companyLocation: "",
      logoUrl: "",
    },
  });

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?next=/auth/company-create');
        return;
      }
      if (user?.role === 'candidate') {
        router.replace('/jobs');
      } else if (user?.role === 'recruiter' && user.companyId && user.companyName) {
        // If recruiter is already set up, redirect to dashboard
        router.replace('/dashboard');
      } else if (user?.role === 'admin') {
         router.replace('/dashboard');
      }
      // Allow 'recruiter_unassociated' or (rarely) 'recruiter' without companyName to proceed
    }
  }, [user, isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    // Pre-fill company name if user has one from registration (e.g., "Nouvelle Entreprise")
    // or if they are returning to this page.
    if (user && user.companyName && !form.getValues("companyName")) {
      form.setValue("companyName", user.companyName);
    }
    // If it's a fresh recruiter_unassociated, companyName in store might be undefined
    // or a placeholder if apiRegister sets one. We prefer to set it clearly for the user.
    if (user && user.role === 'recruiter_unassociated' && (!user.companyName || user.companyName === "Nouvelle Entreprise")) {
        form.setValue("companyName", "Nouvelle Entreprise (À compléter)");
    }
  }, [user, form]);


  const handleSave = async (data: CompanyProfileSettingsFormData) => {
    if (!user?.id || !user.companyId) { // companyId is assigned at registration for recruiter_unassociated
        toast({ title: "Erreur", description: "Information utilisateur ou ID d'entreprise manquant.", variant: "destructive"});
        return;
    }
    try {
        const result = await apiUpdateSettings(user.companyId, { ...data, companyId: user.companyId });
        if (result.success && result.companyName) {
            updateUserCompanyAssociation(user.companyId, result.companyName); // This will also update role to 'recruiter'
            toast({ title: "Profil Entreprise Créé !", description: `Les informations de "${result.companyName}" ont été sauvegardées.` });
            // TODO: Potentially redirect to plan selection if that's the next step. For now, dashboard.
            router.push('/dashboard');
        } else {
             toast({ title: "Erreur", description: result.message || "Impossible de sauvegarder le profil de l'entreprise.", variant: "destructive" });
        }
    } catch (e: any) {
        toast({ title: "Erreur", description: e.message || "Impossible de sauvegarder le profil de l'entreprise.", variant: "destructive" });
    }
  };

  if (authIsLoading || (!isAuthenticated && !authIsLoading)) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
        </div>
    );
  }

  // This check ensures only relevant users see this page's content
  if (!user || (user.role !== 'recruiter_unassociated' && !(user.role === 'recruiter' && !user.companyName))) {
     return <div className="flex justify-center items-center min-h-screen">Redirection...</div>; // Or a more informative message
  }


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* <Button variant="outline" size="sm" onClick={() => router.push('/auth/recruiter-onboarding')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au choix
      </Button> */}
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><Building className="mr-3 h-7 w-7"/>Configurer le Profil de Votre Entreprise</CardTitle>
          <CardDescription>
            Fournissez les informations de base pour commencer à recruter avec TalentSphere.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem><ShadFormLabel>Nom de l'Entreprise</ShadFormLabel><FormControl><Input placeholder="Ex: Solutions Innovantes SAS" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="companyWebsite" render={({ field }) => (
                        <FormItem><ShadFormLabel>Site Web</ShadFormLabel><FormControl><Input type="url" placeholder="https://votresite.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="companyDescription" render={({ field }) => (
                        <FormItem><ShadFormLabel>Description de l'Entreprise</ShadFormLabel><FormControl><Textarea placeholder="Présentez votre entreprise, sa mission..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="companyIndustry" render={({ field }) => (
                            <FormItem><ShadFormLabel>Secteur d'Activité</ShadFormLabel><FormControl><Input placeholder="Ex: Technologie, E-commerce" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="companyLocation" render={({ field }) => (
                            <FormItem><ShadFormLabel>Localisation (Siège)</ShadFormLabel><FormControl><Input placeholder="Ex: Paris, France" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="logoUrl" render={({ field }) => (
                        <FormItem>
                            <ShadFormLabel className="flex items-center"><UploadCloud className="mr-2 h-4 w-4"/> Logo de l'entreprise (URL)</ShadFormLabel>
                            <FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl>
                            <FormMessage />
                             {field.value && <Avatar className="mt-2 h-16 w-16"><AvatarImage src={field.value} alt="Aperçu logo" /><AvatarFallback>{form.getValues("companyName")?.substring(0,2).toUpperCase() || "LG"}</AvatarFallback></Avatar>}
                        </FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-5 w-5" />
                        {form.formState.isSubmitting ? "Configuration..." : "Configurer et Aller au Dashboard"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
