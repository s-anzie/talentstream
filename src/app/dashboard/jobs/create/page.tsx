
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Lightbulb, Brain, Save, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { jobPostingFormSchema, JobPostingFormData } from "@/lib/types";
import { suggestCategoriesAction } from "@/lib/actions"; // Keep this for AI suggestion
import { createDashboardJob } from "@/lib/mock-api-services"; // Use service for creation
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function CreateJobPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const form = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingFormSchema),
    defaultValues: {
      jobTitle: "", fullDescription: "", skills: "", location: "", contractType: undefined,
      jobCategory: "", salaryMin: undefined, salaryMax: undefined, experienceLevel: "",
      responsibilities: "", qualifications: "", benefits: "", applicationDeadline: undefined,
    },
  });

  const handleSuggestCategories = async () => {
    const jobTitle = form.getValues("jobTitle");
    const jobDescription = form.getValues("fullDescription");
    if (!jobTitle || jobTitle.length < 3 || !jobDescription || jobDescription.length < 20) {
      toast({ title: "Information Manquante", description: "Titre (min 3 car.) et description (min 20 car.) requis.", variant: "destructive" });
      return;
    }
    setIsLoadingSuggestions(true); setSuggestionError(null); setSuggestedCategories([]);
    const result = await suggestCategoriesAction({ jobTitle, jobDescription });
    if ("error" in result) {
      setSuggestionError(result.error);
      toast({ title: "Erreur de Suggestion IA", description: result.error, variant: "destructive" });
    } else {
      setSuggestedCategories(result.categories);
      if (result.categories.length === 0) toast({ title: "Suggestions IA", description: "Aucune catégorie spécifique suggérée." });
    }
    setIsLoadingSuggestions(false);
  };

  async function onSubmit(data: JobPostingFormData) {
    if (!user?.companyId) {
        toast({ title: "Erreur", description: "ID de l'entreprise non trouvé. Veuillez vous reconnecter.", variant: "destructive" });
        return;
    }
    try {
      const result = await createDashboardJob(user.companyId, data);
      if (result.success) {
        toast({ title: "Offre Publiée !", description: `L'offre "${data.jobTitle}" a été créée.` });
        form.reset();
        setSuggestedCategories([]);
        router.push(`/dashboard/jobs/${result.jobId}`); // Redirect to the new job's page
      } else {
        throw new Error("La création de l'offre a échoué.");
      }
    } catch (error: any) {
      toast({ title: "Erreur de Publication", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center"><Brain className="mr-3 h-8 w-8" /> Publier une Offre</CardTitle>
             <Button variant="outline" asChild><Link href="/dashboard/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Retour aux offres</Link></Button>
        </div>
        <CardDescription>Remplissez les détails. Utilisez l'IA pour la catégorie !</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="jobTitle" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel className="text-lg">Titre du Poste</FormLabel><FormControl><Input placeholder="Ex: Développeur Full-Stack Senior" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="fullDescription" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel className="text-lg">Description Complète</FormLabel><FormControl><Textarea placeholder="Missions, environnement..." {...field} rows={8} /></FormControl><FormDescription>Détaillez pour attirer les bons candidats.</FormDescription><FormMessage /></FormItem>
              )}/>
            </div>
            <Card className="bg-muted/30 p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-primary flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-500" /> Suggestion IA de Catégorie</h3>
                <Button type="button" onClick={handleSuggestCategories} disabled={isLoadingSuggestions} variant="outline" size="sm">
                  {isLoadingSuggestions ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suggestion...</>) : ("Suggérer Catégories")}
                </Button>
              </div>
              {suggestionError && <p className="mt-2 text-sm text-destructive">{suggestionError}</p>}
              {suggestedCategories.length > 0 && (
                <div className="mt-3 space-y-2"><p className="text-sm text-muted-foreground">Suggérées (cliquez pour sélectionner) :</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map((cat, idx) => (<Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-primary/20" onClick={() => {form.setValue("jobCategory", cat, { shouldValidate: true }); toast({ title: "Catégorie sélectionnée"});}}>{cat}</Badge>))}
                  </div>
                </div>
              )}
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <FormField control={form.control} name="jobCategory" render={({ field }) => (<FormItem><FormLabel>Catégorie</FormLabel><FormControl><Input placeholder="Ex: Développement Web" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Localisation</FormLabel><FormControl><Input placeholder="Ex: Paris ou Télétravail" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="contractType" render={({ field }) => (
                  <FormItem><FormLabel>Type de Contrat</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Temps plein">Temps plein</SelectItem><SelectItem value="CDI">CDI</SelectItem><SelectItem value="CDD">CDD</SelectItem><SelectItem value="Stage">Stage</SelectItem><SelectItem value="Freelance">Freelance</SelectItem><SelectItem value="Alternance">Alternance</SelectItem></SelectContent>
                  </Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="experienceLevel" render={({ field }) => (<FormItem><FormLabel>Niveau d'Expérience</FormLabel><FormControl><Input placeholder="Ex: Junior (0-2 ans)" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="salaryMin" render={({ field }) => (<FormItem><FormLabel>Salaire Min. Annuel (Optionnel)</FormLabel><FormControl><Input type="number" placeholder="Ex: 45000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="salaryMax" render={({ field }) => (<FormItem><FormLabel>Salaire Max. Annuel (Optionnel)</FormLabel><FormControl><Input type="number" placeholder="Ex: 60000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} /></FormControl><FormMessage /></FormItem>)}/>
            </div>
            <FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel className="text-lg">Compétences Requises</FormLabel><FormControl><Textarea placeholder="Compétences clés (séparées par virgules)" {...field} rows={3} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="responsibilities" render={({ field }) => (<FormItem><FormLabel className="text-lg">Responsabilités</FormLabel><FormControl><Textarea placeholder="Listez les responsabilités (une par ligne)" {...field} rows={5} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="qualifications" render={({ field }) => (<FormItem><FormLabel className="text-lg">Qualifications</FormLabel><FormControl><Textarea placeholder="Diplômes, certifications (une par ligne)" {...field} rows={4} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="benefits" render={({ field }) => (<FormItem><FormLabel className="text-lg">Avantages (Optionnel)</FormLabel><FormControl><Textarea placeholder="Avantages (une par ligne)" {...field} rows={4} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="applicationDeadline" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel className="text-lg">Date Limite de Candidature (Optionnel)</FormLabel><Popover>
                <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisissez une date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button></FormControl></PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value || undefined} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} initialFocus locale={fr}/></PopoverContent>
              </Popover><FormMessage /></FormItem>
            )}/>
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{form.formState.isSubmitting ? "Publication..." : "Publier l'Offre"} <Save className="ml-2 h-5 w-5"/>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    