
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ShieldPlus, CalendarDays, Link as LinkIcon, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CertificationFormData, certificationSchema } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { addUserCertification } from '@/lib/mock-api-services';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';


export default function AddCertificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();

  const form = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { name: "", issuingOrganization: "", issueDate: "", expirationDate: "", credentialId: "", credentialUrl: "" },
  });

  async function onSubmit(data: CertificationFormData) {
    if (!user?.id) {
        toast({ title: "Erreur", description: "Utilisateur non authentifié.", variant: "destructive" });
        return;
    }
    // Convert date strings to Date objects if needed by API, or ensure API handles string dates.
    // For mock API, string dates are fine as per current Certification type.
    try {
      await addUserCertification(user.id, data);
      toast({ title: "Certification Ajoutée !", description: `"${data.name}" a été ajoutée à votre profil.` });
      form.reset();
      router.push('/user/certifications');
    } catch (error: any) {
      toast({ title: "Erreur d'Ajout", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/user/certifications')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux certifications
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><ShieldPlus className="mr-3 h-7 w-7"/>Ajouter une Certification</CardTitle>
          <CardDescription>Détaillez votre certification, diplôme ou qualification professionnelle pour enrichir votre profil.</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">Nom de la Certification/Diplôme</FormLabel><FormControl><Input placeholder="Ex: AWS Certified Cloud Practitioner" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="issuingOrganization" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">Organisation Émettrice</FormLabel><FormControl><Input placeholder="Ex: Amazon Web Services, Université de Paris" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="issueDate" render={({ field }) => ( // Using string input for date for simplicity with Zod
                          <FormItem><FormLabel className="text-md">Date d'Obtention</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="expirationDate" render={({ field }) => (
                          <FormItem><FormLabel className="text-md">Date d'Expiration (Optionnel)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="credentialId" render={({ field }) => (
                        <FormItem><FormLabel className="text-md">ID de la Certification (Optionnel)</FormLabel><FormControl><Input placeholder="Ex: ABC-123-XYZ" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="credentialUrl" render={({ field }) => (
                        <FormItem><FormLabel className="text-md flex items-center"><LinkIcon className="mr-2 h-4 w-4"/>Lien de Vérification (Optionnel)</FormLabel><FormControl><Input type="url" placeholder="https://validation.example.com/cert-id" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-5 w-5" /> 
                        {form.formState.isSubmitting ? "Ajout..." : "Ajouter la Certification"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
    