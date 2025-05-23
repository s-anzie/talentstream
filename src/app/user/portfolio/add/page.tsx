
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ImagePlus, Link as LinkIcon, Tag, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PortfolioItemFormData, portfolioItemSchema } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { addUserPortfolioItem } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';

export default function AddPortfolioItemPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const form = useForm<PortfolioItemFormData>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: { title: "", description: "", imageUrl: "", projectUrl: "", tags: "" },
  });

  async function onSubmit(data: PortfolioItemFormData) {
    if (!user?.id) {
        toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
        return;
    }
    try {
      await addUserPortfolioItem(user.id, data);
      toast({ title: "Élément Ajouté !", description: `"${data.title}" a été ajouté à votre portfolio.` });
      form.reset();
      router.push('/user/portfolio');
    } catch (error: any) {
      toast({ title: "Erreur d'Ajout", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/portfolio')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portfolio
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><ImagePlus className="mr-3 h-7 w-7"/>Ajouter un Élément au Portfolio</CardTitle>
          <CardDescription>Mettez en avant un projet, une réalisation ou une étude de cas. Soyez descriptif et ajoutez des visuels si possible.</CardDescription>
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
                        <FormItem><FormLabel className="text-md flex items-center"><ImagePlus className="mr-2 h-4 w-4"/>URL de l'Image/Vidéo (Optionnel)</FormLabel><FormControl><Input placeholder="https://example.com/image.png ou lien YouTube/Vimeo" {...field} /></FormControl><FormDescription className="text-xs">Une image ou vidéo de présentation.</FormDescription><FormMessage /></FormItem>
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
                    {form.formState.isSubmitting ? "Ajout..." : "Ajouter au Portfolio"}
                </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
    