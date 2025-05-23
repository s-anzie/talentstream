
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, MapPin, Users, Globe, ExternalLink, Briefcase, Info, Star, MessageCircle, ArrowLeft, Loader2, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFetchCompanyDetails } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewFormSchema, type ReviewFormData, type CompanyReview } from '@/lib/types'; // Assuming CompanyReview is also in types
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export default function CompanyProfilePage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const { data: company, isLoading, error, setData: setCompanyData } = useFetchCompanyDetails(companyId);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Local state for reviews to see immediate additions
  const [companyReviews, setCompanyReviews] = useState<CompanyReview[]>([]);

  useEffect(() => {
    if (company?.reviews) {
      setCompanyReviews(company.reviews);
    }
  }, [company]);

  const reviewForm = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: "",
      author: "Visiteur Anonyme", // Could be prefilled if user is logged in
      rating: 0,
      text: "",
    },
  });

  const onSubmitReview = (data: ReviewFormData) => {
    console.log("Submitting review:", data);
    // Simulate API call & optimistic update
    const newReview: CompanyReview = {
      id: uuidv4(), // Generate a unique ID for the new review
      ...data,
      date: new Date().toISOString().split('T')[0], // Current date
    };
    setCompanyReviews(prevReviews => [...prevReviews, newReview]);

    // If you want to optimistically update the main company data (useful if reviews are part of company object)
    // setCompanyData(prevCompany => prevCompany ? ({
    //   ...prevCompany,
    //   reviews: [...(prevCompany.reviews || []), newReview]
    // }) : null);

    toast({
      title: "Avis Soumis !",
      description: "Merci pour votre retour. Votre avis a été enregistré (simulation).",
    });
    reviewForm.reset();
    setIsReviewDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
        <p>Chargement du profil de l'entreprise...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-12 text-center text-destructive">Erreur de chargement: {error.message}</div>;
  }

  if (!company) {
    return <div className="container mx-auto py-12 text-center">Profil d'entreprise non trouvé.</div>;
  }

  const activeJobsCount = Array.isArray(company.activeJobs) ? company.activeJobs.length : company.activeJobs || 0;

  return (
    <div className="bg-muted/20">
        <section className="relative">
            <Image
            src={company.coverImageUrl || "https://placehold.co/1200x300.png"}
            alt={`Image de couverture pour ${company.name}`}
            width={1200}
            height={300}
            className="w-full h-48 md:h-64 object-cover"
            data-ai-hint="office building modern"
            priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative -mt-16 md:-mt-24 flex flex-col md:flex-row items-end space-x-0 md:space-x-6">
                    <Image
                        src={company.logoUrl || "https://placehold.co/120x120.png"}
                        alt={`${company.name} logo`}
                        width={120}
                        height={120}
                        className="rounded-xl border-4 border-background bg-background shadow-lg"
                        data-ai-hint="company logo abstract"
                    />
                    <div className="pb-2 pt-4 md:pt-0 text-background md:text-foreground">
                        <h1 className="text-3xl md:text-4xl font-bold text-white md:text-primary">{company.name}</h1>
                        <p className="text-md md:text-lg text-white/90 md:text-foreground/80">{company.tagline}</p>
                    </div>
                    <div className="md:ml-auto pb-2">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                            <Link href={`/companies/${company.id}#company-jobs`}>Voir les Offres ({activeJobsCount})</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
        
        <div className="container mx-auto py-12 px-4 md:px-6">
         <Button variant="outline" size="sm" onClick={() => router.push("/companies")} className="mb-6">
            <ArrowLeft className="mr-1 h-4 w-4" /> Retour à la liste des entreprises
        </Button>
        
        <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="about"><Info className="mr-2 h-4 w-4" />À Propos</TabsTrigger>
            <TabsTrigger value="jobs"><Briefcase className="mr-2 h-4 w-4" />Offres d'Emploi</TabsTrigger>
            <TabsTrigger value="reviews"><Star className="mr-2 h-4 w-4" />Avis</TabsTrigger>
            <TabsTrigger value="gallery"><Users className="mr-2 h-4 w-4" />Galerie</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">À Propos de {company.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-lg text-foreground/80 leading-relaxed">{company.description}</p>
                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                            <div><h3 className="font-semibold text-primary mb-1">Secteur d'activité :</h3><p>{company.industry}</p></div>
                            <div><h3 className="font-semibold text-primary mb-1">Localisation :</h3><p className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-muted-foreground"/>{company.location}</p></div>
                            <div><h3 className="font-semibold text-primary mb-1">Taille :</h3><p className="flex items-center"><Users className="h-4 w-4 mr-1.5 text-muted-foreground"/>{company.size}</p></div>
                            <div><h3 className="font-semibold text-primary mb-1">Fondée en :</h3><p>{company.founded}</p></div>
                             <div><h3 className="font-semibold text-primary mb-1">Site Web :</h3>
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-secondary hover:underline">
                                    <Globe className="h-4 w-4 mr-1.5"/>{company.website} <ExternalLink className="ml-1 h-3 w-3"/>
                                </a>
                            </div>
                        </div>
                        {company.mission && (<div className="pt-4 border-t"><h3 className="text-xl font-semibold text-primary mb-2">Notre Mission</h3><p className="text-foreground/70">{company.mission}</p></div>)}
                        {company.vision && (<div className="pt-4 border-t"><h3 className="text-xl font-semibold text-primary mb-2">Notre Vision</h3><p className="text-foreground/70">{company.vision}</p></div>)}
                        {company.values && company.values.length > 0 && (
                            <div className="pt-4 border-t"><h3 className="text-xl font-semibold text-primary mb-2">Nos Valeurs</h3>
                                <div className="flex flex-wrap gap-2">
                                    {company.values.map(value => (<Badge key={value} variant="outline" className="bg-accent/10 text-accent-foreground/90">{value}</Badge>))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="jobs" id="company-jobs">
                <Card className="shadow-lg">
                    <CardHeader><CardTitle className="text-2xl text-primary">Offres d'Emploi chez {company.name} ({Array.isArray(company.activeJobs) ? company.activeJobs.length : 0})</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {company.activeJobs && Array.isArray(company.activeJobs) && company.activeJobs.length > 0 ? company.activeJobs.map(job => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg hover:text-primary"><Link href={`/jobs/${job.id}`}>{job.title}</Link></CardTitle>
                                    <CardDescription className="text-sm">
                                        <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1.5"/>{job.location}</span>
                                        <span className="flex items-center mt-1"><Briefcase className="h-3.5 w-3.5 mr-1.5"/>{job.type}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter><Button asChild size="sm"><Link href={`/jobs/${job.id}`}>Voir l'offre</Link></Button></CardFooter>
                            </Card>
                        )) : (<p className="text-muted-foreground text-center py-8">Aucune offre d'emploi active pour le moment.</p>)}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="reviews">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl text-primary">Avis sur {company.name}</CardTitle>
                            <CardDescription>Ce que les employés et candidats disent.</CardDescription>
                        </div>
                        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="mt-3 sm:mt-0"><Edit3 className="mr-2 h-4 w-4"/>Laisser un avis</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl text-primary">Donnez votre avis sur {company.name}</DialogTitle>
                                    <DialogDescription>Partagez votre expérience pour aider les autres.</DialogDescription>
                                </DialogHeader>
                                <Form {...reviewForm}>
                                    <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4 py-4">
                                        <FormField control={reviewForm.control} name="title" render={({ field }) => (
                                            <FormItem><FormLabel>Titre de votre avis</FormLabel><FormControl><Input placeholder="Ex: Super expérience !" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={reviewForm.control} name="author" render={({ field }) => (
                                            <FormItem><FormLabel>Votre Nom (ou "Anonyme")</FormLabel><FormControl><Input placeholder="Votre nom" {...field} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={reviewForm.control} name="rating" render={({ field }) => (
                                            <FormItem><FormLabel>Votre Note (sur 5)</FormLabel>
                                                <FormControl>
                                                    <RadioGroup onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()} className="flex space-x-2">
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <FormItem key={num} className="flex items-center space-x-1">
                                                                <FormControl><RadioGroupItem value={num.toString()} id={`rating-${num}`} /></FormControl>
                                                                <FormLabel htmlFor={`rating-${num}`} className="font-normal flex items-center">
                                                                    {num} <Star className="ml-1 h-4 w-4 text-yellow-400 fill-yellow-400"/>
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                            <FormMessage /></FormItem>
                                        )}/>
                                        <FormField control={reviewForm.control} name="text" render={({ field }) => (
                                            <FormItem><FormLabel>Votre Avis Détaillé</FormLabel><FormControl><Textarea placeholder="Partagez votre expérience..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                                        )}/>
                                        <DialogFooter className="pt-4">
                                            <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
                                            <Button type="submit" disabled={reviewForm.formState.isSubmitting}>
                                                {reviewForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                Soumettre l'Avis
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {companyReviews && companyReviews.length > 0 ? companyReviews.map(review => (
                            <Card key={review.id} className="bg-muted/30">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">{review.title}</CardTitle>
                                        <div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>))}</div>
                                    </div>
                                    <CardDescription className="text-xs">Par: {review.author} - Le {new Date(review.date).toLocaleDateString('fr-FR')}</CardDescription>
                                </CardHeader>
                                <CardContent><p className="text-sm text-foreground/90">{review.text}</p></CardContent>
                            </Card>
                        )) : (<p className="text-muted-foreground text-center py-8">Aucun avis pour cette entreprise pour le moment.</p>)}
                    </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="gallery">
                <Card className="shadow-lg">
                    <CardHeader><CardTitle className="text-2xl text-primary">Galerie de {company.name}</CardTitle><CardDescription>Aperçu de la vie chez {company.name}.</CardDescription></CardHeader>
                    <CardContent>
                        {company.gallery && company.gallery.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {company.gallery.map((imageUrl, index) => (
                                    <div key={index} className="aspect-video rounded-lg overflow-hidden shadow-md relative">
                                        <Image src={imageUrl} alt={`Galerie ${company.name} ${index + 1}`} layout="fill" objectFit="cover" data-ai-hint="office team event"/>
                                    </div>
                                ))}
                            </div>
                        ) : (<p className="text-muted-foreground text-center py-8">Aucune image dans la galerie.</p>)}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        </div>
    </div>
  );
}
