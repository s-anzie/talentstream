
"use client";

import { BarChart3, Briefcase, Users, Clock, TrendingUp, Download, Filter, Search, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useFetchDashboardJobs } from "@/hooks/useDataFetching"; // Using this to get job data for the table
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Dummy Data for charts - will be replaced by actual data fetching if specific analytics hooks are made
const applicationsPerJobData = [
  { name: "Dev Full-Stack...", applications: 45 }, { name: "Designer UX/UI...", applications: 30 },
  { name: "Ing. Commercial...", applications: 22 }, { name: "Data Analyst Jr...", applications: 55 },
];
const jobSourceEffectivenessData = [
  { name: "LinkedIn", value: 120, fill: "hsl(var(--chart-1))" }, { name: "Indeed", value: 90, fill: "hsl(var(--chart-2))" },
  { name: "Site Carrière", value: 75, fill: "hsl(var(--chart-3))" }, { name: "Cooptation", value: 45, fill: "hsl(var(--chart-4))" },
  { name: "Autres", value: 30, fill: "hsl(var(--chart-5))" },
];
const timeToFillByDeptData = [
    { department: "Tech", avgDays: 38 }, { department: "Design", avgDays: 30 },
    { department: "Ventes", avgDays: 45 }, { department: "Marketing", avgDays: 32 },
];

const getStatusBadgeVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "ouvert": return "bg-green-100 text-green-700";
    case "fermé": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export default function JobAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  // Fetching all dashboard jobs for the table display, actual analytics data for charts is still mock
  const { data: jobAnalyticsData, isLoading: isLoadingJobs, error: jobsError } = useFetchDashboardJobs(user?.companyId || null);


  // TODO: Replace chart data with fetched data when specific analytics hooks are available
  const isLoadingCharts = false; // Simulate chart data loading if needed later

  if (isLoadingJobs || isLoadingCharts) {
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

   if (jobsError) return <p className="text-destructive text-center">Erreur: {jobsError.message}</p>;


  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/analytics")}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
        </div>
      <Card className="shadow-lg"><CardHeader><CardTitle className="text-2xl text-primary flex items-center"><Briefcase className="mr-3 h-7 w-7" /> Analyses des Offres</CardTitle><CardDescription>Suivez les performances de vos offres.</CardDescription></CardHeader></Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Offres Publiées</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{jobAnalyticsData?.length || 0}</div><p className="text-xs text-muted-foreground">+X ce mois-ci</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Candidatures / Offre</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">21</div><p className="text-xs text-muted-foreground">Moyenne</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Temps pour Pourvoir</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">38 j</div><p className="text-xs text-muted-foreground">Moyenne</p></CardContent></Card>
        <Card className="shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Offre Performante</CardTitle></CardHeader><CardContent><div className="text-lg font-bold truncate">Dev Full-Stack</div><p className="text-xs text-muted-foreground">55 candidatures</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Candidatures / Offre (Top 5)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ applications: { label: "Candidatures", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-full">
              <BarChart data={applicationsPerJobData} layout="vertical" margin={{ right: 20 }}>
                <CartesianGrid horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={120} />
                <ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="applications" fill="var(--color-applications)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Efficacité des Sources</CardTitle></CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={jobSourceEffectivenessData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {jobSourceEffectivenessData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie>
                  <RechartsTooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Temps pour Pourvoir / Département</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={{ avgDays: { label: "Jours Moyens", color: "hsl(var(--chart-2))" } }} className="h-[300px] w-full">
              <BarChart data={timeToFillByDeptData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} /><XAxis dataKey="department" tickLine={false} tickMargin={10} axisLine={false} /><YAxis unit="j" tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="avgDays" fill="var(--color-avgDays)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <Card className="shadow-lg"><CardHeader><CardTitle className="text-xl text-primary">Performance Détaillée</CardTitle>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Rechercher une offre..." className="pl-10 bg-background" /></div>
            <Select><SelectTrigger className="w-full md:w-[180px] bg-background"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="open">Ouvert</SelectItem><SelectItem value="closed">Fermé</SelectItem></SelectContent>
            </Select><Button variant="outline" className="bg-background w-full md:w-auto"><Filter className="mr-2 h-4 w-4" /> Appliquer</Button></div>
        </CardHeader>
        <CardContent>
          <Table><TableHeader><TableRow><TableHead className="w-[300px]">Titre</TableHead><TableHead>Statut</TableHead><TableHead className="text-center">Candidatures</TableHead><TableHead className="text-center">Vues</TableHead><TableHead className="text-center">Tx. Conv.</TableHead><TableHead className="text-center">Temps Pourvoir</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {jobAnalyticsData?.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium"><Link href={`/dashboard/jobs/${job.id}`} className="hover:text-primary hover:underline">{job.title}</Link></TableCell>
                  <TableCell><Badge variant="outline" className={cn(getStatusBadgeVariant(job.status))}>{job.status}</Badge></TableCell>
                  <TableCell className="text-center">{job.applicationsCount}</TableCell>
                  <TableCell className="text-center">{job.views}</TableCell>
                  <TableCell className="text-center">{job.views && job.applicationsCount ? ((job.applicationsCount/job.views)*100).toFixed(1) + '%' : 'N/A'}</TableCell>
                  <TableCell className="text-center">N/A</TableCell> {/* Replace with actual timeToFill data */}
                  <TableCell className="text-right"><Button variant="ghost" size="sm" asChild><Link href={`/dashboard/jobs/${job.id}`}>Détails</Link></Button></TableCell>
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

    