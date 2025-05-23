
"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Tag, MessageSquare, ArrowLeft, Facebook, Twitter, Linkedin, Link as LinkIcon, ThumbsUp, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFetchBlogPostDetails, useFetchBlogPosts } from "@/hooks/useDataFetching"; // Added useFetchBlogPosts for related
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: post, isLoading, error } = useFetchBlogPostDetails(slug);
  // Fetch a few posts for "related" section, could be improved with actual related logic
  const { data: allPosts } = useFetchBlogPosts(); 
  const relatedPosts = allPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];


  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-3/4 mb-3" />
                <div className="flex items-center space-x-4"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-1/3" /></div>
                <div className="mt-4 space-x-2"><Skeleton className="h-6 w-16 inline-block" /><Skeleton className="h-6 w-20 inline-block" /></div>
              </CardHeader>
              <CardContent className="py-8">
                <Skeleton className="w-full h-64 md:h-96 rounded-lg mb-8" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
              </CardContent>
              <CardFooter className="border-t py-6 flex justify-between"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></CardFooter>
            </Card>
          </article>
          <aside className="lg:col-span-1 space-y-8">
            <Skeleton className="h-48 w-full" /> <Skeleton className="h-64 w-full" />
          </aside>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-12 text-center text-destructive">Erreur de chargement de l'article: {error.message}</div>;
  }
  if (!post) {
    return <div className="container mx-auto py-12 text-center">Article non trouvé.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Blog
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <article className="lg:col-span-2">
          <Card className="shadow-xl">
            <CardHeader className="border-b">
              <Link href={`/blog/categories?category=${encodeURIComponent(post.category)}`} className="text-sm text-primary font-semibold hover:underline">{post.category}</Link>
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary mt-2">{post.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-3">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={post.authorAvatar} alt={post.author} data-ai-hint="person avatar" />
                    <AvatarFallback>{post.author?.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <span>Par {post.author}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  <span>{new Date(post.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="mr-2 mb-2 text-xs bg-accent/10 text-accent-foreground/80 hover:bg-accent/20">
                      <Tag className="h-3 w-3 mr-1" /> {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="py-8">
              <Image
                src={post.imageUrl || "https://placehold.co/1200x600.png"}
                alt={`Image principale pour ${post.title}`}
                width={1200}
                height={600}
                className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8 shadow-md"
                priority
                data-ai-hint="blog technology abstract"
              />
              <div
                className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary/80 prose-img:rounded-md prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>Contenu non disponible.</p>" }}
              />
            </CardContent>
             <CardFooter className="border-t py-6 flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <Button variant="outline" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes || 0} J'aime
                    </Button>
                    <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" /> {post.commentsCount || 0} Commentaires
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">Partager:</span>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><LinkIcon className="h-5 w-5" /></Button>
                </div>
            </CardFooter>
          </Card>

          <section id="comments" className="mt-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                    <MessageSquare className="mr-3 h-6 w-6" /> Commentaires ({/* dummyComments.length */ 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4 mb-8">
                  <div><Textarea placeholder="Écrivez votre commentaire..." rows={4} /></div>
                  <div className="flex justify-end"><Button>Soumettre le Commentaire</Button></div>
                </form>
                <div className="space-y-6">
                 {/* Placeholder for actual comments */}
                </div>
                 {/* {dummyComments.length === 0 && ( */}
                    <p className="text-muted-foreground text-center py-4">Soyez le premier à commenter ! (Commentaires désactivés pour la démo)</p>
                 {/* )} */}
              </CardContent>
            </Card>
          </section>
        </article>

        <aside className="lg:col-span-1 space-y-8">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarImage src={post.authorAvatar} alt={post.author} data-ai-hint="person avatar" />
                <AvatarFallback>{post.author?.substring(0,2)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{post.author}</CardTitle>
              <CardDescription>Auteur chez TalentSphere.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Button variant="outline" size="sm">Voir tous les articles de {post.author}</Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-xl text-primary">Articles Similaires</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {relatedPosts.map(related => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <Image src={related.imageUrl || "https://placehold.co/80x60.png"} alt={related.title} width={80} height={60} className="rounded object-cover" data-ai-hint={related.slug || "blog abstract"}/>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">{related.title}</p>
                    <p className="text-xs text-muted-foreground">{related.category}</p>
                  </div>
                </Link>
              ))}
              {relatedPosts.length === 0 && <p className="text-sm text-muted-foreground">Aucun article similaire trouvé.</p>}
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-xl text-primary">Tags Populaires</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["Recrutement", "CV", "PME", "IA", "Carrière", "Entretien"].map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-accent/10 text-accent-foreground/80 hover:bg-accent/20 cursor-pointer">
                    {tag}
                  </Badge>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

    