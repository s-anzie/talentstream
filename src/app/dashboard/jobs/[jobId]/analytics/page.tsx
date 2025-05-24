
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Eye, Users, Percent, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchDashboardJobDetails } from '@/hooks/useDataFetching'; // Assuming we fetch job details to get basic stats
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Legend, Pie, PieChart, Cell } from "recharts";
import { Skeleton } from '@/components/ui/skeleton';

// Dummy data for job-specific analytics charts
const dummyApplicationTrend = [
  { date: "01/07", count: 5 }, { date: "08/07", count: 12 }, { date: "15/07", count: 8 },
  { date: "22/07", count: 15 }, { date: "29/07", count: 10 },
];
const dummySourceBreakdown = [
  { name: 'LinkedIn', value: 40, fill: 'hsl(var(--chart-1))'},
  { name: 'Site Carrière', value: 30, fill: 'hsl(var(--chart-2))'},
  { name: 'Indeed', value: 20, fill: 'hsl(var(--chart-3))'},
  { name: 'Autres', value: 10, fill: 'hsl(var(--chart-4))'},
];

export default function JobSpecificAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const { data: job, isLoading, error } = useFetchDashboardJobDetails(jobId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28"/>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80"/> <Skeleton className="h-80"/>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'offre
        </Button>
        <p className="text-destructive">Erreur de chargement des analyses pour cette offre: {error?.message || "Offre non trouvée"}</p>
      </div>
    );
  }

  const conversionRate = job.views > 0 ? ((job.applicationsCount / job.views) * 100).toFixed(1) + '%' : 'N/A';

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/jobs/${jobId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'offre
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><BarChart3 className="mr-3 h-7 w-7"/>Analyses pour : {job.jobTitle}</CardTitle>
          <CardDescription>
            Statistiques détaillées pour cette offre d'emploi spécifique.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Eye className="mr-1.5 h-4 w-4"/> Vues</CardDescription><CardTitle className="text-3xl">{job.views}</CardTitle></CardHeader></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Users className="mr-1.5 h-4 w-4"/> Candidatures</CardDescription><CardTitle className="text-3xl">{job.applicationsCount}</CardTitle></CardHeader></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Percent className="mr-1.5 h-4 w-4"/> Taux Conversion</CardDescription><CardTitle className="text-3xl">{conversionRate}</CardTitle></CardHeader></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription className="flex items-center text-sm"><Clock className="mr-1.5 h-4 w-4"/> Temps pour Remplir</CardDescription><CardTitle className="text-3xl">N/A</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">(Donnée à venir)</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader><CardTitle className="text-xl text-primary">Tendance des Candidatures</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Candidatures", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-full">
              <LineChart data={dummyApplicationTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={{r:4}} name="Candidatures" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader><CardTitle className="text-xl text-primary">Répartition des Sources</CardTitle></CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
             <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={dummySourceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                            {dummySourceBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       {/* Placeholder for more specific charts like conversion by stage for this job */}
    </div>
  );
}
    