"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, RotateCcw, Search, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Changed from next/navigation
import React, { useState, useEffect, Suspense } from 'react';

function AdvancedFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get current search params

  // States for filters - initialize from URL or defaults
  const [keywords, setKeywords] = useState(searchParams.get('keywords') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  // ... other filter states

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (keywords) params.set('keywords', keywords);
    if (location) params.set('location', location);
    // ... set other params

    // Redirect to job listing page with new filters
    router.push(`/jobs?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setKeywords('');
    setLocation('');
    // ... reset other states
    router.push('/jobs'); // Or /jobs/filters to clear current params from URL if staying
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Filter className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl md:text-3xl text-primary">Filtres Avancés</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <XCircle className="h-6 w-6 text-muted-foreground hover:text-destructive"/>
            </Button>
          </div>
          <CardDescription className="mt-1">Affinez votre recherche d'offres d'emploi.</CardDescription>
        </CardHeader>
        <CardContent className="py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label htmlFor="keywords-adv" className="font-semibold">Mots-clés</Label><Input id="keywords-adv" placeholder="Ex: Développeur React, IA..." className="mt-1" value={keywords} onChange={(e) => setKeywords(e.target.value)} /></div>
            <div><Label htmlFor="location-adv" className="font-semibold">Lieu</Label><Input id="location-adv" placeholder="Ex: Paris, Télétravail..." className="mt-1" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
          </div>
          <div><Label className="font-semibold mb-2 block">Type de Contrat</Label><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Temps plein", "Temps partiel", "CDI", "CDD", "Stage", "Freelance", "Alternance"].map(type => (<div key={type} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50"><Checkbox id={`type-${type.toLowerCase().replace(/\s+/g, '-')}`} /><Label htmlFor={`type-${type.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-normal cursor-pointer">{type}</Label></div>))}
          </div></div>
          <div><Label htmlFor="experience-level" className="font-semibold">Niveau d'Expérience</Label>
            <Select><SelectTrigger id="experience-level" className="mt-1"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
              <SelectContent><SelectItem value="entry">Débutant (0-2 ans)</SelectItem><SelectItem value="mid">Intermédiaire (2-5 ans)</SelectItem><SelectItem value="senior">Confirmé (5+ ans)</SelectItem><SelectItem value="all">Tous niveaux</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label className="font-semibold mb-2 block">Secteur</Label><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["Tech", "Marketing", "Finance", "Santé", "Éducation", "Vente", "Design"].map(sector => (<div key={sector} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50"><Checkbox id={`sector-${sector.toLowerCase()}`} /><Label htmlFor={`sector-${sector.toLowerCase()}`} className="text-sm font-normal cursor-pointer">{sector}</Label></div>))}
          </div></div>
          <div><Label className="font-semibold">Télétravail</Label><RadioGroup defaultValue="any" className="mt-2 space-y-1">
            <div className="flex items-center space-x-2"><RadioGroupItem value="any" id="remote-any" /><Label htmlFor="remote-any" className="font-normal">Indifférent</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="full" id="remote-full" /><Label htmlFor="remote-full" className="font-normal">Complet</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="hybrid" id="remote-hybrid" /><Label htmlFor="remote-hybrid" className="font-normal">Hybride</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="remote-none" /><Label htmlFor="remote-none" className="font-normal">Sur site uniquement</Label></div>
          </RadioGroup></div>
          <div><Label htmlFor="salary-range" className="font-semibold">Fourchette Salariale Annuelle (Brut)</Label><div className="mt-2 flex items-center space-x-3"><span className="text-sm text-muted-foreground">30k€</span><Slider id="salary-range" defaultValue={[40, 80]} min={30} max={150} step={5} className="flex-1"/><span className="text-sm text-muted-foreground">150k€+</span></div><p className="text-xs text-center text-muted-foreground mt-1">Sélection actuelle: 40k€ - 80k€ (exemple)</p></div>
          <div><Label htmlFor="posted-date" className="font-semibold">Date de Publication</Label>
            <Select><SelectTrigger id="posted-date" className="mt-1"><SelectValue placeholder="Toutes dates" /></SelectTrigger>
              <SelectContent><SelectItem value="any">Toutes dates</SelectItem><SelectItem value="24h">Dernières 24h</SelectItem><SelectItem value="7d">7 derniers jours</SelectItem><SelectItem value="14d">14 derniers jours</SelectItem><SelectItem value="30d">30 derniers jours</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t pt-6">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleResetFilters}><RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser</Button>
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90" onClick={handleApplyFilters}><Search className="mr-2 h-5 w-5" /> Appliquer Filtres</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AdvancedFiltersPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <CardTitle className="text-2xl md:text-3xl text-primary">Chargement...</CardTitle>
              </div>
            </div>
            <CardDescription className="mt-1">Initialisation des filtres...</CardDescription>
          </CardHeader>
          <CardContent className="py-8">
            <div className="space-y-6">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AdvancedFiltersContent />
    </Suspense>
  );
}