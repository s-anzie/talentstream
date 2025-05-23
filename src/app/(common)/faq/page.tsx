
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchFaqItems } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";

export default function FaqPage() {
  const { data: faqItems, isLoading, error } = useFetchFaqItems();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center py-12 md:py-16">
        <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Questions Fréquemment Posées
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Trouvez des réponses aux questions les plus courantes sur TalentSphere. Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
        </p>
      </section>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Trouver des Réponses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          )}
          {error && <p className="text-destructive text-center">Erreur de chargement de la FAQ: {error.message}</p>}
          {!isLoading && !error && faqItems && faqItems.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger className="text-lg text-left hover:text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/80 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.answer }}>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          {!isLoading && !error && (!faqItems || faqItems.length === 0) && (
            <p className="text-center text-muted-foreground py-10">Aucune question fréquemment posée disponible pour le moment.</p>
          )}
        </CardContent>
      </Card>

      <section className="mt-16 text-center">
         <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Vous ne trouvez pas votre réponse ?
        </h2>
        <p className="text-lg text-foreground/80 max-w-xl mx-auto mb-8">
          Notre équipe est là pour vous aider. Contactez-nous directement pour toute question spécifique.
        </p>
        <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Link href="/contact">Contactez Notre Support</Link>
        </Button>
      </section>
    </div>
  );
}

    