
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Briefcase, GraduationCap, Link as LinkIconLucide, UploadCloud, Save, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useFetchUserProfile } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { updateUserProfileData } from "@/lib/mock-api-services";
import { profileFormSchema, ProfileFormData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function EditProfilePage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: profileData, isLoading: isLoadingProfile, error: profileError } = useFetchUserProfile(user?.id || null);
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { // Will be overridden by useEffect
      fullName: "", email: "", phone: "", location: "", professionalTitle: "", bio: "",
      skills: "", linkedinUrl: "", portfolioUrl: "", githubUrl: "",
      experience1Title: "", experience1Company: "", experience1Dates: "", experience1Description: "",
      education1Degree: "", education1Institution: "", education1Dates: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  async function onSubmit(data: ProfileFormData) {
    if (!user?.id) {
        toast({ title: "Erreur", description: "Utilisateur non identifié.", variant: "destructive" });
        return;
    }
    try {
      await updateUserProfileData(user.id, data);
      toast({
        title: "Profil Mis à Jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de Sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-64 w-full" /> <Skeleton className="h-32 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" /> <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return <p className="text-destructive">Erreur de chargement du profil: {profileError.message}</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="items-center text-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src={user?.avatarUrl || "https://placehold.co/128x128.png"} alt={user?.fullName || "Avatar"} data-ai-hint="person avatar" />
                  <AvatarFallback>{user?.fullName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm" disabled>
                  <UploadCloud className="mr-2 h-4 w-4" /> Changer la Photo (Bientôt)
                </Button>
              </CardHeader>
              <CardContent className="text-center">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel className="sr-only">Nom Complet</FormLabel><FormControl><Input placeholder="Votre nom complet" {...field} className="text-2xl font-bold text-center border-none shadow-none focus-visible:ring-0 !ring-offset-0 h-auto p-0" /></FormControl><FormMessage className="text-xs"/></FormItem>
                )}/>
                <FormField control={form.control} name="professionalTitle" render={({ field }) => (
                    <FormItem><FormLabel className="sr-only">Titre Professionnel</FormLabel><FormControl><Input placeholder="Votre titre professionnel" {...field} className="text-center text-primary border-none shadow-none focus-visible:ring-0 !ring-offset-0 h-auto p-0 text-sm" /></FormControl><FormMessage className="text-xs"/></FormItem>
                )}/>
              </CardContent>
            </Card>
            <Card className="shadow-md"><CardHeader><CardTitle className="text-lg">Télécharger CV</CardTitle></CardHeader>
              <CardContent><FormField control={form.control} name="resume" render={({ field }) => (
                <FormItem><FormLabel>Votre CV (PDF, DOCX - Max 5MB)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => field.onChange(e.target.files)} className="border-dashed border-primary/50"/></FormControl><FormDescription className="text-xs">CV actuel: (nom du fichier) (Bientôt)</FormDescription><FormMessage /></FormItem>
              )}/>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><UserCircle className="mr-2 h-6 w-6"/> Informations Personnelles</CardTitle><CardDescription>Mettez à jour vos coordonnées.</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Adresse E-mail</FormLabel><FormControl><Input placeholder="vous@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input placeholder="+33 6 12 34 56 78" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Localisation</FormLabel><FormControl><Input placeholder="Ville, Pays" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6 lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>Biographie</CardTitle><CardDescription>Présentez-vous.</CardDescription></CardHeader>
              <CardContent><FormField control={form.control} name="bio" render={({ field }) => (<FormItem><FormLabel className="sr-only">Biographie</FormLabel><FormControl><Textarea placeholder="Courte biographie..." {...field} rows={5} /></FormControl><FormDescription>Max. 500 caractères.</FormDescription><FormMessage /></FormItem> )}/></CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6 lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>Compétences</CardTitle><CardDescription>Listez vos compétences clés (séparées par des virgules).</CardDescription></CardHeader>
              <CardContent><FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel className="sr-only">Compétences</FormLabel><FormControl><Textarea placeholder="Ex: React, Gestion de projet..." {...field} rows={3} /></FormControl><FormMessage /></FormItem> )}/></CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><Briefcase className="mr-2 h-6 w-6"/> Expériences</CardTitle><CardDescription>(Ajoutez plus bientôt)</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="experience1Title" render={({ field }) => ( <FormItem><FormLabel>Titre du Poste</FormLabel><FormControl><Input placeholder="Ex: Développeur Web" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="experience1Company" render={({ field }) => ( <FormItem><FormLabel>Entreprise</FormLabel><FormControl><Input placeholder="Nom de l'entreprise" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </div>
                <FormField control={form.control} name="experience1Dates" render={({ field }) => ( <FormItem><FormLabel>Dates</FormLabel><FormControl><Input placeholder="Ex: Jan 2020 - Déc 2022" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="experience1Description" render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Décrivez vos responsabilités..." {...field} rows={4}/></FormControl><FormMessage /></FormItem> )}/>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><GraduationCap className="mr-2 h-6 w-6"/> Formations</CardTitle><CardDescription>(Ajoutez plus bientôt)</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="education1Degree" render={({ field }) => ( <FormItem><FormLabel>Diplôme / Titre</FormLabel><FormControl><Input placeholder="Ex: Master Informatique" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name="education1Institution" render={({ field }) => ( <FormItem><FormLabel>Établissement</FormLabel><FormControl><Input placeholder="Nom de l'établissement" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </div>
                <FormField control={form.control} name="education1Dates" render={({ field }) => ( <FormItem><FormLabel>Dates</FormLabel><FormControl><Input placeholder="Ex: Sep 2018 - Juin 2020" {...field} /></FormControl><FormMessage /></FormItem> )}/>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader><CardTitle className="flex items-center text-xl text-primary"><LinkIconLucide className="mr-2 h-6 w-6"/> Liens Externes</CardTitle><CardDescription>Partagez vos profils professionnels.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => ( <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/votrenom" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="portfolioUrl" render={({ field }) => ( <FormItem><FormLabel>Portfolio / Site Web</FormLabel><FormControl><Input placeholder="https://votresite.com" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                <FormField control={form.control} name="githubUrl" render={({ field }) => ( <FormItem><FormLabel>GitHub (Optionnel)</FormLabel><FormControl><Input placeholder="https://github.com/votrenom" {...field} /></FormControl><FormMessage /></FormItem> )}/>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            <Save className="mr-2 h-5 w-5" />
            {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder les Modifications"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    