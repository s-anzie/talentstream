
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Keep this Label from ui
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form"; // Use ShadFormLabel
import { KeyRound, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation"; // For getting token from URL
import React from "react"; // Required for JSX

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: "Le mot de passe doit comporter au moins 6 caractères." }),
  confirmPassword: z.string().min(6, { message: "Veuillez confirmer votre mot de passe." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // Error will be shown on confirmPassword field
});
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Example: get token from URL query like ?token=xyz
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    console.log("Resetting password with token:", token, "and data:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "Mot de Passe Réinitialisé !",
      description: "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
    });
    router.push("/auth/login");
  };

  if (!token) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 md:px-6 text-center">
        <KeyRound className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Lien Invalide ou Expiré</h1>
        <p className="text-muted-foreground mt-2">
          Ce lien de réinitialisation de mot de passe n'est pas valide ou a expiré.
        </p>
        <Button asChild className="mt-6">
          <Link href="/auth/forgot-password">Demander un nouveau lien</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 md:px-6">
       <div className="grid lg:grid-cols-2 gap-12 items-center max-w-4xl w-full">
         <div className="hidden lg:block">
          <Image
            src="https://placehold.co/600x700.png"
            alt="Illustration de réinitialisation de mot de passe"
            width={600}
            height={700}
            className="rounded-xl shadow-xl object-cover"
            data-ai-hint="security shield"
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Réinitialiser le Mot de Passe</CardTitle>
            <CardDescription>
              Choisissez un nouveau mot de passe sécurisé pour votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <ShadFormLabel htmlFor="newPassword">Nouveau Mot de Passe</ShadFormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            id="newPassword" 
                            type="password" 
                            placeholder="********" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <ShadFormLabel htmlFor="confirmPassword">Confirmer le Nouveau Mot de Passe</ShadFormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            placeholder="********" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mettre à Jour le Mot de Passe
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" legacyBehavior>
                <a className="font-semibold text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Connexion
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
