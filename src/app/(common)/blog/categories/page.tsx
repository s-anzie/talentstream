
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Archive, Tag, Search, List, Loader2 } from "lucide-react";
import Link from "next/link";
import { useFetchBlogCategories } from "@/hooks/useDataFetching";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCategoriesPage() {
  const { data: categories, isLoading, error } = useFetchBlogCategories();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <section className="text-center pt-8 pb-12 md:pb-16">
        <Archive className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Catégories du Blog
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
          Explorez nos articles par thèmes et trouvez facilement le contenu qui vous intéresse.
        </p>
      </section>

      <section className="mb-10 max-w-xl mx-auto">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Rechercher une catégorie..." className="pl-10 bg-background text-base"/>
        </div>
      </section>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader><div className="flex justify-between items-center"><Skeleton className="h-6 w-3/5" /><Skeleton className="h-6 w-1/5" /></div></CardHeader>
              <CardContent><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-destructive text-center">Erreur de chargement des catégories: {error.message}</p>}
      {!isLoading && !error && categories && categories.length > 0 && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.slug} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-primary hover:text-primary/80">
                    <Link href={`/blog?category=${category.slug}`} className="flex items-center">
                      <Tag className="mr-2 h-5 w-5" /> {category.name}
                    </Link>
                  </CardTitle>
                  <span className="text-sm font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-md">{category.postCount} articles</span>
                </div>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p></CardContent>
              <CardFooter><Button variant="outline" asChild className="w-full"><Link href={`/blog?category=${category.slug}`}>Explorer {category.name}</Link></Button></CardFooter>
            </Card>
          ))}
        </section>
      )}
       {!isLoading && !error && (!categories || categories.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <Archive className="mx-auto h-16 w-16 opacity-50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Aucune catégorie disponible.</h3>
            <p className="mt-2">Revenez bientôt pour découvrir nos articles !</p>
          </div>
      )}
      <div className="mt-12 text-center"><Button variant="secondary" asChild><Link href="/blog"><List className="mr-2 h-4 w-4" /> Voir tous les articles</Link></Button></div>
    </div>
  );
}
    