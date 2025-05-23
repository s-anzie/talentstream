
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Filter, MoreHorizontal, Eye, MessageSquare, FileText, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFetchAllCompanyCandidates } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "contacté": return "bg-blue-100 text-blue-700";
    case "à contacter": return "bg-yellow-100 text-yellow-700";
    case "en évaluation": return "bg-purple-100 text-purple-700";
    case "embauché": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function CandidateDatabasePage() {
  const { user } = useAuthStore();
  const { data: candidates, isLoading, error } = useFetchAllCompanyCandidates(user?.companyId || null);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><Users className="mr-3 h-7 w-7" /> Base de Candidats</CardTitle>
            <CardDescription>Recherchez, filtrez et gérez tous les profils de candidats.</CardDescription>
          </div>
           <Button variant="default" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild><Link href="/dashboard/candidates/add"><PlusCircle className="mr-2 h-5 w-5" /> Ajouter un Candidat</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher par nom, titre, compétence..." className="pl-10 bg-background" /></div>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="bg-background w-full md:w-auto">Statut <Filter className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Tous</DropdownMenuItem><DropdownMenuItem>Nouveau</DropdownMenuItem>{/* ... more statuses */}</DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="bg-background w-full md:w-auto">Filtres Avancés <Filter className="ml-2 h-4 w-4" /></Button>
          </div>

          {isLoading && (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
          )}
          {error && <p className="text-destructive text-center">Erreur: {error.message}</p>}
          {!isLoading && !error && candidates && candidates.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[250px]">Nom</TableHead><TableHead>Titre / Compétences</TableHead><TableHead className="text-center">Score</TableHead><TableHead>Statut</TableHead><TableHead>Dernière Activité</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-muted/10">
                      <TableCell><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person avatar" /><AvatarFallback>{candidate.name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar><Link href={`/dashboard/candidates/${candidate.id}`} className="font-medium text-primary hover:underline">{candidate.name}</Link></div></TableCell>
                      <TableCell><p className="font-medium text-sm text-foreground/90">{candidate.title}</p><div className="flex flex-wrap gap-1 mt-1">{(candidate.tags || candidate.skills?.slice(0,3))?.map(tag => (<Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent-foreground/80">{tag}</Badge>))}</div></TableCell>
                      <TableCell className="text-center"><Badge variant={candidate.matchScore && candidate.matchScore > 80 ? "default" : "outline"} className={candidate.matchScore && candidate.matchScore > 80 ? "bg-green-500 text-white" : ""}>{candidate.matchScore || 'N/A'}%</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs font-medium ${getStatusBadgeVariant(candidate.status || '')}`}>{candidate.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{candidate.applicationDate ? `Candidature ${new Date(candidate.applicationDate).toLocaleDateString('fr-FR')}` : 'Profil mis à jour récemment'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/dashboard/candidates/${candidate.id}`}><Eye className="mr-2 h-4 w-4" /> Voir Profil</Link></DropdownMenuItem>
                            <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Envoyer Message</DropdownMenuItem><DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ajouter Note</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
           {!isLoading && !error && (!candidates || candidates.length === 0) && (<div className="text-center py-12 text-muted-foreground"><Users className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun candidat.</h3><p className="mt-2">Ajoutez des candidats ou attendez les postulations.</p></div>)}
        </CardContent>
        {!isLoading && candidates && candidates.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2">Précédent</Button><Button variant="outline" size="sm">Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}

    