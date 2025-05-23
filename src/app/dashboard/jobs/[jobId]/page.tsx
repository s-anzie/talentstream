
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Briefcase, Users, Edit, Eye, BarChart2, Clock, Share2, Archive, FileText, MessageSquare, ClipboardList, ChevronDown, TrendingUp, Target, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchDashboardJobDetails } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteDashboardJob } from "@/lib/mock-api-services"; // Assuming this service for archiving
import { useToast } from "@/hooks/use-toast";

const getStatusBadgeVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "ouvert": return "bg-green-100 text-green-700 hover:bg-green-200";
    case "en attente d'approbation": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    case "fermé": return "bg-red-100 text-red-700 hover:bg-red-200";
    case "brouillon": return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  }
};

export default function JobOverviewPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { data: job, isLoading, error, refetch } = useFetchDashboardJobDetails(jobId);
  const router = useRouter();
  const { toast } = useToast();

  const handleArchiveJob = async () => {
    if (!job) return;
    if (confirm(`Êtes-vous sûr de vouloir archiver l'offre "${job.jobTitle}" ?`)) {
        try {
            await deleteDashboardJob(job.id); // Using delete as archive for mock
            toast({ title: "Offre Archivée", description: `L'offre "${job.jobTitle}" a été archivée.`});
            refetch?.(); // Refetch to update status or list if on another page
            router.push("/dashboard/jobs");
        } catch (e) {
            toast({ title: "Erreur", description: "Impossible d'archiver l'offre.", variant: "destructive"});
        }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>
        <Skeleton className="h-10 w-full rounded-md mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-12 text-center text-destructive">Erreur de chargement de l'offre: {error.message}</div>;
  }
  if (!job) {
    return <div className="container mx-auto py-12 text-center">Offre d'emploi non trouvée. <Button asChild className="mt-4"><Link href="/dashboard/jobs">Retour aux offres</Link></Button></div>;
  }

  const salaryDisplay = job.salaryMin && job.salaryMax ? `${job.salaryMin/1000}k€ - ${job.salaryMax/1000}k€ / an` : "Non spécifié";
  const daysOpen = job.applicationDeadline ? Math.floor((new Date(job.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 'N/A'; // Days until deadline
  const conversionRate = job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) + '%' : '0%';

  const pipelineStages = [
    { name: "Nouveaux", count: job.pipelineStats?.nouveau || 0, icon: Users, color: "text-blue-500" },
    { name: "En Examen", count: job.pipelineStats?.enExamen || 0, icon: Eye, color: "text-purple-500" },
    { name: "Entretien RH", count: job.pipelineStats?.entretienRH || 0, icon: MessageSquare, color: "text-orange-500" },
    { name: "Entretien Tech", count: job.pipelineStats?.entretienTech || 0, icon: Briefcase, color: "text-teal-500" },
    { name: "Offre", count: job.pipelineStats?.offre || 0, icon: Target, color: "text-indigo-500" },
    { name: "Embauché(s)", count: job.pipelineStats?.embauche || 0, icon: CheckCircle, color: "text-green-500" },
    { name: "Rejeté(s)", count: job.pipelineStats?.rejete || 0, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/jobs")} className="mb-3"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
              <div className="flex items-center gap-3 mb-1">
                <Avatar className="h-12 w-12 border hidden sm:block"><AvatarImage src={job.company?.logoUrl || "https://placehold.co/60x60.png"} alt={`${job.company?.name} logo`} data-ai-hint="company logo abstract" /><AvatarFallback>{job.company?.name?.substring(0,2)}</AvatarFallback></Avatar>
                <div><CardTitle className="text-2xl md:text-3xl font-bold text-primary">{job.jobTitle}</CardTitle>
                    {job.company && <Link href={`/companies/${job.company.id}`} className="text-md text-muted-foreground hover:text-primary hover:underline">{job.company.name}</Link>}
                </div>
              </div>
              <Badge variant="outline" className={cn("text-sm", getStatusBadgeVariant(job.status))}>{job.status}</Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
              <Button asChild className="w-full sm:w-auto"><Link href={`/dashboard/jobs/${job.id}/candidates`}><Users className="mr-2 h-4 w-4" /> Gérer Candidats ({job.applications})</Link></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" className="w-full sm:w-auto">Actions <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href={`/dashboard/jobs/${job.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href={`/jobs/${job.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" /> Annonce Publique</Link></DropdownMenuItem>
                   <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Partager</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleArchiveJob}><Archive className="mr-2 h-4 w-4" /> Archiver</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Eye className="mr-1.5 h-4 w-4 text-muted-foreground" /> Vues</CardDescription><CardTitle className="text-3xl font-bold text-primary">{job.views}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">+20% vs mois dernier</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Users className="mr-1.5 h-4 w-4 text-muted-foreground" /> Candidatures</CardDescription><CardTitle className="text-3xl font-bold text-primary">{job.applications}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">5 nouvelles aujourd'hui</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><TrendingUp className="mr-1.5 h-4 w-4 text-muted-foreground" /> Tx Conv.</CardDescription><CardTitle className="text-3xl font-bold text-primary">{conversionRate}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">(Cand. / Vues)</p></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Clock className="mr-1.5 h-4 w-4 text-muted-foreground" /> Deadline dans</CardDescription><CardTitle className="text-3xl font-bold text-primary">{daysOpen} jours</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Limite: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('fr-FR') : 'N/A'}</p></CardContent></Card>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4" />Détails</TabsTrigger>
          <TabsTrigger value="pipeline"><ClipboardList className="mr-2 h-4 w-4" />Pipeline</TabsTrigger>
          <TabsTrigger value="activity"><Clock className="mr-2 h-4 w-4" />Activité</TabsTrigger>
          <TabsTrigger value="notes"><MessageSquare className="mr-2 h-4 w-4" />Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Infos Offre</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <section><h3 className="text-lg font-semibold mb-2 text-secondary">Description</h3><div className="prose prose-sm max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: job.fullDescription || "" }} /></section><Separator />
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <div><strong className="text-muted-foreground">Localisation:</strong> {job.location}</div>
                <div><strong className="text-muted-foreground">Contrat:</strong> {job.contractType}</div>
                <div><strong className="text-muted-foreground">Catégorie:</strong> {job.jobCategory}</div>
                <div><strong className="text-muted-foreground">Expérience:</strong> {job.experienceLevel}</div>
                <div><strong className="text-muted-foreground">Salaire:</strong> {salaryDisplay}</div>
                <div><strong className="text-muted-foreground">Publiée le:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('fr-FR') : 'N/A'}</div>
              </div><Separator />
              <section><h3 className="text-lg font-semibold mb-2 text-secondary">Responsabilités</h3><ul className="list-disc list-inside space-y-1 text-foreground/90 pl-4">{job.responsibilities?.split('\n').map((item, index) => <li key={index}>{item}</li>)}</ul></section><Separator />
              <section><h3 className="text-lg font-semibold mb-2 text-secondary">Qualifications</h3><ul className="list-disc list-inside space-y-1 text-foreground/90 pl-4">{job.qualifications?.split('\n').map((item, index) => <li key={index}>{item}</li>)}</ul></section><Separator />
              <section><h3 className="text-lg font-semibold mb-2 text-secondary">Avantages</h3><ul className="list-disc list-inside space-y-1 text-foreground/90 pl-4">{job.benefits?.split('\n').map((item, index) => <li key={index}>{item}</li>)}</ul></section><Separator />
              <section><h3 className="text-lg font-semibold mb-3 text-secondary">Compétences</h3><div className="flex flex-wrap gap-2">{job.skills?.split(',').map(skill => (<Badge key={skill.trim()} variant="secondary" className="text-sm bg-accent/10 text-accent-foreground/80 hover:bg-accent/20">{skill.trim()}</Badge>))}</div></section>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pipeline">
          <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Pipeline Candidats</CardTitle><CardDescription>Aperçu des candidats par étape.</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {pipelineStages.map(stage => (<Card key={stage.name} className="hover:shadow-lg transition-shadow"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className={cn("text-sm font-medium flex items-center", stage.color)}><stage.icon className="mr-2 h-4 w-4" /> {stage.name}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stage.count}</div></CardContent></Card>))}
              </div>
              <Button asChild><Link href={`/dashboard/jobs/${job.id}/candidates`}><Users className="mr-2 h-4 w-4" /> Gérer tous les candidats</Link></Button>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">Les chiffres sont mis à jour en temps réel.</CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="activity"><Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Activité Récente</CardTitle><CardDescription>Événements et actions pour cette offre.</CardDescription></CardHeader><CardContent><p className="text-muted-foreground">Flux d'activité à venir...</p></CardContent></Card></TabsContent>
        <TabsContent value="notes"><Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Notes Internes</CardTitle><CardDescription>Commentaires de l'équipe.</CardDescription></CardHeader><CardContent><Textarea placeholder="Ajouter une note..." rows={3} className="mb-4"/><Button size="sm">Ajouter Note</Button><Separator className="my-6"/><p className="text-muted-foreground">Notes existantes à venir...</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}

    