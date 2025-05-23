
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, User, Briefcase, Clock, Users, FileText, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; // Renamed to avoid conflict
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { ScheduleInterviewFormData, scheduleInterviewSchema } from "@/lib/types";
import { useFetchAllCompanyCandidates, useFetchDashboardJobs } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { scheduleDashboardInterview as apiScheduleInterview } from '@/lib/mock-api-services';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser } = useAuthStore();

  const { data: candidates, isLoading: isLoadingCandidates } = useFetchAllCompanyCandidates(authUser?.companyId || null);
  const { data: jobs, isLoading: isLoadingJobs } = useFetchDashboardJobs(authUser?.companyId || null);

  const form = useForm<ScheduleInterviewFormData>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      candidateId: "",
      jobId: "",
      interviewDate: undefined,
      interviewTime: "",
      interviewType: undefined,
      interviewers: authUser?.fullName || "", // Pre-fill with current user as default interviewer
      notes: "",
    },
  });

  async function onSubmit(data: ScheduleInterviewFormData) {
    if (!authUser?.companyId) {
        toast({ title: "Erreur", description: "ID de l'entreprise non disponible.", variant: "destructive"});
        return;
    }
    try {
      await apiScheduleInterview(authUser.companyId, data);
      toast({ title: "Entretien Planifié !", description: `L'entretien a été ajouté à l'agenda.` });
      form.reset({ // Reset form with defaults
        candidateId: "", jobId: "", interviewDate: undefined, interviewTime: "", interviewType: undefined,
        interviewers: authUser?.fullName || "", notes: ""
      });
      router.push('/dashboard/interviews');
    } catch (error: any) {
      toast({ title: "Erreur de Planification", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }
  
  if (isLoadingCandidates || isLoadingJobs) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/interviews')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la gestion des entretiens
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><CalendarDays className="mr-3 h-7 w-7"/>Planifier un Nouvel Entretien</CardTitle>
          <CardDescription>Sélectionnez un candidat, une offre, et choisissez une date et un type d'entretien.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="candidateId" render={({ field }) => (
                  <FormItem><FormLabel className="text-md flex items-center"><User className="mr-2 h-4 w-4"/>Candidat</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un candidat" /></SelectTrigger></FormControl>
                    <SelectContent>{candidates?.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.title || 'N/A'})</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="jobId" render={({ field }) => (
                  <FormItem><FormLabel className="text-md flex items-center"><Briefcase className="mr-2 h-4 w-4"/>Offre Concernée</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez une offre" /></SelectTrigger></FormControl>
                    <SelectContent>{jobs?.map(j => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewDate" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel className="text-md">Date de l'Entretien</FormLabel><Popover>
                    <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP", { locale: fr }) : <span>Choisissez une date</span>}<CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                    </Button></FormControl></PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start"><CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} initialFocus locale={fr}/></PopoverContent>
                  </Popover><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewTime" render={({ field }) => (
                    <FormItem><FormLabel className="text-md flex items-center"><Clock className="mr-2 h-4 w-4"/>Heure</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewType" render={({ field }) => (
                    <FormItem><FormLabel className="text-md">Type d'Entretien</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="RH">Entretien RH</SelectItem><SelectItem value="Technique">Entretien Technique</SelectItem><SelectItem value="Manager">Entretien Manager</SelectItem><SelectItem value="Panel">Entretien Panel</SelectItem><SelectItem value="Culture Fit">Culture Fit</SelectItem><SelectItem value="Autre">Autre</SelectItem></SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="interviewers" render={({ field }) => (
                    <FormItem><FormLabel className="text-md flex items-center"><Users className="mr-2 h-4 w-4"/>Intervenant(s)</FormLabel><FormControl><Input placeholder="Noms des recruteurs" {...field} /></FormControl><FormDescription className="text-xs">Séparez par des virgules si plusieurs.</FormDescription><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel className="text-md flex items-center"><FileText className="mr-2 h-4 w-4"/>Notes / Instructions (Optionnel)</FormLabel><FormControl><Textarea placeholder="Ex: Lien visioconférence, points à aborder, informations pour le candidat..." {...field} rows={4} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{form.formState.isSubmitting ? "Planification..." : "Planifier l'Entretien"} <Save className="ml-2 h-5 w-5"/>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Assurez-vous que tous les participants sont informés des détails de l'entretien.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    