
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, PlusCircle, BarChart3, FileText, MessageSquare, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy Data
const kpis = [
  { title: "Offres Actives", value: "12", icon: Briefcase, trend: "+2 cette semaine" },
  { title: "Nouvelles Candidatures", value: "34", icon: Users, trend: "+5 aujourd'hui" },
  { title: "Entretiens Planifiés", value: "8", icon: FileText, trend: "Pour cette semaine" },
  { title: "Taux de Réponse Moyen", value: "75%", icon: BarChart3, trend: "Amélioration de 5%" },
];

const recentActivities = [
  { id: "act1", description: "Nouvelle candidature de John Doe pour 'Développeur Frontend'", time: "Il y a 15 min", type: "application" },
  { id: "act2", description: "Entretien planifié avec Alice Martin pour 'Chef de Projet'", time: "Il y a 1h", type: "interview" },
  { id: "act3", description: "L'offre 'Ingénieur DevOps' a reçu 5 nouvelles vues", time: "Il y a 3h", type: "job_view" },
  { id: "act4", description: "Nouveau message de Bob Williams concernant 'Data Analyst'", time: "Il y a 5h", type: "message" },
];

const topPerformingJobs = [
    { id: "job1", title: "Développeur Full-Stack", applications: 45, views: 250, status: "Ouvert" },
    { id: "job2", title: "Designer UX/UI Senior", applications: 30, views: 180, status: "Ouvert" },
    { id: "job3", title: "Ingénieur Commercial IT", applications: 22, views: 150, status: "En attente d'approbation" },
];

export default function DashboardHomePage() {
  const companyName = "Tech Solutions Inc."; // Dummy company name

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Bienvenue sur votre Tableau de Bord, {companyName}!</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Gérez efficacement votre processus de recrutement et trouvez les meilleurs talents.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/dashboard/jobs/create"><PlusCircle className="mr-2 h-4 w-4" /> Publier une Nouvelle Offre</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/candidates"><Users className="mr-2 h-4 w-4" /> Voir la Base de Candidats</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/analytics"><BarChart3 className="mr-2 h-4 w-4" /> Consulter les Analyses</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.map(activity => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === "application" && <Users className="h-5 w-5 text-secondary" />}
                      {activity.type === "interview" && <FileText className="h-5 w-5 text-blue-500" />}
                      {activity.type === "job_view" && <Eye className="h-5 w-5 text-purple-500" />}
                      {activity.type === "message" && <MessageSquare className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm text-foreground/90">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
            )}
          </CardContent>
           <CardFooter className="border-t pt-4">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Voir toute l'activité</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Top Performing Jobs */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Offres d'Emploi Performantes</CardTitle>
          <CardDescription>Un aperçu des offres qui attirent le plus d'attention.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Titre de l'Offre</TableHead>
                        <TableHead className="text-center">Candidatures</TableHead>
                        <TableHead className="text-center">Vues</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topPerformingJobs.map((job) => (
                        <TableRow key={job.id} className="hover:bg-muted/10">
                            <TableCell>
                                <Link href={`/dashboard/jobs/${job.id}`} className="font-medium text-primary hover:underline">
                                    {job.title}
                                </Link>
                            </TableCell>
                            <TableCell className="text-center">{job.applications}</TableCell>
                            <TableCell className="text-center">{job.views}</TableCell>
                            <TableCell className="text-center">
                                <Badge 
                                    variant={job.status === "Ouvert" ? "secondary" : "outline"}
                                    className={job.status === "Ouvert" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                                >
                                    {job.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/dashboard/jobs/${job.id}/analytics`}>Voir détails</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
         <CardFooter className="border-t pt-4">
            <Button asChild variant="secondary">
                <Link href="/dashboard/jobs">Gérer toutes les offres</Link>
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
