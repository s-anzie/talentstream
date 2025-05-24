
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, RefreshCw, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchBillingInfo } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { cancelSubscription } from '@/lib/mock-api-services'; // Mock service

export default function SubscriptionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: billingInfo, isLoading, error, setData: setBillingInfo } = useFetchBillingInfo(user?.companyId || null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (!user?.companyId) return;
    setIsCancelling(true);
    try {
        await cancelSubscription(user.companyId);
        // Optimistically update UI or refetch billingInfo
        setBillingInfo(prev => prev ? ({ ...prev, planName: "Annulé", price: "0€/mois", renewalDate: "Expiré" }) : null);
        toast({ title: "Abonnement Annulé", description: "Votre abonnement TalentSphere a été annulé."});
    } catch (e) {
        toast({ title: "Erreur", description: "Impossible d'annuler l'abonnement.", variant: "destructive"});
    } finally {
        setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-64 w-full"/>
        </div>
    );
  }
  if (error || !billingInfo) {
    return (
      <div className="space-y-6 text-center">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Facturation
          </Button>
          <p className="text-destructive">Erreur de chargement des informations d'abonnement: {error?.message || "Données non trouvées."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Facturation
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><RefreshCw className="mr-3 h-7 w-7"/>Gérer Votre Abonnement</CardTitle>
          <CardDescription>Consultez et modifiez votre plan d'abonnement TalentSphere actuel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl text-secondary flex items-center"><DollarSign className="mr-2 h-5 w-5"/>Plan Actuel : {billingInfo.planName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{billingInfo.price}</p>
                <p className="text-sm text-muted-foreground">Prochain renouvellement le : {new Date(billingInfo.renewalDate).toLocaleDateString('fr-FR')}</p>
            </CardContent>
          </Card>
          
          <div>
            <h4 className="font-semibold text-lg text-foreground/90 mb-2">Fonctionnalités Incluses :</h4>
            <ul className="list-none space-y-2 text-sm">
              {billingInfo.features.map(feature => (
                <li key={feature} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"/>
                    {feature}
                </li>
              ))}
            </ul>
          </div>
           
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-start border-t pt-6">
            <Button asChild className="w-full sm:w-auto"><Link href="/pricing">Voir Tous les Plans / Modifier</Link></Button>
            {billingInfo.planName !== "Annulé" && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto bg-red-600 hover:bg-red-700" disabled={isCancelling}>
                            {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            <AlertTriangle className="mr-2 h-4 w-4"/>Annuler l'Abonnement
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr de vouloir annuler votre abonnement ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Votre accès aux fonctionnalités du plan {billingInfo.planName} prendra fin à la date de renouvellement ({new Date(billingInfo.renewalDate).toLocaleDateString('fr-FR')}). Vous pourrez toujours réactiver votre abonnement plus tard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Non, Rester Abonné</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isCancelling}>
                                {isCancelling ? "Annulation..." : "Oui, Confirmer l'Annulation"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
    