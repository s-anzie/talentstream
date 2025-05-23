
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIconLucide, ArrowLeft, CalendarDays, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { ScheduleInterviewFormData, scheduleInterviewSchema } from "@/lib/types";
import { useFetchCompanyCandidateDetails, useFetchDashboardJobDetails } from '@/hooks/useDataFetching';
import { scheduleDashboardInterview } from '@/lib/mock-api-services';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScheduleInterviewForCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params.jobId as string;
  const candidateId = params.candidateId as string;

  const { data: candidate, isLoading: isLoadingCandidate, error: candidateError } = useFetchCompanyCandidateDetails(candidateId);
  const { data: job, isLoading: isLoadingJob, error: jobError } = useFetchDashboardJobDetails(jobId);
  
  const form = useForm<ScheduleInterviewFormData>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      candidateId: candidateId,
      jobId: jobId,
      interviewDate: undefined,
      interviewTime: "",
      interviewType: undefined,
      interviewers: "",
      notes: "",
    },
  });
  
  useEffect(() => {
    // Pre-fill IDs if they become available after initial load
    if (candidateId) form.setValue("candidateId", candidateId);
    if (jobId) form.setValue("jobId", jobId);
  }, [candidateId, jobId, form]);

  async function onSubmit(data: ScheduleInterviewFormData) {
    try {
      // In a real app, companyId would come from auth store or similar
      const companyId = job?.companyId || "tech-solutions-inc"; // Placeholder
      const scheduledInterview = await scheduleDashboardInterview(companyId, data);
      toast({ title: "Entretien Planifié !", description: `Entretien avec ${candidate?.name} pour ${job?.jobTitle} le ${format(data.interviewDate, "PPP", { locale: fr })} à ${data.interviewTime}.` });
      form.reset();
      // Optionally redirect to a list of interviews or back to candidate page
      router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`);
    } catch (error: any) {
      toast({ title: "Erreur de Planification", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  if (isLoadingCandidate || isLoadingJob) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (candidateError || jobError || !candidate || !job) {
     return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <p className="text-destructive">Erreur: {candidateError?.message || jobError?.message || "Données non trouvées."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au candidat pour l'offre
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><CalendarDays className="mr-3 h-7 w-7"/> Planifier un Entretien</CardTitle>
          <CardDescription>
            Pour le candidat : <span className="font-semibold text-foreground">{candidate.name}</span><br/>
            Concernant l'offre : <span className="font-semibold text-foreground">{job.jobTitle}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="interviewDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel className="text-md">Date de l'Entretien</FormLabel><Popover>
                    <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisissez une date</span>}<CalendarIconLucide className="ml-auto h-4 w-4 opacity-50" />
                    </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} initialFocus locale={fr}/></PopoverContent>
                  </Popover><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewTime" render={({ field }) => (
                    <FormItem><FormLabel className="text-md">Heure de l'Entretien</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewType" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel className="text-md">Type d'Entretien</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="RH">Entretien RH</SelectItem><SelectItem value="Technique">Entretien Technique</SelectItem><SelectItem value="Manager">Entretien Manager</SelectItem><SelectItem value="Panel">Entretien Panel</SelectItem><SelectItem value="Autre">Autre</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewers" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel className="text-md">Intervenant(s)</FormLabel><FormControl><Input placeholder="Noms des personnes qui mèneront l'entretien" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel className="text-md">Notes / Instructions (Optionnel)</FormLabel><FormControl><Textarea placeholder="Ex: Lien visioconférence, points à aborder, etc." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{form.formState.isSubmitting ? "Planification..." : "Planifier l'Entretien"} <Save className="ml-2 h-5 w-5"/>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
    