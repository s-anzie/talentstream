
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Label is part of FormLabel now
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"; // Added FormLabel
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/lib/mock-api-services";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  subject: z.string().min(3, { message: "Le sujet est requis (min 3 caractères)." }).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      toast({
        title: "Message Envoyé !",
        description: "Merci de nous avoir contactés. Nous vous répondrons bientôt.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur d'Envoi",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Contactez-Nous
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Nous sommes ravis de vous entendre ! Que vous ayez une question sur nos services, besoin d'assistance ou envie de discuter d'un partenariat, n'hésitez pas à nous joindre.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Send className="h-6 w-6 mr-2 text-primary" /> Envoyez-nous un Message
            </CardTitle>
            <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nom Complet</FormLabel><FormControl><Input placeholder="Votre nom complet" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Adresse E-mail</FormLabel><FormControl><Input type="email" placeholder="Votre adresse e-mail" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                </div>
                <FormField control={form.control} name="subject" render={({ field }) => (
                  <FormItem><FormLabel>Sujet</FormLabel><FormControl><Input placeholder="Sujet de votre message" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Écrivez votre message ici..." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div>
                  <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Envoyer le Message
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Nos Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-secondary" />
                <div><p className="font-semibold">E-mail</p><a href="mailto:contact@talentsphere.com" className="text-foreground/80 hover:text-primary">contact@talentsphere.com</a></div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 mr-3 text-secondary" />
                <div><p className="font-semibold">Téléphone</p><p className="text-foreground/80">+33 1 23 45 67 89 (Support)</p></div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 text-secondary mt-1" />
                <div><p className="font-semibold">Adresse</p><p className="text-foreground/80">123 Rue de l'Innovation<br />75000 Paris, France</p></div>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
             <Image src="https://placehold.co/600x350.png" alt="Carte de localisation de TalentSphere" width={600} height={350} className="w-full h-auto" data-ai-hint="map location city"/>
          </div>
        </div>
      </div>
    </div>
  );
}
