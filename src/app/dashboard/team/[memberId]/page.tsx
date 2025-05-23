
"use client";

import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit3, Mail, Phone, Save, ShieldCheck, UserCircle2, Users2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchTeamMemberDetails } from "@/hooks/useDataFetching";
import React, { useEffect, useState } from "react"; // Added React
import { TeamMember } from "@/lib/types";
import { updateTeamMember as apiUpdateTeamMember } from "@/lib/mock-api-services"; // Changed import alias
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamMemberDetailsPage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const router = useRouter();
  const { toast } = useToast();
  const { data: member, isLoading, error, setData: setMemberData } = useFetchTeamMemberDetails(memberId);
  
  const [formData, setFormData] = useState<Partial<TeamMember>>({
      name: member?.name || '',
      email: member?.email || '',
      phone: member?.phone || '',
      role: member?.role || '',
      status: member?.status || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        role: member.role,
        status: member.status,
      });
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectChange = (name: keyof Pick<TeamMember, "role" | "status">, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!memberId || !formData.name || !formData.email || !formData.role || !formData.status) {
        toast({ title: "Champs Requis", description: "Nom, email, rôle et statut sont requis.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    try {
        await apiUpdateTeamMember(memberId, formData);
        setMemberData?.(prev => prev ? ({...prev, ...formData} as TeamMember) : null);
        toast({ title: "Membre Mis à Jour", description: "Les informations du membre ont été sauvegardées."});
    } catch (e) {
        toast({ title: "Erreur", description: "Impossible de sauvegarder les modifications.", variant: "destructive"});
    } finally {
        setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48"/>
        <Skeleton className="h-64 w-full"/>
        <Skeleton className="h-48 w-full"/>
      </div>
    );
  }
  if (error) return <p className="text-destructive text-center py-10">Erreur: {error.message}</p>;
  if (!member) return <div className="text-center py-10 text-muted-foreground">Membre de l'équipe non trouvé.</div>;

  return (
    <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/team")} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'équipe</Button>
        <Card className="shadow-xl">
            <CardHeader className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/20"><AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person avatar" /><AvatarFallback className="text-4xl">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 space-y-1"><CardTitle className="text-3xl md:text-4xl font-bold text-primary">{formData.name || member.name}</CardTitle><CardDescription className="text-lg text-foreground/80">{formData.role || member.role}</CardDescription>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2"><Badge variant={formData.status === "Actif" ? "secondary" : "outline"} className={formData.status === "Actif" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>Statut : {formData.status || member.status}</Badge></div>
                </div>
                 <Button asChild variant="outline"><Link href={`/dashboard/team/${member.id}/permissions`}><ShieldCheck className="mr-2 h-4 w-4" /> Gérer Permissions</Link></Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <section className="p-6 border rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-secondary flex items-center mb-4"><UserCircle2 className="mr-2 h-6 w-6"/>Informations du Membre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><Label htmlFor="memberName">Nom Complet</Label><Input id="memberName" name="name" value={formData.name || ""} onChange={handleChange} /></div>
                        <div><Label htmlFor="memberEmail">Email</Label><Input id="memberEmail" name="email" type="email" value={formData.email || ""} onChange={handleChange} /></div>
                        <div><Label htmlFor="memberPhone">Téléphone (Opt.)</Label><Input id="memberPhone" name="phone" type="tel" value={formData.phone || ""} onChange={handleChange} /></div>
                        <div><Label htmlFor="memberRole">Rôle</Label>
                            <Select value={formData.role || ""} onValueChange={(val) => handleSelectChange("role", val)}>
                                <SelectTrigger id="memberRole"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Administrateur">Administrateur</SelectItem><SelectItem value="Recruteur">Recruteur</SelectItem><SelectItem value="Manager RH">Manager RH</SelectItem><SelectItem value="Collaborateur (Lecture seule)">Collaborateur (Lecture seule)</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="memberStatus">Statut</Label>
                            <Select value={formData.status || ""} onValueChange={(val) => handleSelectChange("status", val)}>
                                <SelectTrigger id="memberStatus"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Actif">Actif</SelectItem><SelectItem value="Inactif">Inactif</SelectItem><SelectItem value="En attente">En attente d'activation</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>
                <section className="p-6 border rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-secondary flex items-center mb-4"><Users2 className="mr-2 h-6 w-6"/>Détails du Compte</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><p className="text-sm text-muted-foreground">Date d'inscription</p><p className="font-medium">{member.joinDate ? new Date(member.joinDate).toLocaleDateString('fr-FR') : 'N/A'}</p></div>
                        <div><p className="text-sm text-muted-foreground">Dernière connexion</p><p className="font-medium">{member.lastLogin}</p></div>
                    </div>
                </section>
                 <div className="flex justify-end pt-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save className="mr-2 h-5 w-5" /> {isSaving ? "Sauvegarde..." : "Sauvegarder les Modifications"}
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                 <p className="text-xs text-muted-foreground">Assurez-vous que les rôles et statuts sont corrects pour maintenir la sécurité et l'accès approprié.</p>
            </CardFooter>
        </Card>
    </div>
  );
}
    