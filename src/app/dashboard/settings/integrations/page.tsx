
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { ArrowLeft, Building, Calendar, Linkedin, Mail, Slack, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const integrationsList = [
  {
    name: "LinkedIn",
    icon: Linkedin,
    description: "Diffusez vos offres et gérez les candidatures LinkedIn directement.",
    status: "Non connecté",
    action: "Connecter",
    logoUrl: "https://placehold.co/40x40.png?text=Li"
  },
  {
    name: "Google Calendar",
    icon: Calendar,
    description: "Synchronisez les entretiens avec votre Google Calendar.",
    status: "Connecté",
    action: "Gérer",
    logoUrl: "https://placehold.co/40x40.png?text=G"
  },
  {
    name: "Outlook Calendar",
    icon: Calendar,
    description: "Synchronisez les entretiens avec votre calendrier Outlook.",
    status: "Non connecté",
    action: "Connecter",
    logoUrl: "https://placehold.co/40x40.png?text=O"
  },
  {
    name: "Slack",
    icon: Slack,
    description: "Recevez des notifications de recrutement dans vos canaux Slack.",
    status: "Non connecté",
    action: "Connecter",
    logoUrl: "https://placehold.co/40x40.png?text=Sl"
  },
   {
    name: "Zapier",
    icon: Zap,
    description: "Connectez TalentSphere à des milliers d'autres applications via Zapier.",
    status: "Non connecté",
    action: "Explorer",
    logoUrl: "https://placehold.co/40x40.png?text=Zp"
  },
   {
    name: "Votre SIRH (Exemple)",
    icon: Building,
    description: "Exportez les données des candidats embauchés vers votre SIRH.",
    status: "Configuration requise",
    action: "Configurer",
    logoUrl: "https://placehold.co/40x40.png?text=HR"
  },
];

export default function IntegrationsPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl text-primary flex items-center">
            <Zap className="mr-3 h-7 w-7" /> Gestion des Intégrations
        </CardTitle>
        <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
        </Button>
      </div>
      <CardDescription>
        Connectez TalentSphere à vos outils et plateformes préférés pour automatiser vos workflows et améliorer votre productivité.
      </CardDescription>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((integration) => (
          <Card key={integration.name} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Image src={integration.logoUrl} alt={`${integration.name} logo`} width={40} height={40} className="rounded-md" data-ai-hint="software logo"/>
              <div>
                <CardTitle className="text-lg text-primary">{integration.name}</CardTitle>
                 <Badge variant={integration.status === "Connecté" ? "secondary" : "outline"} className={integration.status === "Connecté" ? "bg-green-100 text-green-700" : "text-muted-foreground"}>
                    {integration.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant={integration.status === "Connecté" ? "outline" : "default"} 
                className="w-full"
                disabled // Placeholder
              >
                <integration.icon className="mr-2 h-4 w-4" /> {integration.action} (Bientôt)
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card className="mt-12 bg-accent/10 border-accent/30">
        <CardHeader>
            <CardTitle className="text-lg text-accent-foreground/90">Demander une nouvelle intégration ?</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-accent-foreground/80 mb-3">
                Si vous ne trouvez pas l'outil que vous souhaitez connecter, faites-le nous savoir ! Nous cherchons constamment à étendre nos capacités d'intégration.
            </p>
            <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/20 hover:text-accent-foreground" asChild>
                <Link href="/contact?subject=Demande%20d%27integration">
                    <Mail className="mr-2 h-4 w-4" /> Suggérer une Intégration
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
