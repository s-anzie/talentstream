
"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, ShieldAlert, Loader2 } from "lucide-react";
import { useFetchTeamMemberDetails } from "@/hooks/useDataFetching";
import React, { useState, useEffect } from "react"; // Added React
import { updateTeamMemberPermissions, fetchTeamMemberPermissions } from "@/lib/mock-api-services"; // Assuming these exist
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const allPermissionsList = [
  { id: "manage_jobs", label: "Gérer les offres (créer, modifier, archiver)" },
  { id: "view_candidates", label: "Voir tous les candidats de l'entreprise" },
  { id: "manage_candidates", label: "Gérer les candidats (statut, notes, entretiens)" },
  { id: "access_billing", label: "Accéder à la facturation et aux abonnements" },
  { id: "manage_team", label: "Gérer les membres de l'équipe (inviter, modifier rôles)" },
  { id: "edit_company_settings", label: "Modifier les paramètres généraux de l'entreprise" },
  { id: "view_analytics", label: "Consulter toutes les analyses de recrutement" },
  { id: "access_integrations", label: "Gérer les intégrations tierces" },
];

export default function MemberPermissionsPage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { data: member, isLoading: isLoadingMember } = useFetchTeamMemberDetails(memberId);
  
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (memberId) {
      setIsLoadingPermissions(true);
      fetchTeamMemberPermissions(memberId).then(perms => {
        setPermissions(perms || {}); // Ensure perms is not null
        setIsLoadingPermissions(false);
      }).catch(err => {
        toast({title: "Erreur", description: "Impossible de charger les permissions.", variant: "destructive"});
        setIsLoadingPermissions(false);
      });
    }
  }, [memberId, toast]);

  const handlePermissionChange = (permissionId: string, checked: boolean | "indeterminate") => {
    setPermissions(prev => ({ ...prev, [permissionId]: Boolean(checked) }));
  };

  const handleSavePermissions = async () => {
    if (!memberId) return;
    setIsSaving(true);
    try {
        await updateTeamMemberPermissions(memberId, permissions);
        toast({title: "Permissions Mises à Jour", description: `Les permissions pour ${member?.name} ont été sauvegardées.`});
    } catch (e) {
        toast({ title: "Erreur", description: "Impossible de sauvegarder les permissions.", variant: "destructive"});
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoadingMember || isLoadingPermissions) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  if (!member) return <div className="text-center py-10 text-muted-foreground">Membre de l'équipe non trouvé.</div>;

  return (
    <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/team/${memberId}`)} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil de {member.name}</Button>
        <Card className="shadow-xl">
            <CardHeader><CardTitle className="text-3xl font-bold text-primary flex items-center"><ShieldAlert className="mr-3 h-8 w-8" /> Permissions pour {member.name}</CardTitle><CardDescription>Contrôlez précisément ce que ce membre de l'équipe peut voir et faire sur TalentSphere. Rôle actuel: <span className="font-semibold text-secondary">{member.role}</span>.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">Les permissions sont souvent héritées du rôle, mais peuvent être ajustées individuellement ici pour plus de granularité.</p>
                <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); handleSavePermissions();}}>
                    {allPermissionsList.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/20 transition-colors">
                            <Checkbox id={permission.id} checked={permissions[permission.id] || false} onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)} />
                            <Label htmlFor={permission.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">{permission.label}</Label>
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{isSaving ? "Sauvegarde..." : "Enregistrer les Permissions"} <Save className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Un contrôle d'accès basé sur les rôles (RBAC) bien configuré est essentiel pour la sécurité des données.</p>
            </CardFooter>
        </Card>
    </div>
  );
}
    