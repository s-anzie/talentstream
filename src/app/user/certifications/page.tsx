
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Award, PlusCircle, Edit3, Trash2, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchUserCertifications } from '@/hooks/useDataFetching';
import { deleteUserCertification as apiDeleteUserCertification } from '@/lib/mock-api-services'; // Corrected import
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ManageCertificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: certifications, isLoading, error, refetch } = useFetchUserCertifications(user?.id || null);

  const handleDeleteCertification = async (certId: string, certName?: string) => {
    if (!user?.id) return;
    try {
      await apiDeleteUserCertification(certId); // Use the correctly imported function
      toast({ title: "Certification Supprimée", description: `"${certName || 'Cette certification'}" a été retirée.` });
      refetch?.();
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de supprimer la certification.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) return <p className="text-destructive text-center">Erreur: {error.message}</p>;

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/user')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil candidat
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-2xl text-primary"><Award className="mr-3 h-7 w-7"/>Mes Certifications</CardTitle>
            <CardDescription>Listez et gérez vos certifications, diplômes et qualifications professionnelles.</CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/user/certifications/add"><PlusCircle className="mr-2 h-4 w-4"/> Ajouter une Certification</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {certifications && certifications.length > 0 ? (
            <div className="space-y-4">
                {certifications.map(cert => (
                    <Card key={cert.id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row justify-between items-start p-4">
                            <div>
                                <CardTitle className="text-lg text-primary">{cert.name}</CardTitle>
                                <CardDescription className="text-sm">
                                    Par: {cert.issuingOrganization} - Obtenue le: {format(new Date(cert.issueDate), "dd MMMM yyyy", { locale: fr })}
                                    {cert.expirationDate && ` - Expire le: ${format(new Date(cert.expirationDate), "dd MMMM yyyy", { locale: fr })}`}
                                </CardDescription>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <Button variant="ghost" size="icon" asChild className="h-8 w-8"><Link href={`/user/certifications/${cert.id}`}><Eye className="h-4 w-4"/></Link></Button>
                                {/* Edit will be on detail page for now <Button variant="ghost" size="icon" disabled className="h-8 w-8"><Edit3 className="h-4 w-4"/></Button> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Supprimer "{cert.name}"?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCertification(cert.id, cert.name)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        {cert.credentialId && (
                             <CardContent className="px-4 pb-3 pt-0">
                                <p className="text-xs text-muted-foreground">ID: {cert.credentialId} {cert.credentialUrl && <Link href={cert.credentialUrl} target="_blank" className="ml-2 text-primary hover:underline">Vérifier</Link>}</p>
                             </CardContent>
                        )}
                    </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <Award className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                <h3 className="text-xl font-semibold text-foreground">Aucune certification ajoutée.</h3>
                <p className="mt-2">Ajoutez vos certifications pour enrichir votre profil.</p>
                <Button asChild className="mt-6"><Link href="/user/certifications/add">Ajouter Maintenant</Link></Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Les certifications valident vos compétences et peuvent attirer l'attention des recruteurs.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
