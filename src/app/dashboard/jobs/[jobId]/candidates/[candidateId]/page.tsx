
"use client";

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, User, Briefcase, FileText, MessageSquare, CalendarDays, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCompanyCandidateDetails, useFetchDashboardJobDetails } from '@/hooks/useDataFetching'; // Fetch both
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function CandidateDetailsForJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const candidateId = params.candidateId as string;

  const { data: candidate, isLoading: isLoadingCandidate, error: candidateError } = useFetchCompanyCandidateDetails(candidateId);
  const { data: job, isLoading: isLoadingJob, error: jobError } = useFetchDashboardJobDetails(jobId);

  const applicationForThisJob = candidate?.applications?.find(app => app.jobId === jobId);

  if (isLoadingCandidate || isLoadingJob) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (candidateError || jobError || !candidate || !job) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux candidats de l'offre
        </Button>
        <p className="text-destructive">Erreur de chargement des détails: {candidateError?.message || jobError?.message || "Données non trouvées"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}/candidates`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux candidats de l'offre
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <User className="mr-3 h-7 w-7" /> Candidat: {candidate.name}
          </CardTitle>
          <CardDescription>
            Pour l'offre : <Link href={`/dashboard/jobs/${jobId}`} className="text-secondary hover:underline">{job.jobTitle}</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {applicationForThisJob && (
                <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Statut de la Candidature</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline" className="text-base">
                           {applicationForThisJob.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Date de candidature: {new Date(applicationForThisJob.appliedDate).toLocaleDateString('fr-FR')}</p>
                    </CardContent>
                </Card>
            )}
            {candidate.matchScore && (
                 <div className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-400 fill-yellow-400"/>
                    <span className="font-semibold">Score d'Adéquation (pour cette offre):</span>
                    <Badge variant="secondary" className="ml-2 text-sm">{candidate.matchScore}%</Badge>
                 </div>
            )}
            <p className="text-sm">
                <span className="font-semibold">Email:</span> {candidate.email || 'N/A'} <br/>
                <span className="font-semibold">Téléphone:</span> {candidate.phone || 'N/A'}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
                <Button asChild variant="outline">
                    <Link href={`/dashboard/candidates/${candidateId}`}>
                    <User className="mr-2 h-4 w-4" /> Voir Profil Complet
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={`/dashboard/jobs/${jobId}/candidates/${candidateId}/notes`}>
                    <FileText className="mr-2 h-4 w-4" /> Notes Internes
                    </Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href={`/dashboard/jobs/${jobId}/candidates/${candidateId}/interview`}>
                    <CalendarDays className="mr-2 h-4 w-4" /> Planifier Entretien
                    </Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href={`/dashboard/jobs/${jobId}/candidates/${candidateId}/messaging`}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Contacter
                    </Link>
                </Button>
            </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">Actions spécifiques à cette candidature.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    