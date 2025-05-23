
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Users, Search, Filter, ExternalLink, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFetchCompanies } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesPage() {
  const { data: companies, isLoading, error } = useFetchCompanies();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center pt-8 pb-12 md:pb-16">
        <Building className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Découvrez des Entreprises Innovantes
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Explorez les profils des PME qui recrutent sur TalentSphere et trouvez votre futur employeur.
        </p>
      </section>

      <section className="mb-10 p-6 bg-muted/30 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="company-keywords" className="block text-sm font-medium text-foreground/90 mb-1">Nom ou secteur d'activité</label>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="company-keywords" placeholder="Ex: Tech Solutions, E-commerce..." className="pl-10 bg-background"/>
            </div>
          </div>
          <div>
            <label htmlFor="company-location" className="block text-sm font-medium text-foreground/90 mb-1">Lieu</label>
            <Input id="company-location" placeholder="Ex: Paris, Lyon, Télétravail..." className="bg-background"/>
          </div>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 md:mt-0 mt-4">
            <Search className="mr-2 h-5 w-5" /> Rechercher
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
           <Select>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                  <SelectValue placeholder="Secteur d'activité" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="marketing">Marketing & Publicité</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
              </SelectContent>
          </Select>
           <Select>
              <SelectTrigger className="w-full md:w-[180px] bg-background">
                  <SelectValue placeholder="Taille de l'entreprise" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">Toutes tailles</SelectItem>
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="200+">200+ employés</SelectItem>
              </SelectContent>
          </Select>
          <Button variant="outline" className="bg-background">
              <Filter className="mr-2 h-4 w-4" /> Plus de Filtres
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-6">Entreprises en Vedette</h2>
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="flex flex-col shadow-lg">
                <CardHeader><Skeleton className="h-10 w-10 rounded-lg" /><div className="space-y-2"><Skeleton className="h-4 w-[150px]" /><Skeleton className="h-3 w-[100px]" /></div></CardHeader>
                <CardContent className="flex-grow space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-28" /></CardFooter>
              </Card>
            ))}
          </div>
        )}
        {error && <p className="text-destructive">Erreur de chargement des entreprises: {error.message}</p>}
        {!isLoading && !error && companies && companies.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Image src={company.logoUrl || `https://placehold.co/80x80.png?text=${company.name.substring(0,1)}`} alt={`${company.name} logo`} width={60} height={60} className="rounded-lg border" data-ai-hint="company logo building" />
                    <div>
                      <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                        <Link href={`/companies/${company.id}`}>{company.name}</Link>
                      </CardTitle>
                      <CardDescription className="text-sm">{company.industry}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{company.tagline}</p>
                  <div className="space-y-1.5 text-sm text-foreground/80">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" /> {company.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" /> {company.size}
                    </div>
                    {company.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-400 fill-yellow-400" /> {company.rating}/5 étoiles
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">{company.activeJobs} offres actives</span>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href={`/companies/${company.id}`}>
                      Voir le Profil <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && !error && (!companies || companies.length === 0) && (
          <p className="text-center text-muted-foreground">Aucune entreprise à afficher pour le moment.</p>
        )}
        {/* Pagination Placeholder */}
        {!isLoading && companies && companies.length > 0 && (
            <div className="mt-12 flex justify-center">
                <Button variant="outline" className="mr-2">Précédent</Button>
                <Button variant="outline">Suivant</Button>
            </div>
        )}
      </section>
    </div>
  );
}

    