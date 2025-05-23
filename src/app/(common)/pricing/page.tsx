
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, HelpCircle, Briefcase } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Essentiel",
    price: "49€",
    period: "/mois",
    description: "Pour les très petites entreprises (1-10 employés) qui démarrent.",
    features: [
      "Jusqu'à 5 offres d'emploi actives",
      "Fonctionnalités ATS de base",
      "Suivi des candidatures",
      "Support par email",
    ],
    cta: "Commencer avec Essentiel",
    href: "/auth/register?plan=essentiel",
    popular: false,
  },
  {
    name: "Business",
    price: "129€",
    period: "/mois",
    description: "Pour les PME en croissance (11-50 employés) cherchant à optimiser.",
    features: [
      "Jusqu'à 15 offres d'emploi actives",
      "Fonctionnalités ATS avancées",
      "Outils de collaboration d'équipe",
      "Analyses et rapports",
      "Support prioritaire (email & téléphone)",
    ],
    cta: "Choisir Business",
    href: "/auth/register?plan=business",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur Devis",
    period: "",
    description: "Pour les entreprises établies (51-250+ employés) avec des besoins complexes.",
    features: [
      "Offres d'emploi illimitées",
      "Suite complète de fonctionnalités",
      "Personnalisation avancée",
      "Intégrations sur mesure",
      "Support dédié et formations",
      "Accès API",
    ],
    cta: "Contacter les Ventes",
    href: "/contact?subject=Demande%20devis%20Enterprise",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Des Plans Tarifaires Flexibles pour Votre Croissance
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Choisissez le plan TalentSphere qui correspond le mieux à la taille et aux ambitions de votre entreprise. Tous nos plans sont conçus pour vous offrir un maximum de valeur.
        </p>
      </section>

      <section className="grid lg:grid-cols-3 gap-8 items-stretch">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-2 border-primary shadow-2xl relative' : 'shadow-lg'}`}>
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full shadow-md">
                Le Plus Populaire
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl md:text-3xl text-primary mb-2">{tier.name}</CardTitle>
              <p className="text-3xl md:text-4xl font-bold text-foreground">
                {tier.price}
                {tier.period && <span className="text-base font-normal text-muted-foreground">{tier.period}</span>}
              </p>
              <CardDescription className="pt-2 min-h-[3em]">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button size="lg" className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`} asChild>
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      {/* FAQ Section Placeholder */}
      <section className="py-16 md:py-24 text-center">
         <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Questions Fréquemment Posées
        </h2>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
          Vous avez des questions sur nos tarifs ou nos fonctionnalités ? Nous sommes là pour vous aider.
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link href="/faq">Consulter Notre FAQ</Link>
        </Button>
      </section>

      {/* Custom Plan Section */}
      <section className="py-12 md:py-16 bg-muted/30 rounded-lg p-8 md:p-12 text-center">
        <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Besoin d'une Solution Sur Mesure ?
        </h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
          Si vos besoins dépassent nos plans standards, ou si vous avez des exigences particulières en matière d'intégration ou de volume, n'hésitez pas à nous contacter. Notre équipe est prête à discuter d'une solution personnalisée.
        </p>
        <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground" asChild>
          <Link href="/contact?subject=Demande%20de%20plan%20personnalise">Discutons de Vos Besoins</Link>
        </Button>
      </section>
    </div>
  );
}
