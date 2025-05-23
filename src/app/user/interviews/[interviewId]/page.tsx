
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarHeart, User, Briefcase, Clock, Users, Info, FileText, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchUserInterviewDetails } from '@/hooks/useDataFetching';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "planifié": return "bg-blue-100 text-blue-700";
    case "terminé": return "bg-green-100 text-green-700";
    case "annulé": return "bg-red-100 text-red-700";
    case "à venir": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function UserInterviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;

  const { data: interview, isLoading, error } = useFetchUserInterviewDetails(interviewId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/user/interviews')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à mes entretiens
        </Button>
        <p className="text-destructive">Erreur de chargement des détails: {error?.message || "Entretien non trouvé."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/interviews')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à mes entretiens
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center text-2xl text-primary"><CalendarHeart className="mr-3 h-7 w-7"/>Détails de l'Entretien</CardTitle>
          <CardDescription>
            Statut: <Badge variant="outline" className={cn("ml-1", getStatusBadgeVariant(interview.status))}>{interview.status}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-muted-foreground"/>Offre d'Emploi</CardTitle></CardHeader>
                <CardContent>
                    <p className="font-semibold text-lg">{interview.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">Entreprise: {interview.data?.companyName || "N/A"}</p> {/* Assuming companyName in data */}
                    <Button size="sm" variant="link" asChild className="p-0 h-auto mt-1"><Link href={`/jobs/${interview.jobId}`}>Voir l'offre d'emploi</Link></Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-muted-foreground"/>Informations sur l'Entretien</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong className="text-muted-foreground">Date :</strong> {format(new Date(interview.date), "PPP", {locale: fr})}</p>
                    <p><strong className="text-muted-foreground">Heure :</strong> {interview.time}</p>
                    <p><strong className="text-muted-foreground">Type :</strong> {interview.type}</p>
                    <p><strong className="text-muted-foreground">Intervenant(s) Côté Entreprise :</strong> {interview.interviewers}</p>
                    {/* Could add location/link if provided */}
                </CardContent>
            </Card>
             {interview.notes && (
                <Card className="bg-muted/30">
                    <CardHeader className="pb-2"><CardTitle className="text-lg">Notes ou Instructions du Recruteur</CardTitle></CardHeader>
                    <CardContent><p className="text-sm whitespace-pre-wrap">{interview.notes}</p></CardContent>
                </Card>
            )}
             {interview.feedback && (
                 <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-2"><CardTitle className="text-lg text-green-700">Feedback Reçu</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-green-600 whitespace-pre-wrap">{interview.feedback}</p></CardContent>
                </Card>
            )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t pt-6">
            <Button asChild variant="outline"><Link href={`/user/interviews/${interviewId}/feedback`}><FileText className="mr-2 h-4 w-4"/>Voir Feedback Détaillé</Link></Button>
            {/* Conditionally show "Reschedule" or "Cancel" if status allows */}
            {interview.status === "Planifié" && <Button variant="outline" disabled>Demander à Replanifier (Bientôt)</Button>}
            {interview.status === "Planifié" && <Button variant="destructive" className="bg-red-500 hover:bg-red-600" disabled>Annuler ma Participation (Bientôt)</Button>}
             <Button asChild variant="secondary"><Link href={interview.data?.companyMessageLink || `/user/messages?recruiter=${interview.data?.recruiterId}`}><MessageSquare className="mr-2 h-4 w-4"/>Contacter le Recruteur</Link></Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    