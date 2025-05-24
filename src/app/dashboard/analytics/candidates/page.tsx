
"use client";

import { Users, ArrowLeft, Search, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Line, LineChart, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFetchAllCompanyCandidates } from "@/hooks/useDataFetching"; // For skills table
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

// Dummy Data for charts - actual data for table will be from fetched candidates
const candidateAcquisitionData = [ { date: "Jan 24", newCandidates: 120 }, { date: "Fev 24", newCandidates: 150 }, { date: "Mar 24", newCandidates: 130 }, { date: "Avr 24", newCandidates: 180 }, { date: "Mai 24", newCandidates: 160 }, { date: "Juin 24", newCandidates: 200 }, { date: "Juil 24", newCandidates: 190 }, ];
const candidateSourceBreakdownData = [ { name: "LinkedIn", value: 350, fill: "hsl(var(--chart-1))" }, { name: "Indeed", value: 280, fill: "hsl(var(--chart-2))" }, { name: "Site Carrière", value: 200, fill: "hsl(var(--chart-3))" }, { name: "Cooptations", value: 120, fill: "hsl(var(--chart-4))" }, { name: "Salons", value: 50, fill: "hsl(var(--chart-5))" }, ];
const candidatePipelineStagesData = [ { stage: "Nouveaux", count: 387, fill: "hsl(var(--chart-1))" }, { stage: "En Examen", count: 250, fill: "hsl(var(--chart-2))" }, { stage: "Entretien RH", count: 150, fill: "hsl(var(--chart-3))" }, { stage: "Entretien Tech.", count: 80, fill: "hsl(var(--chart-4))" }, { stage: "Offre", count: 30, fill: "hsl(var(--chart-5))" }, { stage: "Embauché", count: 15, fill: "hsl(var(--chart-3))" }, ];

export default function CandidateAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: allCandidates, isLoading: isLoadingCandidates, error: candidatesError } = useFetchAllCompanyCandidates(user?.companyId || null);

  // Process skills from candidates for the table
  const topSkillsData = useMemo(() => {
    if (!allCandidates) return [];
    const skillCounts: Record<string, { count: number, categories: Set<string> }> = {};
    allCandidates.forEach(candidate => {
        candidate.skills?.forEach(skill => {
            if (!skillCounts[skill]) skillCounts[skill] = { count: 0, categories: new Set() };
            skillCounts[skill].count++;
            // Add logic to determine skill category if available, e.g., from a predefined list or candidate tags
            if (candidate.tags?.length) skillCounts[skill].categories.add(candidate.tags[0]); // Simplified category
        });
    });
    return Object.entries(skillCounts)
        .map(([skill, data]) => ({ skill, count: data.count, category: Array.from(data.categories)[0] || "Général" }))
        .sort((a,b) => b.count - a.count)
        .slice(0, 10); // Top 10 skills
  }, [allCandidates]);
  
  const isLoadingCharts = false; // Placeholder for separate chart data loading state

  if (isLoadingCandidates || isLoadingCharts) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" /> <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
   if (candidatesError) return <p className="text-destructive text-center">Erreur: {candidatesError.message}</p>;

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between"><Button variant="outline" size="sm" onClick={() => router.push("/dashboard/analytics")}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button></div>
      <Card className="shadow-lg"><CardHeader><CardTitle className="text-2xl text-primary flex items-center"><Users className="mr-3 h-7 w-7" /> Analyses des Candidats</CardTitle><CardDescription>Comprenez votre vivier de talents.</CardDescription></CardHeader></Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Candidats Actifs</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{allCandidates?.length || 0}</div><p className="text-xs text-muted-foreground">+X ce mois-ci</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Temps / Pipeline</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">22 j</div><p className="text-xs text-muted-foreground">De la candidature à la décision</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Source Principale</CardTitle></CardHeader><CardContent><div className="text-xl font-bold">LinkedIn</div><p className="text-xs text-muted-foreground">35% qualifiées</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Diversité (Placeholder)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">N/A</div><p className="text-xs text-muted-foreground">Indicateurs à venir</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Tendance d'Acquisition</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ newCandidates: { label: "Nvx Candidats", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-full">
              <LineChart data={candidateAcquisitionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="date" /><YAxis /><ChartTooltip content={<ChartTooltipContent />} /><Legend />
                <Line type="monotone" dataKey="newCandidates" stroke="var(--color-newCandidates)" strokeWidth={2} dot={{r:4}} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Répartition des Sources</CardTitle></CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={candidateSourceBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {candidateSourceBreakdownData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie>
                  <RechartsTooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Aperçu du Pipeline (Global)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Candidats", color: "hsl(var(--chart-1))" } }} className="h-[350px] w-full">
              <BarChart data={candidatePipelineStagesData} layout="vertical" margin={{ right: 40, left: 20 }}>
                <CartesianGrid horizontal={false} /><XAxis type="number" /><YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="count" radius={4}>{candidatePipelineStagesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <Card className="shadow-lg"><CardHeader><CardTitle className="text-xl text-primary">Compétences Clés du Vivier</CardTitle>
           <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher compétence..." className="pl-10 bg-background" /></div>
            <Select><SelectTrigger className="w-full md:w-[180px] bg-background"><SelectValue placeholder="Catégorie" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Toutes</SelectItem><SelectItem value="frontend">Frontend</SelectItem></SelectContent>
            </Select></div></CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead>Compétence</TableHead><TableHead>Catégorie</TableHead><TableHead className="text-center">Nb. Candidats</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {topSkillsData.map((skillItem) => (
                <TableRow key={skillItem.skill}>
                  <TableCell className="font-medium">{skillItem.skill}</TableCell>
                  <TableCell><Badge variant="outline">{skillItem.category}</Badge></TableCell>
                  <TableCell className="text-center">{skillItem.count}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm" asChild><Link href={`/dashboard/candidates?skill=${encodeURIComponent(skillItem.skill)}`}>Voir Candidats</Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>
      </Card>
    </div>
  );
}

    