
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase, GraduationCap, Link as LinkIcon, Loader2, Mail, MapPin, Phone, PlusCircle, Save, UploadCloud, User, UserCircle2, UserPlus2 } from "lucide-react";
import { AddCandidateFormData, addCandidateFormSchema } from "@/lib/types";
import { addCompanyCandidate } from "@/lib/mock-api-services";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function AddCandidatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthStore();

  const form = useForm<AddCandidateFormData>({
    resolver: zodResolver(addCandidateFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", professionalTitle: "", location: "",
      summary: "", skills: "", linkedinUrl: "", githubUrl: "", portfolioUrl: "",
      experience: "", education: "",
    },
  });

  async function onSubmit(data: AddCandidateFormData) {
    if (!user?.companyId) {
        toast({ title: "Erreur", description: "ID de l'entreprise non trouvé.", variant: "destructive" });
        return;
    }
    try {
      const result = await addCompanyCandidate(user.companyId, data);
      if (result.success) {
        toast({ title: "Candidat Ajouté !", description: `Le profil de ${data.fullName} a été ajouté.` });
        form.reset();
        router.push(`/dashboard/candidates/${result.candidateId}`);
      } else {
        throw new Error("L'ajout du candidat a échoué.");
      }
    } catch (error: any) {
      toast({ title: "Erreur d'Ajout", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center"><UserPlus2 className="mr-3 h-8 w-8" /> Ajouter Candidat</CardTitle>
            <Button variant="outline" asChild><Link href="/dashboard/candidates"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link></Button>
        </div>
        <CardDescription>Ajoutez manuellement un candidat à votre base de données.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary flex items-center"><UserCircle2 className="mr-2 h-6 w-6"/>Infos Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Nom Complet</FormLabel><FormControl><Input placeholder="Ex: Jeanne Dupont" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="professionalTitle" render={({ field }) => (<FormItem><FormLabel>Titre Pro.</FormLabel><FormControl><Input placeholder="Ex: Dév. Web Senior" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="jeanne@email.com" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Téléphone (Opt.)</FormLabel><FormControl><Input type="tel" placeholder="+33 6..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Localisation</FormLabel><FormControl><Input placeholder="Ex: Lyon, France" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
            </section>
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary">Profil & Compétences</h3>
              <FormField control={form.control} name="summary" render={({ field }) => (<FormItem><FormLabel>Résumé / Bio</FormLabel><FormControl><Textarea placeholder="Présentation..." {...field} rows={4}/></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel>Compétences Clés</FormLabel><FormControl><Textarea placeholder="Ex: React, Node.js (séparées par virgules)" {...field} rows={3}/></FormControl><FormDescription>Séparez par virgules.</FormDescription><FormMessage /></FormItem>)}/>
            </section>
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
                 <h3 className="text-xl font-semibold text-secondary flex items-center"><UploadCloud className="mr-2 h-6 w-6"/>CV</h3>
                 <FormItem><FormLabel>Téléverser CV (PDF, DOCX - Max 5MB)</FormLabel><FormControl><Input type="file" accept=".pdf,.doc,.docx" disabled/></FormControl><FormDescription>Téléversement bientôt.</FormDescription><FormMessage /></FormItem>
            </section>
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary flex items-center"><LinkIcon className="mr-2 h-6 w-6"/>Liens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="linkedinUrl" render={({ field }) => (<FormItem><FormLabel>LinkedIn (URL)</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="portfolioUrl" render={({ field }) => (<FormItem><FormLabel>Portfolio (URL)</FormLabel><FormControl><Input placeholder="https://monportfolio.com" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="githubUrl" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>GitHub (URL, Opt.)</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
            </section>
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary flex items-center"><Briefcase className="mr-2 h-6 w-6"/>Expérience (Simplifié)</h3>
                 <FormField control={form.control} name="experience" render={({ field }) => (<FormItem><FormLabel>Détail des expériences</FormLabel><FormControl><Textarea placeholder="Titre - Entreprise (Dates) - Desc..." {...field} rows={5}/></FormControl><FormMessage /></FormItem>)}/>
            </section>
            <section className="space-y-6 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary flex items-center"><GraduationCap className="mr-2 h-6 w-6"/>Formation (Simplifié)</h3>
                <FormField control={form.control} name="education" render={({ field }) => (<FormItem><FormLabel>Détail des formations</FormLabel><FormControl><Textarea placeholder="Diplôme - École (Dates)..." {...field} rows={4}/></FormControl><FormMessage /></FormItem>)}/>
            </section>
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? "Ajout..." : "Ajouter Candidat"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    