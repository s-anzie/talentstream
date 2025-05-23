
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import React, { useEffect } from "react"; // Added React for JSX

export default function RecruiterOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuthStore();

  useEffect(() => {
    if (!authIsLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?next=/auth/recruiter-onboarding');
        return;
      }

      // If user is a candidate, redirect them away
      if (user?.role === 'candidate') {
        router.replace('/jobs'); // Or /user for their dashboard
      } 
      // If user is a fully setup recruiter or admin, redirect to dashboard
      else if ((user?.role === 'recruiter' && user.companyId && user.companyName) || user?.role === 'admin') {
        router.replace('/dashboard');
      }
      // Allow 'recruiter_unassociated' or (rarely) 'recruiter' without full company setup
    }
  }, [user, isAuthenticated, authIsLoading, router]);

  if (authIsLoading || (!isAuthenticated && !authIsLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  // Further check to ensure only the intended users see this page content
  // Allow 'recruiter_unassociated' or 'recruiter' that somehow missed company setup
  if (!user || (user.role !== 'recruiter_unassociated' && !(user.role === 'recruiter' && (!user.companyId || !user.companyName)))) {
    return (
         <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-muted-foreground">Redirection...</p>
            {/* Optional: A button to go to a default page if stuck */}
            {/* <Button onClick={() => router.push('/')}>Accueil</Button> */}
        </div>
    );
  }


  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 md:px-6">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Bienvenue Recruteur !</CardTitle>
          <CardDescription>
            Pour commencer à utiliser TalentSphere pour votre entreprise, veuillez choisir une option :
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/auth/company-create">
              <Briefcase className="mr-2 h-5 w-5" /> Créer une Nouvelle Entreprise <ArrowRight className="ml-auto h-5 w-5"/>
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link href="/auth/recruiter-invitations">
              <Users className="mr-2 h-5 w-5" /> Rejoindre une Entreprise (Voir Invitations) <ArrowRight className="ml-auto h-5 w-5"/>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
