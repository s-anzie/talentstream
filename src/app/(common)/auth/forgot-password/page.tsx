
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel as ShadFormLabel, FormMessage } from "@/components/ui/form";
import { Mail, HelpCircle, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import React from "react"; // Required for JSX

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Une adresse e-mail valide est requise." }),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false); // Local loading state for this form

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Forgot password request for:", data.email);
    setIsLoading(false);
    toast({
      title: "Demande Envoyée",
      description: "Si un compte existe pour cet e-mail, vous recevrez des instructions pour réinitialiser votre mot de passe.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-4xl w-full">
         <div className="hidden lg:block">
          <Image
            src="https://placehold.co/600x700.png"
            alt="Illustration de mot de passe oublié"
            width={600}
            height={700}
            className="rounded-xl shadow-xl object-cover"
            data-ai-hint="security key lock"
          />
        </div>
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Mot de Passe Oublié ?</CardTitle>
            <CardDescription>
              Entrez votre e-mail pour recevoir un lien de réinitialisation.
            </CardDescription>
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Envoyer le Lien
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
