
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, KeyRound, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/stores/authStore';
// import { useFetchCompanySecuritySettings, updateCompanySecuritySettings } from '@/hooks/useDataFetching'; // Example
// For now, this page will be mostly presentational

export default function CompanySecuritySettingsPage() {
  const router = useRouter();
  // const { user } = useAuthStore();
  // const { data: securitySettings, isLoading, error } = useFetchCompanySecuritySettings(user?.companyId);

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><ShieldCheck className="mr-3 h-7 w-7"/>Paramètres de Sécurité de l'Entreprise</CardTitle>
          <CardDescription>Gérez la sécurité du compte de votre entreprise et les accès de votre équipe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Card className="border-primary/20">
                <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center"><KeyRound className="mr-2 h-5 w-5 text-secondary"/>Authentification de l'Équipe</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Renforcez la sécurité pour tous les membres de votre équipe en activant l'authentification à deux facteurs (2FA).</p>
                    <Button variant="outline" disabled>Configurer 2FA pour l'équipe (Bientôt)</Button>
                    <p className="text-xs text-muted-foreground mt-2">Recommandé pour tous les comptes ayant accès à des données sensibles.</p>
                </CardContent>
            </Card>
             <Card className="border-primary/20">
                <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center"><Lock className="mr-2 h-5 w-5 text-secondary"/>Journaux d'Audit</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Consultez un historique des actions importantes effectuées sur le compte de l'entreprise par les membres de votre équipe (connexions, modifications majeures, etc.).</p>
                    <Button variant="outline" disabled>Voir les Journaux d'Audit (Bientôt)</Button>
                </CardContent>
            </Card>
            {/* Add more security settings as needed: IP Whitelisting, SSO Configuration (for Enterprise) etc. */}
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">La sécurité de vos données est notre priorité. Contactez le support pour toute question spécifique.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    