
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Eye, Link as LinkIcon, Tag, ImageOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useFetchUserPortfolioItemDetails } from '@/hooks/useDataFetching';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function PortfolioItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;

  const { data: item, isLoading, error } = useFetchUserPortfolioItemDetails(itemId);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-24 w-full"/>
            <Skeleton className="h-80 w-full"/>
        </div>
    );
  }

  if (error || !item) {
    return (
      <div className="space-y-6 text-center">
        <Button variant="outline" size="sm" onClick={() => router.push('/user/portfolio')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portfolio
        </Button>
        <p className="text-destructive">Erreur: {error?.message || "Élément de portfolio non trouvé."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/portfolio')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au portfolio
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div>
                <CardTitle className="text-2xl md:text-3xl text-primary flex items-center"><Eye className="mr-3 h-7 w-7"/>{item.title}</CardTitle>
                <CardDescription>Détails de cet élément de votre portfolio.</CardDescription>
            </div>
            <Button asChild variant="outline" className="w-full sm:w-auto"><Link href={`/user/portfolio/${itemId}/edit`}><Edit className="mr-2 h-4 w-4"/>Modifier</Link></Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
            {item.imageUrl ? (
                <div className="relative aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-md">
                    <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="contain" data-ai-hint="project image abstract detail"/>
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center text-muted-foreground bg-muted/50 p-8 rounded-md">
                    <ImageOff className="h-16 w-16 mb-2"/>
                    <p>Aucune image fournie pour ce projet.</p>
                </div>
            )}
            <div>
                <h3 className="text-xl font-semibold text-secondary mb-2">Description</h3>
                <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{item.description}</p>
            </div>

            {item.projectUrl && (
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-1 flex items-center"><LinkIcon className="mr-2 h-5 w-5"/>Lien vers le Projet</h3>
                    <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{item.projectUrl}</a>
                </div>
            )}
             {item.tags && item.tags.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 flex items-center"><Tag className="mr-2 h-5 w-5"/>Mots-clés / Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {item.tags.split(',').map(tag => tag.trim()).filter(tag => tag).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-accent/10 text-accent-foreground/90">{tag}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>
        <CardFooter className="border-t pt-4">
             <p className="text-xs text-muted-foreground">Utilisez cette page pour partager les détails de vos réalisations.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    