
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Send, User, Briefcase, Mail, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // No longer needed as FormLabel is used
import { Textarea } from '@/components/ui/textarea';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Ensured FormDescription is here
import { ReferralRequestFormData, referralRequestSchema } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { requestUserReferral } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';

export default function RequestReferralPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const form = useForm<ReferralRequestFormData>({
    resolver: zodResolver(referralRequestSchema),
    defaultValues: { contactName: "", contactEmail: "", contactCompany: "", message: `Bonjour [Nom du Contact],\n\nJ'espère que vous allez bien. Je me permets de vous solliciter pour une recommandation concernant mes compétences en [Domaine/Compétence] acquises lors de notre collaboration sur [Projet/Entreprise].\n\nCela m'aiderait beaucoup dans ma recherche actuelle pour un poste de [Type de Poste].\n\nMerci d'avance pour votre temps et votre aide.\n\nCordialement,\n${user?.fullName || "[Votre Nom]"}` },
  });

  async function onSubmit(data: ReferralRequestFormData) {
    if (!user?.id) {
        toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
        return;
    }
    try {
      await requestUserReferral(user.id, data);
      toast({ title: "Demande Envoyée !", description: `Votre demande de recommandation à ${data.contactName} a été envoyée.` });
      form.reset();
      router.push('/user/referrals');
    } catch (error: any) {
      toast({ title: "Erreur d'Envoi", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/referrals')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux recommandations
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><Send className="mr-3 h-7 w-7"/>Demander une Recommandation</CardTitle>
          <CardDescription>Sollicitez une recommandation d'un contact professionnel pour renforcer votre profil.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="contactName" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><User className="mr-2 h-4 w-4 text-secondary"/>Nom du Contact</FormLabel><FormControl><Input placeholder="Ex: Jean Dupont" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><Mail className="mr-2 h-4 w-4 text-secondary"/>Email du Contact</FormLabel><FormControl><Input type="email" placeholder="jean.dupont@entreprise.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="contactCompany" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><Briefcase className="mr-2 h-4 w-4 text-secondary"/>Entreprise du Contact (Optionnel)</FormLabel><FormControl><Input placeholder="Ex: Acme Corp" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">Message Personnalisé</FormLabel><FormControl><Textarea placeholder="Bonjour [Nom du Contact],\n\nJ'espère que vous allez bien. Je me permets de vous solliciter pour une recommandation concernant mes compétences en [Domaine/Compétence] acquises lors de notre collaboration sur [Projet/Entreprise].\n\nCela m'aiderait beaucoup dans ma recherche actuelle pour un poste de [Type de Poste].\n\nMerci d'avance pour votre temps et votre aide.\n\nCordialement,\n[Votre Nom]" {...field} rows={8} /></FormControl><FormDescription className="text-xs">Personnalisez ce message pour augmenter vos chances de réponse.</FormDescription><FormMessage /></FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Send className="mr-2 h-5 w-5" /> 
                        {form.formState.isSubmitting ? "Envoi en cours..." : "Envoyer la Demande"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
