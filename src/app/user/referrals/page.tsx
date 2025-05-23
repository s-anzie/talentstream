
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Share2, UserPlus, ChevronDown, Eye, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFetchUserReferrals } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "completed": return "bg-green-100 text-green-700";
    case "declined": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};


export default function ManageReferralsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: referrals, isLoading, error } = useFetchUserReferrals(user?.id || null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) return <p className="text-destructive text-center">Erreur: {error.message}</p>;
  
  const requestedReferrals = referrals?.filter(r => r.type === 'requested');
  const givenReferrals = referrals?.filter(r => r.type === 'given'); // Assuming 'given' type exists for referrals provided by the user

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil candidat
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
                <CardTitle className="flex items-center text-2xl text-primary"><Share2 className="mr-3 h-7 w-7"/>Mes Recommandations</CardTitle>
                <CardDescription>Gérez vos demandes de recommandation et celles que vous avez fournies (fonctionnalité à venir pour "données").</CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/user/referrals/request"><UserPlus className="mr-2 h-4 w-4"/> Demander une Recommandation</Link>
            </Button>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="requested" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="requested">Recommandations Demandées</TabsTrigger>
                    <TabsTrigger value="given" disabled>Recommandations Données (Bientôt)</TabsTrigger>
                </TabsList>
                <TabsContent value="requested">
                    {requestedReferrals && requestedReferrals.length > 0 ? (
                        <div className="space-y-4">
                            {requestedReferrals.map(ref => (
                                <Card key={ref.id} className="shadow-sm hover:shadow-md transition-colors">
                                    <CardHeader className="flex flex-row justify-between items-start p-4">
                                        <div>
                                            <CardTitle className="text-lg text-primary">À: {ref.contactName}</CardTitle>
                                            <CardDescription className="text-sm">{ref.contactEmail}</CardDescription>
                                            <p className="text-xs text-muted-foreground mt-1">Demandé le: {format(new Date(ref.date), "dd MMMM yyyy", {locale: fr})}</p>
                                        </div>
                                        <Badge variant="outline" className={cn("text-xs", getStatusBadgeVariant(ref.status))}>
                                            {ref.status === "pending" && <Clock className="mr-1.5 h-3 w-3"/>}
                                            {ref.status === "completed" && <CheckCircle className="mr-1.5 h-3 w-3"/>}
                                            {ref.status === "declined" && <XCircle className="mr-1.5 h-3 w-3"/>}
                                            {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                                        </Badge>
                                    </CardHeader>
                                    {ref.jobTitle && <CardContent className="px-4 pb-2 pt-0"><p className="text-sm text-muted-foreground">Pour l'offre: {ref.jobTitle}</p></CardContent>}
                                    <CardFooter className="p-4 border-t">
                                        <Button variant="ghost" size="sm" disabled><Eye className="mr-2 h-4 w-4"/>Voir Détails (Bientôt)</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <UserPlus className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                            <h3 className="text-xl font-semibold text-foreground">Aucune demande de recommandation envoyée.</h3>
                            <p className="mt-2">Demandez des recommandations pour renforcer votre profil.</p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="given">
                     <div className="text-center py-10 text-muted-foreground">
                        <Share2 className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                        <h3 className="text-xl font-semibold text-foreground">Fonctionnalité à venir.</h3>
                        <p className="mt-2">Vous pourrez bientôt voir ici les recommandations que vous avez données.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
    