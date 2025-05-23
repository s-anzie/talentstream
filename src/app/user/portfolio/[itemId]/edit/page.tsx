
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, ImagePlus, Link as LinkIcon, Tag, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // Label is part of FormLabel now
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { PortfolioItemFormData, portfolioItemSchema } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { useFetchUserPortfolioItemDetails } from '@/hooks/useDataFetching';
import { updateUserPortfolioItem } from '@/lib/mock-api-services'; // Corrected import path
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPortfolioItemPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const itemId = params.itemId as string;

  const { data: initialItem, isLoading, error } = useFetchUserPortfolioItemDetails(itemId);
  
  const form = useForm<PortfolioItemFormData>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: { title: "", description: "", imageUrl: "", projectUrl: "", tags: "" },
  });

  useEffect(() => {
    if (initialItem) {
      form.reset({
        title: initialItem.title || "",
        description: initialItem.description || "",
        imageUrl: initialItem.imageUrl || "",
        projectUrl: initialItem.projectUrl || "",
        tags: initialItem.tags || "",
      });
    }
  }, [initialItem, form]);

  async function onSubmit(data: PortfolioItemFormData) {
    if (!user?.id || !itemId) {
        toast({ title: "Erreur", description: "Informations manquantes pour la mise à jour.", variant: "destructive" });
        return;
    }
    try {
      await updateUserPortfolioItem(itemId, data); 
      toast({ title: "Élément Mis à Jour !", description: `"${data.title}" a été mis à jour dans votre portfolio.` });
      router.push(`/user/portfolio/${itemId}`);
    } catch (error: any) {
      toast({ title: "Erreur de Mise à Jour", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (error || !initialItem) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/user/portfolio`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portfolio
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Élément non trouvé."}</p>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/user/portfolio/${itemId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux détails de l'élément
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><Save className="mr-3 h-7 w-7"/>Modifier l'Élément du Portfolio</CardTitle>
          <CardDescription>Mettez à jour les informations de cet élément de votre portfolio.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">Titre du Projet/Réalisation</FormLabel><FormControl><Input placeholder="Ex: Refonte du site web pour Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">Description Détaillée</FormLabel><FormControl><Textarea placeholder="Décrivez le projet, votre rôle, les technologies utilisées, les résultats obtenus..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><ImagePlus className="mr-2 h-4 w-4"/>URL de l'Image/Vidéo (Optionnel)</FormLabel><FormControl><Input placeholder="https://example.com/image.png ou lien YouTube/Vimeo" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="projectUrl" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><LinkIcon className="mr-2 h-4 w-4"/>Lien vers le Projet (Optionnel)</FormLabel><FormControl><Input type="url" placeholder="https://github.com/votreprojet ou https://projetlive.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><Tag className="mr-2 h-4 w-4"/>Mots-clés / Technologies (Optionnel)</FormLabel><FormControl><Input placeholder="Ex: React, UX Design, Gestion de projet" {...field} /></FormControl><FormDescription className="text-xs">Séparez par des virgules.</FormDescription><FormMessage /></FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t pt-6">
                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-5 w-5" /> 
                    {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder les Modifications"}
                </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}

