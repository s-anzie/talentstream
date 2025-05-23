
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Eye, Heart, Building } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          À Propos de TalentSphere
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          Notre mission est de révolutionner le recrutement pour les PME en fournissant une plateforme puissante, intuitive et accessible qui connecte les entreprises avec les meilleurs talents.
        </p>
        <Image
          src="https://placehold.co/1000x400.png"
          alt="Équipe TalentSphere travaillant ensemble"
          width={1000}
          height={400}
          className="rounded-xl shadow-lg mx-auto"
          data-ai-hint="team collaboration office"
        />
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Notre Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simplifier et optimiser le processus de recrutement pour les PME, en leur donnant les outils pour attirer, évaluer et embaucher les meilleurs talents, favorisant ainsi leur croissance et leur succès.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Notre Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Devenir la plateforme de recrutement de référence pour les PME à travers le monde, reconnue pour son innovation, son efficacité et son impact positif sur l'écosystème de l'emploi.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-3">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary">Nos Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Innovation, Orientation client, Intégrité, Collaboration et Excellence. Ces principes guident chacune de nos décisions et actions pour offrir le meilleur service possible.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 md:py-16 bg-muted/30 rounded-lg p-8 md:p-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              L'Histoire de TalentSphere
            </h2>
            <p className="text-foreground/80 mb-4 text-lg">
              TalentSphere est née de la conviction que les PME méritent les mêmes outils de recrutement sophistiqués que les grandes entreprises, mais adaptés à leurs besoins spécifiques et à leurs budgets.
            </p>
            <p className="text-foreground/70 mb-4">
              Fondée par une équipe passionnée d'experts en RH et en technologie, nous avons constaté les défis auxquels sont confrontées les petites et moyennes entreprises pour attirer et retenir les talents. C'est pourquoi nous avons créé TalentSphere : une solution SaaS complète, conçue pour simplifier chaque étape du cycle de recrutement.
            </p>
            <p className="text-foreground/70">
              Notre objectif est de vous permettre de vous concentrer sur ce qui compte le plus : trouver les bonnes personnes pour faire grandir votre entreprise.
            </p>
          </div>
          <div className="relative aspect-video">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Graphique illustrant la croissance grâce au recrutement"
              width={600}
              height={450}
              className="rounded-xl shadow-xl"
              data-ai-hint="growth chart startup"
            />
          </div>
        </div>
      </section>
      
      {/* Team Section (Placeholder) */}
      <section className="py-12 md:py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Rencontrez Notre Équipe (Bientôt !)
        </h2>
        <p className="text-foreground/70 mb-10 max-w-xl mx-auto">
          Nous sommes une équipe diversifiée de professionnels passionnés, unis par l'objectif de transformer le recrutement pour les PME.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="pt-6">
                <Image src={`https://placehold.co/150x150.png`} alt={`Membre de l'équipe ${i}`} width={120} height={120} className="rounded-full mx-auto mb-4" data-ai-hint="person avatar" />
                <h3 className="text-lg font-semibold text-foreground">Nom du Membre {i}</h3>
                <p className="text-sm text-primary">Poste</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 text-center bg-gradient-to-r from-primary to-secondary rounded-lg text-primary-foreground">
        <Building className="h-16 w-16 mx-auto mb-6 text-accent" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Prêt à Transformer Votre Recrutement ?
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/90">
          Découvrez comment TalentSphere peut aider votre PME à attirer et recruter les meilleurs talents.
        </p>
        <div className="space-x-4">
          <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground hover:border-primary-foreground/90" asChild>
            <Link href="/pricing">Voir Nos Tarifs</Link>
          </Button>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/contact">Contactez-Nous</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
