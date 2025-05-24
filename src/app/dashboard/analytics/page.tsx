"use client";

import { BarChart3, Briefcase, Users, Clock, TrendingUp, AlertTriangle, Download, ArrowRight, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, FunnelChart, Funnel, LabelList, Tooltip as RechartsTooltip } from "recharts";
import Link from "next/link";
import { useFetchAnalyticsOverviewData } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

// Solution 1: Correction du type de l'iconMap
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  FileText,
  BarChart3,
};

// Solution 2: Alternative avec une fonction helper
const getIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Briefcase,
    Users,
    Clock,
    TrendingUp,
    FileText,
    BarChart3,
  };
  return icons[iconName] || Briefcase;
};

const chartConfigCandidates = {
  new: { label: "Nvx Candidats", color: "hsl(var(--chart-1))" },
  hired: { label: "Embauchés", color: "hsl(var(--chart-2))" },
};

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const { data: analyticsData, isLoading, error } = useFetchAnalyticsOverviewData(user?.companyId || null);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" /> <Skeleton className="h-80 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) return <p className="text-destructive text-center">Erreur de chargement des analyses: {error.message}</p>;
  if (!analyticsData) return <p className="text-muted-foreground text-center py-10">Aucune donnée d'analyse disponible pour le moment.</p>;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div><CardTitle className="text-2xl text-primary flex items-center"><BarChart3 className="mr-3 h-7 w-7" /> Aperçu des Analyses</CardTitle><CardDescription>Suivez vos indicateurs clés et optimisez votre recrutement.</CardDescription></div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Select defaultValue="last_30_days"><SelectTrigger className="w-full sm:w-[180px] bg-background"><SelectValue placeholder="Période" /></SelectTrigger>
                    <SelectContent><SelectItem value="last_7_days">7 jours</SelectItem><SelectItem value="last_30_days">30 jours</SelectItem><SelectItem value="last_90_days">90 jours</SelectItem><SelectItem value="all_time">Total</SelectItem></SelectContent>
                </Select>
                 <Button variant="outline" className="w-full sm:w-auto bg-background" disabled><Download className="mr-2 h-4 w-4"/> Exporter (Bientôt)</Button>
            </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.kpis.map((stat) => {
          // Solution 1: Utilisation directe avec le bon type
          const IconComponent = iconMap[stat.iconName] || Briefcase;
          
          // Solution 2: Alternative avec la fonction helper
          // const IconComponent = getIcon(stat.iconName);
          
          return (
            <Card key={stat.title} className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary">{stat.title}</CardTitle>
                <IconComponent className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend?.startsWith('+') ? 'text-green-600' : stat.trend?.startsWith('-') ? 'text-red-600': 'text-muted-foreground'}`}>
                  {stat.trend}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="link" size="sm" asChild className="p-0 h-auto text-xs text-primary">
                  <Link href={stat.title.includes("Offres") ? "/dashboard/analytics/jobs" : "/dashboard/analytics/candidates"}>
                    Voir détails <ArrowRight className="ml-1 h-3 w-3"/>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow"><CardHeader><CardTitle className="text-xl text-primary flex items-center"><Briefcase className="mr-2 h-6 w-6" /> Analyses Offres</CardTitle><CardDescription>Performances de vos offres.</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Vues, candidatures, taux de conversion, etc.</p></CardContent><CardFooter><Button asChild><Link href="/dashboard/analytics/jobs">Voir Analyses Offres <ArrowRight className="ml-2 h-4 w-4"/></Link></Button></CardFooter></Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow"><CardHeader><CardTitle className="text-xl text-primary flex items-center"><Users className="mr-2 h-6 w-6" /> Analyses Candidats</CardTitle><CardDescription>Comprenez votre vivier de talents.</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Efficacité sources, acquisition, pipeline.</p></CardContent><CardFooter><Button asChild><Link href="/dashboard/analytics/candidates">Voir Analyses Candidats <ArrowRight className="ml-2 h-4 w-4"/></Link></Button></CardFooter></Card>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Flux de Candidats</CardTitle><CardDescription>Nouveaux vs. embauchés (6 derniers mois).</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigCandidates} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={analyticsData.candidateFlowData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} /><XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} /><YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="new" fill="var(--color-new)" radius={4} /><Bar dataKey="hired" fill="var(--color-hired)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Sources des Candidats</CardTitle><CardDescription>Répartition par canal d'acquisition.</CardDescription></CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart><Pie data={analyticsData.candidateSourcesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {analyticsData.candidateSourcesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} /><Legend content={<ChartLegendContent nameKey="name" />} />
                  </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-md"><CardHeader><CardTitle className="text-xl text-primary">Entonnoir de Recrutement</CardTitle><CardDescription>De la vue à l'embauche.</CardDescription></CardHeader>
        <CardContent className="h-[400px] w-full flex justify-center">
            <ResponsiveContainer width="80%" height="100%">
                <FunnelChart><RechartsTooltip />
                    <Funnel dataKey="value" data={analyticsData.recruitmentFunnelData} isAnimationActive><LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" /></Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </CardContent>
         <CardFooter><p className="text-xs text-muted-foreground">Conversion typique à chaque étape.</p></CardFooter>
      </Card>
      <Card className="shadow-md bg-amber-50 border-amber-200"><CardHeader><CardTitle className="text-xl text-amber-700 flex items-center"><AlertTriangle className="mr-2 h-6 w-6" /> Fonctionnalités Avancées (Bientôt)</CardTitle></CardHeader><CardContent><p className="text-amber-600">Rapports personnalisables, analyses prédictives et comparaisons sectorielles.</p></CardContent></Card>
    </div>
  );
}