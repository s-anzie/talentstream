
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileArchive, User, Briefcase, CalendarDays, Building, Percent, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCandidateApplicationDetails } from '@/hooks/useDataFetching'; // Using specific hook for this
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const getStatusBadgeVariant = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "cv envoyé": case "nouvelle candidature": return "bg-blue-100 text-blue-700";
    case "cv consulté": return "bg-purple-100 text-purple-700";
    case "entretien planifié": return "bg-orange-100 text-orange-700";
    case "processus terminé - offre": return "bg-green-100 text-green-700";
    case "processus terminé - rejeté": case "candidature rejetée": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function CandidateApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  const { data: application, isLoading, error } = useFetchCandidateApplicationDetails(applicationId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !application) {
     return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/user/applications')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à mes candidatures
        </Button>
        <p className="text-destructive">Erreur de chargement: {error?.message || "Candidature non trouvée."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/applications')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à mes candidatures
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><FileArchive className="mr-3 h-7 w-7"/>Détails de ma Candidature</CardTitle>
          <CardDescription>
            Pour l'offre : <Link href={`/jobs/${application.jobId}`} className="text-secondary hover:underline font-medium">{application.jobTitle}</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground">Informations sur l'Entreprise</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage src={application.companyLogo} alt={`${application.company} logo`} data-ai-hint="company logo"/>
                        <AvatarFallback>{application.company.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <Link href={`/companies/${application.companyId || application.company.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold text-primary hover:underline text-xl">{application.company}</Link>
                        <p className="text-sm text-muted-foreground">{application.location}</p>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground">Ma Candidature</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><CalendarDays className="inline mr-1.5 h-4 w-4 text-muted-foreground"/> <strong>Date de candidature :</strong> {new Date(application.dateApplied).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="flex items-center gap-2">
                        <strong className="text-muted-foreground">Statut actuel :</strong>
                        <Badge variant="outline" className={cn("text-base py-1 px-3", getStatusBadgeVariant(application.status))}>
                            {application.status}
                        </Badge>
                    </div>
                    {application.matchScore && (
                         <p className="flex items-center">
                            <Percent className="inline mr-1.5 h-4 w-4 text-muted-foreground"/>
                            <strong>Score d'adéquation estimé :</strong> 
                            <span className="ml-1 font-semibold text-primary">{application.matchScore}%</span>
                         </p>
                    )}
                </CardContent>
            </Card>
             {/* Placeholder for application documents like CV, cover letter submitted */}
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">Documents Soumis</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">(Liste des documents (CV, lettre de motivation) à venir)</p>
                    <Button variant="outline" size="sm" className="mt-2" disabled>Voir mon CV soumis (Bientôt)</Button>
                </CardContent>
            </Card>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
            <Button asChild variant="outline"><Link href={`/user/applications/${applicationId}/status`}>Suivre le Statut Détaillé</Link></Button>
            <Button asChild variant="outline" disabled><Link href={`/user/applications/${applicationId}/feedback`}>Voir Feedback Recruteur (Bientôt)</Link></Button>
            <Button variant="destructive" disabled className="bg-red-500 hover:bg-red-600">Retirer ma Candidature (Bientôt)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    