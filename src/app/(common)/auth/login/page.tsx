
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isAuthenticated, user, isLoading: authIsLoading, error: authError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      toast({
        title: "Connexion Réussie",
        description: "Vous êtes maintenant connecté.",
      });
      const nextUrl = searchParams.get("next");
      const loggedInUser = useAuthStore.getState().user;

      if (nextUrl) {
        router.push(nextUrl);
      } else if (loggedInUser?.role === 'candidate') {
        router.push('/jobs');
      } else if (loggedInUser?.role === 'recruiter_unassociated') {
        router.push('/auth/recruiter-onboarding');
      } else if (loggedInUser?.role === 'recruiter' || loggedInUser?.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } else {
      toast({
        title: "Échec de la Connexion",
        description: useAuthStore.getState().error || "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const nextUrl = searchParams.get("next");
      const currentUser = useAuthStore.getState().user;
      if (nextUrl) {
        router.push(nextUrl);
      } else if (currentUser?.role === 'candidate') {
        router.push('/jobs');
      } else if (currentUser?.role === 'recruiter_unassociated') {
        router.push('/auth/recruiter-onboarding');
      } else if (currentUser?.role === 'recruiter' && currentUser.companyId) {
        router.push('/dashboard');
      } else if (currentUser?.role === 'admin') {
        router.push('/dashboard');
      } else {
        // If recruiter without companyId but not 'recruiter_unassociated', still send to onboarding
        // This could happen if the user was already 'recruiter' but company association was lost/reset
        if(currentUser?.role === 'recruiter' && !currentUser.companyId) {
            router.push('/auth/recruiter-onboarding');
        } else {
            router.push('/');
        }
      }
    }
  }, [isAuthenticated, router, searchParams]);


  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-4xl w-full">
        <div className="hidden lg:block">
          <Image
            src="https://placehold.co/600x700.png"
            alt="Illustration de connexion"
            width={600}
            height={700}
            className="rounded-xl shadow-xl object-cover"
            data-ai-hint="authentication security"
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Connexion</CardTitle>
            <CardDescription>Accédez à votre compte TalentSphere.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <ShadFormLabel htmlFor="email">Adresse E-mail</ShadFormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="vous@exemple.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <ShadFormLabel htmlFor="password">Mot de Passe</ShadFormLabel>
                        <Link href="/auth/forgot-password" legacyBehavior>
                          <a className="text-sm text-primary hover:underline">
                            Mot de passe oublié ?
                          </a>
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            id="password"
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={authIsLoading}>
                  {authIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se Connecter
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link href="/auth/register" legacyBehavior>
                  <a className="font-semibold text-primary hover:underline">
                    Inscrivez-vous ici
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
