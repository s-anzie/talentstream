
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users2, Search, Filter, MoreHorizontal, Edit, Trash2, PlusCircle, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchTeamMembers } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const getRoleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "administrateur": return "bg-primary/10 text-primary";
    case "recruteur": return "bg-secondary/10 text-secondary";
    case "manager rh": return "bg-purple-500/10 text-purple-700";
    default: return "bg-muted text-muted-foreground";
  }
};
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "actif": return "bg-green-100 text-green-700";
    case "inactif": return "bg-yellow-100 text-yellow-700";
    case "en attente": return "bg-blue-100 text-blue-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function TeamManagementPage() {
  const { user } = useAuthStore();
  const { data: teamMembers, isLoading, error } = useFetchTeamMembers(user?.companyId || null);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><Users2 className="mr-3 h-7 w-7" /> Gestion de l'Équipe</CardTitle>
            <CardDescription>Visualisez, ajoutez et gérez les membres de votre équipe.</CardDescription>
          </div>
          <Button variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild><Link href="/dashboard/team/invite"><PlusCircle className="mr-2 h-5 w-5" /> Inviter Membre</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher par nom ou e-mail..." className="pl-10 bg-background" /></div>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Rôle <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Tous</DropdownMenuItem><DropdownMenuItem>Administrateur</DropdownMenuItem><DropdownMenuItem>Recruteur</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Tous</DropdownMenuItem><DropdownMenuItem>Actif</DropdownMenuItem><DropdownMenuItem>Inactif</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isLoading && (<div className="space-y-3"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>)}
          {error && <p className="text-destructive text-center">Erreur: {error.message}</p>}
          {!isLoading && !error && teamMembers && teamMembers.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[250px]">Nom</TableHead><TableHead>E-mail</TableHead><TableHead className="text-center">Rôle</TableHead><TableHead className="text-center">Statut</TableHead><TableHead>Dernière Connexion</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/10">
                      <TableCell><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person avatar" /><AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar><Link href={`/dashboard/team/${member.id}`} className="font-medium text-primary hover:underline">{member.name}</Link></div></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className={`text-xs font-medium ${getRoleBadgeVariant(member.role)}`}>{member.role}</Badge></TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className={`text-xs font-medium ${getStatusBadgeVariant(member.status)}`}>{member.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/dashboard/team/${member.id}`}><Edit className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/dashboard/team/${member.id}/permissions`}><ShieldCheck className="mr-2 h-4 w-4" /> Permissions</Link></DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-red-50"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && !error && (!teamMembers || teamMembers.length === 0) && (<div className="text-center py-12 text-muted-foreground"><Users2 className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun membre.</h3><p className="mt-2">Invitez des membres pour commencer.</p></div>)}
        </CardContent>
        {!isLoading && teamMembers && teamMembers.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2">Précédent</Button><Button variant="outline" size="sm">Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}

    