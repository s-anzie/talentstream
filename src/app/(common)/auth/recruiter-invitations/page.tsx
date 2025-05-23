
"use client";

import React, { useEffect, useState } from "react"; // Added React
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MailCheck, MailWarning, Loader2, ArrowLeft, Building, Check, X, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { fetchUserInvitations, respondToInvitation } from "@/lib/mock-api-services";
import type { CompanyInvitation } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecruiterInvitationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUserCompanyAssociation, isAuthenticated, isLoading: authIsLoading } = useAuthStore();
  const [invitations, setInvitations] = useState<CompanyInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?next=/auth/recruiter-invitations');
        return;
      }
      if (user?.role === 'candidate') {
        router.replace('/jobs');
      } else if (user?.role === 'recruiter' && user.companyId && user.companyName) {
        // If recruiter is already set up, redirect to dashboard
        router.replace('/dashboard');
      } else if (user?.role === 'admin') {
         router.replace('/dashboard');
      }
      // Allow 'recruiter_unassociated' or (rarely) 'recruiter' without company setup to proceed
    }
  }, [user, isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (user?.email && (user?.role === 'recruiter_unassociated' || (user?.role === 'recruiter' && !user.companyId))) {
      setIsLoading(true);
      fetchUserInvitations(user.email)
        .then(data => {
          setInvitations(data);
          setError(null);
        })
        .catch(err => {
          setError("Impossible de charger les invitations.");
          toast({ title: "Erreur", description: "Impossible de charger les invitations.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    } else if(!isAuthenticated && !authIsLoading) {
        // Not authenticated and auth check done, no need to load invitations
        setIsLoading(false);
    } else if (user && !(user?.role === 'recruiter_unassociated' || (user?.role === 'recruiter' && !user.companyId)) && !authIsLoading) {
        // User is authenticated but not the target role for this page
        setIsLoading(false);
    }
  }, [user, toast, isAuthenticated, authIsLoading]); // Added isAuthenticated

  const handleInvitationResponse = async (invitationId: string, companyId: string, companyName: string, accept: boolean) => {
    if(!user?.id) return;
    try {
      const response = await respondToInvitation(invitationId, accept);
      if (response.success && accept) {
        updateUserCompanyAssociation(response.companyId!, response.companyName!); // Assert companyId/Name exist on accept
        toast({ title: "Invitation Acceptée !", description: `Vous avez rejoint ${response.companyName}.` });
        // TODO: Potentially redirect to plan selection if that's the next step. For now, dashboard.
        router.push('/dashboard');
      } else if (response.success && !accept) {
        toast({ title: "Invitation Refusée" });
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      } else {
         toast({ title: "Erreur", description: response.message || "Impossible de traiter votre réponse.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message || "Impossible de traiter votre réponse.", variant: "destructive" });
    }
  };

  if (authIsLoading || (isLoading && isAuthenticated)) { // Only show loader if auth is loading OR we are fetching invitations for an auth'd user
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    // This case is mostly handled by the useEffect redirect, but as a fallback:
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <p>Veuillez vous connecter pour voir vos invitations.</p>
            <Button asChild className="mt-4"><Link href="/auth/login?next=/auth/recruiter-invitations">Se Connecter</Link></Button>
        </div>
    );
  }

  // Redirect if user is authenticated but not the target audience for this page
  if (user && (user.role !== 'recruiter_unassociated' && !(user.role === 'recruiter' && !user.companyId))) {
    return (
         <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <p className="text-muted-foreground">Vous n'avez pas accès à cette page ou vous êtes déjà configuré.</p>
            <Button asChild className="mt-4"><Link href={user.role === 'candidate' ? '/jobs' : '/dashboard'}>Retour à mon espace</Link></Button>
        </div>
    );
  }


  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* <Button variant="outline" size="sm" onClick={() => router.push('/auth/recruiter-onboarding')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au choix
      </Button> */}
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Vos Invitations</CardTitle>
          <CardDescription>
            Consultez les invitations pour rejoindre des entreprises sur TalentSphere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && !authIsLoading && ( // Show skeleton only if still loading invitations after auth is done
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          )}
          {!isLoading && error && <p className="text-destructive text-center">{error}</p>}
          {!isLoading && !error && invitations.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <MailWarning className="mx-auto h-16 w-16 opacity-50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Aucune invitation en attente.</h3>
              <p className="mt-2">Si vous attendez une invitation, vérifiez que l'email correct a été utilisé par l'entreprise.</p>
              <Button variant="link" asChild className="mt-4 text-primary"><Link href="/auth/company-create">Ou créer une nouvelle entreprise ?</Link></Button>
            </div>
          )}
          {!isLoading && !error && invitations.length > 0 && (
            <div className="space-y-4">
              {invitations.map(inv => (
                <Card key={inv.id} className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <Building className="h-6 w-6 text-secondary mr-3" />
                      <CardTitle className="text-lg">{inv.companyName}</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">Reçue le: {new Date(inv.dateSent).toLocaleDateString('fr-FR')}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Vous avez été invité à rejoindre l'équipe de recrutement de {inv.companyName}.</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleInvitationResponse(inv.id, inv.companyId, inv.companyName, false)}>
                      <X className="mr-2 h-4 w-4" /> Refuser
                    </Button>
                    <Button size="sm" onClick={() => handleInvitationResponse(inv.id, inv.companyId, inv.companyName, true)}>
                      <Check className="mr-2 h-4 w-4" /> Accepter
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
