
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Eye, Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchCompanyCandidateDetails } from '@/hooks/useDataFetching';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const getStatusBadgeVariant = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "contacté": case "nouveau": return "bg-blue-100 text-blue-700";
    case "entretien rh": case "entretien technique": return "bg-orange-100 text-orange-700";
    case "offre": return "bg-indigo-100 text-indigo-700";
    case "embauché": return "bg-green-100 text-green-700";
    case "rejeté": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function CandidateApplicationHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;

  const { data: candidate, isLoading, error } = useFetchCompanyCandidateDetails(candidateId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/candidates/${candidateId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil
        </Button>
        <p className="text-destructive">Erreur de chargement de l'historique: {error?.message || "Candidat non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/candidates/${candidateId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil de {candidate.name}
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><History className="mr-3 h-7 w-7"/> Historique des Candidatures de {candidate.name}</CardTitle>
          <CardDescription>
            Liste de toutes les candidatures de {candidate.name} au sein de votre entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidate.applications && candidate.applications.length > 0 ? (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Titre de l'Offre</TableHead>
                            <TableHead>Date de Candidature</TableHead>
                            <TableHead className="text-center">Statut Actuel</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidate.applications.map(app => (
                            <TableRow key={app.jobId + app.appliedDate} className="hover:bg-muted/10">
                                <TableCell className="font-medium">
                                    <Link href={`/dashboard/jobs/${app.jobId}`} className="text-primary hover:underline">
                                        {app.jobTitle}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(app.appliedDate).toLocaleDateString('fr-FR')}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(app.status))}>
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/jobs/${app.jobId}/candidates?candidateId=${candidate.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> Voir dans Pipeline
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
                <Briefcase className="mx-auto h-12 w-12 opacity-50 mb-3"/>
                <p>Aucune candidature enregistrée pour {candidate.name} dans votre entreprise.</p>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Cet historique permet de suivre l'engagement du candidat avec vos offres.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    