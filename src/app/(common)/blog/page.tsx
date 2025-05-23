
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, UserCircle, MessageSquare, Search, Tag, ArrowRight, Newspaper, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFetchBlogPosts } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogHomePage() {
  const { data: blogPosts, isLoading, error } = useFetchBlogPosts();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center py-12 md:py-16">
        <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Le Blog TalentSphere
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-10">
          Restez informé des dernières tendances en recrutement, des conseils carrière et des actualités de la plateforme TalentSphere.
        </p>
      </section>

      <section className="mb-12 p-6 bg-muted/30 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="blog-search" className="block text-sm font-medium text-foreground/90 mb-1">Rechercher un article</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="blog-search" placeholder="Mots-clés, titre..." className="pl-10 bg-background"/>
            </div>
          </div>
          <div>
            <label htmlFor="blog-category" className="block text-sm font-medium text-foreground/90 mb-1">Catégorie</label>
            <Select>
              <SelectTrigger id="blog-category" className="w-full bg-background">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="conseils-carriere">Conseils Carrière</SelectItem>
                <SelectItem value="tendances-rh">Tendances RH</SelectItem>
                <SelectItem value="management">Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col shadow-lg">
              <Skeleton className="w-full h-48" />
              <CardHeader><Skeleton className="h-4 w-1/4 mb-2" /><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="flex-grow space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent>
              <CardFooter className="border-t pt-4 flex justify-between items-center"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-24" /></CardFooter>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-destructive text-center">Erreur de chargement des articles: {error.message}</p>}
      {!isLoading && !error && blogPosts && blogPosts.length > 0 && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block">
                <Image
                  src={post.imageUrl || "https://placehold.co/600x400.png"}
                  alt={`Image pour ${post.title}`}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint="blog abstract tech"
                />
              </Link>
              <CardHeader>
                <Link href={`/blog/categories?category=${encodeURIComponent(post.category)}`} className="text-sm text-primary font-medium hover:underline">{post.category}</Link>
                <CardTitle className="text-xl mt-1 leading-tight hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                <div className="mt-4 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-1.5" /> {post.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1.5" /> {new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                   <MessageSquare className="h-4 w-4 mr-1.5" /> {post.commentsCount || 0} commentaire(s)
                </div>
                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                  <Link href={`/blog/${post.slug}`}>
                    Lire la Suite <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}
      {!isLoading && !error && (!blogPosts || blogPosts.length === 0) && (
          <p className="text-center text-muted-foreground py-10">Aucun article de blog disponible pour le moment.</p>
      )}
      {!isLoading && blogPosts && blogPosts.length > 0 && (
        <section className="mt-16 flex justify-center">
            <Button variant="outline" className="mr-2" disabled>Précédent</Button>
            <Button variant="outline">Suivant</Button>
        </section>
      )}
    </div>
  );
}

    