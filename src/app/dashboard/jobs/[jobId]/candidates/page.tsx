
"use client";

import { useState, useMemo, DragEvent, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, MoreHorizontal, Eye, MessageSquare, FileText, Star, ArrowLeft, ChevronDown, ChevronUp, GripVertical, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFetchJobCandidates, useFetchDashboardJobDetails } from "@/hooks/useDataFetching";
import type { CompanyCandidate } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { updateCandidateStatus } from "@/lib/mock-api-services";
import { useToast } from "@/hooks/use-toast";

const recruitmentStages = ["Nouveau", "En Examen", "Entretien RH", "Entretien Technique", "Offre", "Embauché", "Rejeté"];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "nouveau": return "bg-blue-100 text-blue-700";
    case "en examen": return "bg-purple-100 text-purple-700";
    case "entretien rh": return "bg-orange-100 text-orange-700";
    case "entretien technique": return "bg-teal-100 text-teal-700";
    case "offre": return "bg-indigo-100 text-indigo-700";
    case "embauché": return "bg-green-100 text-green-700";
    case "rejeté": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function JobCandidatesPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { toast } = useToast();
  
  const { data: jobDetails, isLoading: isLoadingJobDetails } = useFetchDashboardJobDetails(jobId);
  const { data: fetchedCandidates, isLoading: isLoadingCandidates, error: candidatesError, refetch: refetchCandidates, setData: setFetchedCandidates } = useFetchJobCandidates(jobId);
  
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban'); 
  const [candidates, setCandidates] = useState<CompanyCandidate[]>([]);

  useEffect(() => {
    if (fetchedCandidates) {
      setCandidates(fetchedCandidates);
    }
  }, [fetchedCandidates]);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<string | null>(null);
  const [dropTargetCardId, setDropTargetCardId] = useState<string | null>(null);

  const candidatesByStatus = useMemo(() => {
    return recruitmentStages.reduce((acc, stage) => {
      acc[stage] = candidates.filter(c => c.status === stage);
      return acc;
    }, {} as { [key: string]: CompanyCandidate[] });
  }, [candidates]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, candidate: CompanyCandidate) => {
    e.dataTransfer.setData("candidateId", candidate.id);
    setDraggedItemId(candidate.id);
    setOriginalStatus(candidate.status as (string | null));
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setOriginalStatus(null);
    setDropTargetColumnId(null);
    setDropTargetCardId(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleColumnDragEnter = (e: DragEvent<HTMLDivElement>, stage: string) => { e.preventDefault(); setDropTargetColumnId(stage); };
  const handleColumnDragLeave = (e: DragEvent<HTMLDivElement>) => { if (!(e.relatedTarget as HTMLElement)?.closest(`[data-stage="${dropTargetColumnId}"]`)) setDropTargetColumnId(null); setDropTargetCardId(null); };
  const handleCardDragEnter = (e: DragEvent<HTMLDivElement>, targetCandidateId: string) => { e.stopPropagation(); if (draggedItemId && draggedItemId !== targetCandidateId) setDropTargetCardId(targetCandidateId); };
  const handleCardDragLeave = (e: DragEvent<HTMLDivElement>) => { e.stopPropagation(); if (!(e.relatedTarget as HTMLElement)?.closest(`[data-candidate-id="${dropTargetCardId}"]`)) setDropTargetCardId(null); };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetStage: string) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("candidateId");
    if (!candidateId || !originalStatus) return;

    try {
      await updateCandidateStatus(candidateId, jobId, targetStage); // Mock API call
      
      setCandidates(prevCandidates => {
        const draggedCandidate = prevCandidates.find(c => c.id === candidateId);
        if (!draggedCandidate) return prevCandidates;

        // Moving to a different column
        if (targetStage !== originalStatus) {
          return prevCandidates.map(c => c.id === candidateId ? { ...c, status: targetStage } : c);
        }
        
        // Reordering within the same column
        if (targetStage === originalStatus && dropTargetCardId && dropTargetCardId !== candidateId) {
          const candidatesInStage = prevCandidates.filter(c => c.status === targetStage);
          const otherCandidates = prevCandidates.filter(c => c.status !== targetStage);
          const draggedIndex = candidatesInStage.findIndex(c => c.id === candidateId);
          if (draggedIndex === -1) return prevCandidates;
          const targetIndex = candidatesInStage.findIndex(c => c.id === dropTargetCardId);
          if (targetIndex === -1) return prevCandidates;
          const reorderedStageCandidates = [...candidatesInStage];
          const [removed] = reorderedStageCandidates.splice(draggedIndex, 1);
          reorderedStageCandidates.splice(targetIndex, 0, removed);
          return [...otherCandidates, ...reorderedStageCandidates];
        }
        return prevCandidates; // No change if dropped in empty space of same column or on itself
      });
      toast({title: "Statut Candidat Mis à Jour", description: `Le statut de ${candidates.find(c=>c.id===candidateId)?.name} est maintenant ${targetStage}.`});
    } catch (error) {
        toast({title: "Erreur de Mise à Jour", description: "Impossible de mettre à jour le statut du candidat.", variant: "destructive"});
    } finally {
        handleDragEnd();
    }
  };
  
  if (isLoadingJobDetails || isLoadingCandidates) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }
  if (!jobDetails) return <div className="text-center py-10">Offre d'emploi non trouvée.</div>;
  if (candidatesError) return <p className="text-destructive">Erreur: {candidatesError.message}</p>;

  return (
    <div className="flex flex-col flex-1 h-full">
      <Card className={cn(
        "shadow-lg flex flex-col w-full ",
        { 
          "h-[calc(100vh-10rem)]": viewMode === 'kanban',
          "h-fit": viewMode === 'list'
        }
      )}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <Button variant="outline" size="sm" asChild className="mb-3"><Link href={`/dashboard/jobs/${jobId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'offre</Link></Button>
                <CardTitle className="text-2xl text-primary flex items-center"><Users className="mr-3 h-7 w-7" /> Candidats pour : {jobDetails.jobTitle}</CardTitle>
                <CardDescription>Gérez les candidats pour cette offre.</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'kanban')}>
                    <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Vue" /></SelectTrigger>
                    <SelectContent><SelectItem value="list">Liste</SelectItem><SelectItem value="kanban">Kanban</SelectItem></SelectContent>
                </Select>
                 <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtrer</Button>
            </div>
          </div>
           <div className="relative mt-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher un candidat..." className="pl-10 bg-background" /></div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 overflow-hidden">
          {viewMode === 'list' && (
             candidates.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead className="w-[250px]">Nom</TableHead><TableHead>Titre</TableHead><TableHead className="text-center">Score</TableHead><TableHead>Date Candidature</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {candidates.map((candidate) => (
                        <TableRow key={candidate.id} className="hover:bg-muted/10">
                          <TableCell><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person avatar"/><AvatarFallback>{candidate.name.substring(0,2).toUpperCase()}</AvatarFallback></Avatar><Link href={`/dashboard/candidates/${candidate.id}`} className="font-medium text-primary hover:underline">{candidate.name}</Link></div></TableCell>
                          <TableCell className="text-sm text-foreground/90">{candidate.title}</TableCell>
                          <TableCell className="text-center"><Badge variant={candidate.matchScore && candidate.matchScore > 80 ? "default" : "outline"} className={cn("font-semibold", candidate.matchScore && candidate.matchScore > 80 ? "bg-green-500 text-white" : "border-primary/50")}>{candidate.matchScore || 'N/A'}%</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{candidate.applicationDate ? new Date(candidate.applicationDate).toLocaleDateString('fr-FR') : 'N/A'}</TableCell>
                          <TableCell><Badge variant="outline" className={cn("text-xs font-medium", getStatusBadgeVariant(candidate.status || ''))}>{candidate.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild><Link href={`/dashboard/candidates/${candidate.id}`}><Eye className="mr-2 h-4 w-4" /> Profil Complet</Link></DropdownMenuItem>
                                <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Envoyer Message</DropdownMenuItem>
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" /> Ajouter Note</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (<div className="text-center py-12 text-muted-foreground"><Users className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucun candidat.</h3></div>)
          )}
          {viewMode === 'kanban' && (
            <div className="flex flex-1 gap-4 overflow-x-auto pb-4 -mx-6 px-6 h-full">
              {recruitmentStages.map(stage => (
                <div key={stage} data-stage={stage} className={cn("min-w-[300px] w-1/4 flex-shrink-0 h-full flex flex-col transition-colors duration-150", dropTargetColumnId === stage && "bg-primary/5 border-primary/30 border-2 border-dashed rounded-md")} onDrop={(e) => handleDrop(e, stage)} onDragOver={handleDragOver} onDragEnter={(e) => handleColumnDragEnter(e, stage)} onDragLeave={handleColumnDragLeave}>
                  <Card className="bg-muted/30 flex flex-col flex-1 shadow-sm">
                    <CardHeader className="py-3 px-4 border-b"><CardTitle className="text-md font-semibold text-primary flex justify-between items-center">{stage}<Badge variant="secondary" className="text-xs">{candidatesByStatus[stage]?.length || 0}</Badge></CardTitle></CardHeader>
                    <CardContent className="p-3 space-y-3 flex-1 overflow-y-auto">
                      {(candidatesByStatus[stage] || []).length === 0 && (<p className="text-xs text-muted-foreground text-center py-4">Aucun candidat.</p>)}
                      {(candidatesByStatus[stage] || []).map(candidate => (
                        <Card key={candidate.id} data-candidate-id={candidate.id} className={cn("bg-card shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing", draggedItemId === candidate.id && "opacity-50 shadow-xl rotate-1", dropTargetCardId === candidate.id && draggedItemId !== candidate.id && "outline outline-2 outline-primary outline-offset-2")} draggable="true" onDragStart={(e) => handleDragStart(e, candidate)} onDragEnd={handleDragEnd} onDragEnter={(e) => handleCardDragEnter(e, candidate.id)} onDragLeave={handleCardDragLeave}>
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1"><Avatar className="h-8 w-8"><AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person avatar" /><AvatarFallback>{candidate.name.substring(0,1)}</AvatarFallback></Avatar>
                              <div><Link href={`/dashboard/candidates/${candidate.id}`} className="text-sm font-semibold text-primary hover:underline line-clamp-1">{candidate.name}</Link><p className="text-xs text-muted-foreground line-clamp-1">{candidate.title}</p></div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <Badge variant={candidate.matchScore && candidate.matchScore > 80 ? "default" : "outline"} className={cn("text-xs", candidate.matchScore && candidate.matchScore > 80 ? "bg-green-100 text-green-700" : "border-primary/30")}><Star className="h-3 w-3 mr-1" /> {candidate.matchScore || 'N/A'}%</Badge>
                                 <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                                  <DropdownMenuContent align="end"><DropdownMenuItem>Voir Profil</DropdownMenuItem><DropdownMenuItem>Déplacer vers...</DropdownMenuItem></DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
         {viewMode === 'list' && candidates.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2">Précédent</Button><Button variant="outline" size="sm">Suivant</Button></CardFooter>)}
      </Card>
      {viewMode === 'kanban' && (<div className="mt-4 text-xs text-muted-foreground p-4 bg-card border rounded-md shadow"><p className="font-semibold mb-1">Note sur le Glisser-Déposer :</p><p>Le déplacement des candidats entre colonnes et le réordonnancement intra-colonne sont fonctionnels (localement). Les changements ne sont pas persistés. Pour une UX de production, une bibliothèque dédiée est recommandée.</p></div>)}
    </div>
  );
}

    