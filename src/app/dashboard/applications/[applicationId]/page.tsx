
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileArchive, User, Briefcase, CalendarDays, Mail, Phone, Star, ListChecks, MessageCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCompanyApplicationDetails } from '@/hooks/useDataFetching'; // Assuming a hook exists for single application details
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// This function might be duplicated, consider moving to utils if used in many places
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "nouveau": return "bg-blue-100 text-blue-700";
    case "en examen": return "bg-purple-100 text-purple-700";
    case "entretien rh": return "bg-orange-100 text-orange-700";
    case "entretien technique": return "bg-teal-100 text-teal-700";
    case "offre": return "bg-indigo-100 text-indigo-700";
    case "embauché": return "bg-green-100 text-green-700";
    case "rejeté": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};


export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.applicationId as string;

  const { data: application, isLoading, error } = useFetchCompanyApplicationDetails(applicationId);

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
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/applications')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux candidatures
        </Button>
        <p className="text-destructive">Erreur de chargement: {error?.message || "Candidature non trouvée."}</p>
      </div>
    );
  }
  
  // Assuming candidate details are nested or fetched separately if needed
  const candidate = application.candidateDetails; // If available
  const job = application.jobDetails; // If available

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/applications')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à toutes les candidatures
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><FileArchive className="mr-3 h-7 w-7"/> Candidature #{application.id.substring(0,8)}...</CardTitle>
          <CardDescription>
            Détails de la candidature de <Link href={`/dashboard/candidates/${application.candidateId}`} className="text-secondary hover:underline font-medium">{application.candidateName}</Link> pour l'offre <Link href={`/dashboard/jobs/${application.jobId}`} className="text-secondary hover:underline font-medium">{application.jobTitle}</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><User className="mr-2 h-5 w-5 text-muted-foreground"/>Informations Candidat</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-16 w-16"><AvatarImage src={candidate?.avatarUrl} alt={candidate?.name} data-ai-hint="person avatar"/><AvatarFallback>{candidate?.name?.substring(0,2).toUpperCase() || "C"}</AvatarFallback></Avatar>
                            <div><p className="font-semibold text-lg">{candidate?.name}</p><p className="text-muted-foreground">{candidate?.title}</p></div>
                        </div>
                        <p><Mail className="inline mr-1.5 h-4 w-4 text-muted-foreground"/> {candidate?.email || "Non fourni"}</p>
                        <p><Phone className="inline mr-1.5 h-4 w-4 text-muted-foreground"/> {candidate?.phone || "Non fourni"}</p>
                        <Button size="sm" variant="link" asChild className="p-0 h-auto"><Link href={`/dashboard/candidates/${application.candidateId}`}>Voir profil complet</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-muted-foreground"/>Informations Offre</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p className="font-semibold text-lg">{job?.jobTitle}</p>
                        <p className="text-muted-foreground">{job?.location}</p>
                        <p><CalendarDays className="inline mr-1.5 h-4 w-4 text-muted-foreground"/> Postulée le: {new Date(application.applicationDate).toLocaleDateString('fr-FR')}</p>
                        <Button size="sm" variant="link" asChild className="p-0 h-auto"><Link href={`/dashboard/jobs/${application.jobId}`}>Voir détails de l'offre</Link></Button>
                    </CardContent>
                </Card>
            </div>
            <Separator />
             <div>
                <h3 className="text-lg font-semibold mb-2 text-secondary">Statut & Score</h3>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className={cn("text-lg py-1 px-3", getStatusBadgeVariant(application.status))}>{application.status}</Badge>
                    {application.matchScore && (
                         <div className="flex items-center text-lg">
                            <Star className="mr-1.5 h-5 w-5 text-yellow-400 fill-yellow-400"/>
                            <span className="font-semibold">{application.matchScore}%</span>
                            <span className="text-sm text-muted-foreground ml-1">(Adéquation)</span>
                         </div>
                    )}
                </div>
            </div>
            {/* Placeholder for CV viewer / attachments */}
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg">CV et Documents</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground"> (Visionneuse de CV et liste des documents joints à venir)</p>
                    <Button variant="outline" size="sm" className="mt-2" disabled>Télécharger CV (Bientôt)</Button>
                </CardContent>
            </Card>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
            <Button asChild><Link href={`/dashboard/applications/${applicationId}/status`}><ListChecks className="mr-2 h-4 w-4"/> Changer Statut</Link></Button>
            <Button variant="outline" asChild><Link href={`/dashboard/applications/${applicationId}/feedback`}><MessageCircle className="mr-2 h-4 w-4"/> Donner Feedback</Link></Button>
            <Button variant="outline" asChild><Link href={`/dashboard/jobs/${application.jobId}/candidates/${application.candidateId}/interview`}><CalendarDays className="mr-2 h-4 w-4"/> Planifier Entretien</Link></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    