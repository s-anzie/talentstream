
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookmarkCheck, ExternalLink, Briefcase, MapPin, DollarSign, CalendarDays, Building, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchSavedJobDetails } from '@/hooks/useDataFetching'; // Assuming this hook exists for specific saved job
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { removeSavedJob } from '@/lib/mock-api-services';
import { useAuthStore } from '@/stores/authStore';

export default function SavedJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const savedJobId = params.jobId as string; // This is the ID of the saved job entry, not necessarily the public job ID

  const { data: job, isLoading, error, refetch } = useFetchSavedJobDetails(savedJobId); // This hook should ideally fetch the detailed public job data using an ID stored in the saved job entry.

  const handleUnsave = async () => {
    if (!user?.id || !job) return;
    try {
      await removeSavedJob(user.id, job.id); // Assuming job.id is the savedJobId here
      toast({ title: "Offre Retirée", description: "L'offre a été retirée de vos sauvegardes." });
      router.push('/user/jobs-saved');
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de retirer l'offre.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !job) {
     return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/user/jobs-saved')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux offres sauvegardées
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Offre sauvegardée non trouvée."}</p>
      </div>
    );
  }
  
  const salaryDisplay = job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}k€ - ${job.salaryMax/1000}k€ / an` : job.salary || "Non spécifié";

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/jobs-saved')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux offres sauvegardées
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
                <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent-foreground/80">{job.category}</Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary">{job.title}</CardTitle>
                <Link href={`/companies/${job.companyId || job.company.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg text-muted-foreground hover:text-primary hover:underline flex items-center mt-1">
                    <Building className="mr-1.5 h-5 w-5"/>{job.company}
                </Link>
            </div>
            <Image src={job.logoUrl || `https://placehold.co/80x80.png?text=${job.company.substring(0,1)}`} alt={`${job.company} logo`} width={70} height={70} className="rounded-lg border hidden sm:block" data-ai-hint="company logo"/>
          </div>
          <div className="mt-4 space-y-2 text-sm text-foreground/80">
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-secondary" /> {job.location}</p>
              <p className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-secondary" /> {job.type}</p>
              <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-secondary" /> {salaryDisplay}</p>
              <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-secondary" /> Posté le: {new Date(job.postedDate).toLocaleDateString('fr-FR')}</p>
              {job.applicationDeadline && <p className="flex items-center text-destructive/80"><CalendarDays className="h-4 w-4 mr-2" /> Candidater avant le: {new Date(job.applicationDeadline).toLocaleDateString('fr-FR')}</p>}
            </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
            <section>
                <h3 className="text-xl font-semibold text-primary mb-2">Description du Poste</h3>
                <div className="prose prose-sm max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: job.fullDescription || job.shortDescription }} />
            </section>
            {job.responsibilities && job.responsibilities.length > 0 && (
                <section><h3 className="text-xl font-semibold text-primary mb-2">Responsabilités</h3><ul className="list-disc list-inside space-y-1 text-sm text-foreground/90 pl-4">{job.responsibilities.map((resp, index) => <li key={index}>{resp}</li>)}</ul></section>
            )}
            {job.qualifications && job.qualifications.length > 0 && (
                <section><h3 className="text-xl font-semibold text-primary mb-2">Qualifications Requises</h3><ul className="list-disc list-inside space-y-1 text-sm text-foreground/90 pl-4">{job.qualifications.map((qual, index) => <li key={index}>{qual}</li>)}</ul></section>
            )}
             {job.benefits && job.benefits.length > 0 && (
                <section><h3 className="text-xl font-semibold text-primary mb-2">Avantages</h3><ul className="list-disc list-inside space-y-1 text-sm text-foreground/90 pl-4">{job.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}</ul></section>
            )}
            {job.skills && job.skills.length > 0 && (
                <section><h3 className="text-xl font-semibold text-primary mb-3">Compétences Clés</h3><div className="flex flex-wrap gap-2">{job.skills.map(skill => (<Badge key={skill} variant="outline" className="text-sm bg-accent/10 text-accent-foreground/80">{skill}</Badge>))}</div></section>
            )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between border-t pt-6">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild>
              <Link href={`/jobs/${job.id}/apply`}>Postuler Maintenant</Link>
            </Button>
            <Button variant="destructive" size="lg" className="w-full sm:w-auto" onClick={handleUnsave}>
                <BookmarkCheck className="mr-2 h-5 w-5" /> Retirer des Sauvegardes
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    