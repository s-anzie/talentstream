
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, LayoutGrid, PlusCircle, Eye, Edit3, Trash2, Loader2, ImageOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFetchUserPortfolioItems, mockApiServices } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

export default function ManagePortfolioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: portfolioItems, isLoading, error, refetch } = useFetchUserPortfolioItems(user?.id || null);

  const handleDeleteItem = async (itemId: string, itemTitle?: string) => {
    if (!user?.id) return;
    try {
      await mockApiServices.deleteUserPortfolioItem(itemId); // Use the imported service
      toast({ title: "Élément Supprimé", description: `"${itemTitle || 'Cet élément'}" a été retiré de votre portfolio.` });
      refetch?.();
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de supprimer l'élément.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_,i) => <Skeleton key={i} className="h-72 w-full"/>)}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-destructive text-center">Erreur: {error.message}</p>;

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" onClick={() => router.push('/user')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil candidat
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-2xl text-primary"><LayoutGrid className="mr-3 h-7 w-7"/>Mon Portfolio</CardTitle>
            <CardDescription>Mettez en valeur vos projets, réalisations et études de cas pour impressionner les recruteurs.</CardDescription>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/user/portfolio/add"><PlusCircle className="mr-2 h-4 w-4"/> Ajouter un Élément</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {portfolioItems && portfolioItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map(item => (
                    <Card key={item.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow">
                        <CardHeader className="p-0">
                            {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.title} width={400} height={250} className="rounded-t-lg object-cover aspect-video w-full" data-ai-hint="project abstract design" />
                            ) : (
                                <div className="aspect-video w-full bg-muted rounded-t-lg flex items-center justify-center">
                                    <ImageOff className="h-16 w-16 text-muted-foreground"/>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-4 flex-grow">
                            <CardTitle className="text-lg text-primary mb-1 line-clamp-2">{item.title}</CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{item.description}</p>
                            {item.tags && <div className="flex flex-wrap gap-1 mb-2">{item.tags.split(',').map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag.trim()}</Badge>)}</div>}
                        </CardContent>
                        <CardFooter className="border-t pt-3 flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild><Link href={`/user/portfolio/${item.id}`}><Eye className="mr-1.5 h-4 w-4"/>Voir</Link></Button>
                            <Button variant="outline" size="sm" asChild><Link href={`/user/portfolio/${item.id}/edit`}><Edit3 className="mr-1.5 h-4 w-4"/>Modifier</Link></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600"><Trash2 className="mr-1.5 h-4 w-4"/>Supprimer</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Supprimer "{item.title}"?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteItem(item.id, item.title)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <LayoutGrid className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                <h3 className="text-xl font-semibold text-foreground">Votre portfolio est vide.</h3>
                <p className="mt-2">Ajoutez des projets pour montrer vos compétences et réalisations.</p>
                <Button asChild className="mt-6"><Link href="/user/portfolio/add">Commencer à Ajouter</Link></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    