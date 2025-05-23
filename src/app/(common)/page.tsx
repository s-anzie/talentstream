
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Users, Send, Lightbulb, Star, ShieldCheck, Clock, BarChart3, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-6">
            Transformez Votre Recrutement avec TalentSphere
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
            La solution SaaS tout-en-un conçue pour les PME. Simplifiez vos embauches, attirez les meilleurs talents et construisez l'équipe de vos rêves, sans effort.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/register">Commencer Gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">En Savoir Plus</Link>
            </Button>
          </div>
          <div className="mt-16">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="Tableau de bord TalentSphere"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="dashboard interface"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Découvrez la Puissance de TalentSphere
          </h2>
          <p className="text-center text-foreground/70 mb-12 md:mb-16 max-w-2xl mx-auto">
            Des outils intelligents pour chaque étape de votre processus de recrutement, de la publication de l'offre à l'intégration du candidat.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Tableau d'Offres Intuitif</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Créez, gérez et affichez facilement vos offres d'emploi avec une mise en page responsive et attrayante.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Gestion des Profils Candidats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Permettez aux chercheurs d'emploi de créer des profils riches, mettant en valeur leurs compétences et expériences.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Candidatures Directes et Simplifiées</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Les candidats postulent directement via la plateforme avec un processus simple et efficace.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md w-fit mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Suggestion IA de Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Notre outil intelligent vous aide à choisir les meilleures catégories d'emploi pour une portée maximale.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Pourquoi les PME Choisissent TalentSphere ?
              </h2>
              <p className="text-foreground/80 mb-8 text-lg">
                TalentSphere est spécifiquement conçu pour relever les défis de recrutement des petites et moyennes entreprises, en leur offrant des outils puissants généralement réservés aux grandes structures.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ShieldCheck className="h-7 w-7 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Optimisez Votre Processus</h4>
                    <p className="text-foreground/70">Gagnez du temps et améliorez l'efficacité de chaque étape du recrutement.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-7 w-7 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Attirez et Engagez les Meilleurs Talents</h4>
                    <p className="text-foreground/70">Présentez votre entreprise de manière professionnelle et offrez une expérience candidat exceptionnelle.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-7 w-7 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Réduisez les Délais et Coûts d'Embauche</h4>
                    <p className="text-foreground/70">Automatisez les tâches répétitives et concentrez-vous sur les candidats prometteurs.</p>
                  </div>
                </li>
                 <li className="flex items-start">
                  <BarChart3 className="h-7 w-7 text-secondary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Prenez des Décisions Éclairées</h4>
                    <p className="text-foreground/70">Utilisez nos analyses pour comprendre vos performances de recrutement et les améliorer.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Personnes collaborant"
                width={600}
                height={600}
                className="rounded-xl shadow-xl"
                data-ai-hint="teamwork success"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            Commencez en 3 Étapes Simples
          </h2>
          <p className="text-center text-foreground/70 mb-12 md:mb-16 max-w-xl mx-auto">
            Lancer votre prochaine campagne de recrutement n'a jamais été aussi facile.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Inscrivez-vous</h3>
              <p className="text-foreground/70">Créez votre compte entreprise en quelques minutes et configurez votre profil.</p>
            </div>
            <div className="p-6 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Publiez Vos Offres</h3>
              <p className="text-foreground/70">Utilisez nos modèles ou créez des offres personnalisées et diffusez-les largement.</p>
            </div>
            <div className="p-6 border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
               <div className="p-4 bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Gérez & Recrutez</h3>
              <p className="text-foreground/70">Suivez les candidatures, collaborez avec votre équipe et trouvez la perle rare.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Aimé par les Entreprises en Croissance
          </h2>
          <p className="text-foreground/70 mb-12 max-w-xl mx-auto">
            Découvrez pourquoi nos clients nous font confiance pour développer leurs équipes.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-left shadow-lg">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Image src={`https://placehold.co/40x40.png`} alt={`Client ${i}`} width={40} height={40} className="rounded-full" data-ai-hint="person avatar" />
                        <div>
                            <CardTitle className="text-lg">Nom du Client {i}</CardTitle>
                            <CardDescription>Poste, Entreprise</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    "TalentSphere a révolutionné notre manière de recruter. C'est simple, efficace et incroyablement puissant pour une PME comme la nôtre." (Témoignage à venir)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Révolutionner Votre Recrutement ?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
            Rejoignez TalentSphere aujourd'hui et découvrez l'avenir de l'embauche pour les PME. Commencez gratuitement et voyez la différence.
          </p>
          <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground hover:border-primary-foreground/90" asChild>
            <Link href="/auth/register">Inscrivez-vous Maintenant</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
