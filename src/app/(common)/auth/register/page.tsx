
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, User, Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";


export default function RegisterPage() {
  const { register, isAuthenticated, user, isLoading: authIsLoading } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "candidate",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data);
    if (success) {
      toast({
        title: "Inscription Réussie !",
        description: "Votre compte a été créé avec succès.",
      });
      const updatedUser = useAuthStore.getState().user;
      if (updatedUser?.role === 'candidate') {
        router.push('/jobs');
      } else if (updatedUser?.role === 'recruiter_unassociated') {
        router.push('/auth/recruiter-onboarding');
      } else if (updatedUser?.role === 'recruiter' || updatedUser?.role === 'admin') { // Should be rare to hit recruiter/admin directly after register
        router.push('/dashboard');
      }
       else {
        router.push('/');
      }
    } else {
      toast({
        title: "Échec de l'Inscription",
        description: useAuthStore.getState().error || "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'candidate') {
        router.push('/jobs');
      } else if (currentUser?.role === 'recruiter_unassociated') {
        router.push('/auth/recruiter-onboarding');
      } else if (currentUser?.role === 'recruiter' && currentUser.companyId) {
        router.push('/dashboard');
      } else if (currentUser?.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/'); // Fallback for other cases
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl w-full">
        <Card className="w-full shadow-xl order-last lg:order-first">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Créer un Compte</CardTitle>
            <CardDescription>Rejoignez TalentSphere et trouvez votre prochaine opportunité ou talent.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <ShadFormLabel htmlFor="fullName">Nom Complet</ShadFormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input id="fullName" type="text" placeholder="Votre nom complet" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <ShadFormLabel htmlFor="email">Adresse E-mail</ShadFormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input id="email" type="email" placeholder="vous@exemple.com" {...field} className="pl-10" />
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
                      <ShadFormLabel htmlFor="password">Mot de Passe</ShadFormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input id="password" type="password" placeholder="Créez un mot de passe sécurisé" {...field} className="pl-10" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <ShadFormLabel>Je suis un(e) :</ShadFormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="candidate" id="role-candidate" />
                            </FormControl>
                            <Label htmlFor="role-candidate" className="font-normal flex items-center">
                              <User className="mr-2 h-4 w-4 text-muted-foreground" /> Candidat
                            </Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="recruiter" id="role-recruiter" />
                            </FormControl>
                            <Label htmlFor="role-recruiter" className="font-normal flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" /> Recruteur / Entreprise
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={authIsLoading}>
                  {authIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  S'inscrire
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link href="/auth/login" legacyBehavior>
                  <a className="font-semibold text-primary hover:underline">
                    Connectez-vous ici
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
         <div className="hidden lg:block">
          <Image
            src="https://placehold.co/600x750.png"
            alt="Illustration d'inscription"
            width={600}
            height={750}
            className="rounded-xl shadow-xl object-cover"
            data-ai-hint="team diverse success"
          />
        </div>
      </div>
    </div>
  );
}
