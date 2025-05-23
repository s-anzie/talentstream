
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, CalendarDays, BuildingIcon, Link as LinkIcon, Edit3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useFetchUserCertificationDetails } from '@/hooks/useDataFetching';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CertificationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const certificationId = params.certificationId as string;

  const { data: cert, isLoading, error } = useFetchUserCertificationDetails(certificationId);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-24 w-full"/>
            <Skeleton className="h-48 w-full"/>
        </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/user/certifications')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux certifications
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Certification non trouvée."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/user/certifications')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux certifications
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div>
                <CardTitle className="flex items-center text-2xl text-primary"><Award className="mr-3 h-7 w-7"/>{cert.name}</CardTitle>
                <CardDescription>Détails de votre certification / qualification.</CardDescription>
            </div>
            <Button variant="outline" className="w-full sm:w-auto" disabled> {/* Edit would link to a new edit page */}
                <Edit3 className="mr-2 h-4 w-4"/>Modifier (Bientôt)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
            <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground flex items-center mb-1"><BuildingIcon className="mr-2 h-4 w-4 text-secondary"/>Organisation Émettrice</p>
                <p className="font-semibold text-lg text-foreground">{cert.issuingOrganization}</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4 text-secondary"/>Date d'Obtention</p>
                    <p className="font-semibold text-foreground">{format(new Date(cert.issueDate), "dd MMMM yyyy", { locale: fr })}</p>
                </div>
                {cert.expirationDate && (
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4 text-destructive"/>Date d'Expiration</p>
                        <p className="font-semibold text-foreground">{format(new Date(cert.expirationDate), "dd MMMM yyyy", { locale: fr })}</p>
                    </div>
                )}
            </div>
             {cert.credentialId && (
                <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">ID de la Certification</p>
                    <p className="font-semibold text-foreground">{cert.credentialId}</p>
                </div>
            )}
            {cert.credentialUrl && (
                <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center mb-1"><LinkIcon className="mr-2 h-4 w-4 text-secondary"/>Lien de Vérification</p>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline break-all">{cert.credentialUrl}</a>
                </div>
            )}
        </CardContent>
        <CardFooter className="border-t pt-4">
             <p className="text-xs text-muted-foreground">Les certifications vérifiables renforcent la crédibilité de votre profil.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    