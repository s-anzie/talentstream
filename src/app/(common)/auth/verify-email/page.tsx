
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, MailWarning, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"; // Required for JSX and hooks
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Vérification de votre adresse e-mail en cours...");

  useEffect(() => {
    if (token) {
      // Simulate API call to verify token
      setTimeout(() => {
        if (token === "valid-token-simulation") { // Simulate a valid token
          setStatus("success");
          setMessage("Votre adresse e-mail a été vérifiée avec succès ! Vous pouvez maintenant vous connecter.");
          toast({
            title: "Email Vérifié !",
            description: "Vous pouvez vous connecter.",
          });
        } else { // Simulate an invalid or expired token
          setStatus("error");
          setMessage("Le lien de vérification est invalide ou a expiré. Veuillez demander un nouveau lien.");
           toast({
            title: "Échec de la Vérification",
            description: "Lien invalide ou expiré.",
            variant: "destructive",
          });
        }
      }, 2000);
    } else {
      setStatus("error");
      setMessage("Aucun jeton de vérification fourni. Le lien est peut-être incorrect.");
       toast({
        title: "Erreur",
        description: "Jeton de vérification manquant.",
        variant: "destructive",
      });
    }
  }, [token, toast]);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 md:px-6">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          {status === "verifying" && <Loader2 className="mx-auto h-12 w-12 text-primary mb-4 animate-spin" />}
          {status === "success" && <MailCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />}
          {status === "error" && <MailWarning className="mx-auto h-12 w-12 text-destructive mb-4" />}
          <CardTitle className="text-3xl font-bold">
            {status === "verifying" && "Vérification en Cours"}
            {status === "success" && "Email Vérifié !"}
            {status === "error" && "Échec de la Vérification"}
          </CardTitle>
          <CardDescription className="mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <Button asChild className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Link href="/auth/login">Se Connecter</Link>
            </Button>
          )}
          {status === "error" && (
             <div className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                <Link href="/contact">Contacter le Support</Link>
                </Button>
                 <Button asChild className="w-full">
                <Link href="/auth/register">Renvoyer le lien de vérification (Bientôt)</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
