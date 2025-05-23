
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Mail, Send, UserPlus2 } from "lucide-react";
import { InviteTeamMemberFormData, inviteTeamMemberFormSchema } from "@/lib/types";
import { inviteTeamMember } from "@/lib/mock-api-services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function InviteTeamMemberPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuthStore();

  const form = useForm<InviteTeamMemberFormData>({
    resolver: zodResolver(inviteTeamMemberFormSchema),
    defaultValues: { email: "", role: undefined },
  });

  async function onSubmit(data: InviteTeamMemberFormData) {
    if (!user?.companyId) {
        toast({ title: "Erreur", description: "ID de l'entreprise non trouvé.", variant: "destructive" });
        return;
    }
    try {
      const result = await inviteTeamMember(user.companyId, data.email, data.role);
      if (result.success) {
        toast({ title: "Invitation Envoyée !", description: `Une invitation a été envoyée à ${data.email}.` });
        form.reset();
        router.push("/dashboard/team");
      } else {
        throw new Error("L'envoi de l'invitation a échoué.");
      }
    } catch (error: any) {
      toast({ title: "Erreur d'Invitation", description: error.message || "Une erreur est survenue.", variant: "destructive" });
    }
  }

  return (
    <Card className="shadow-xl max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-primary flex items-center"><UserPlus2 className="mr-3 h-8 w-8" /> Inviter Membre</CardTitle>
            <Button variant="outline" asChild><Link href="/dashboard/team"><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Link></Button>
        </div>
        <CardDescription>Entrez l'email et assignez un rôle au nouveau membre.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel className="text-lg">Email</FormLabel><FormControl><div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="email" placeholder="membre@exemple.com" {...field} className="pl-10"/>
              </div></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem><FormLabel className="text-lg">Rôle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un rôle" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Recruteur">Recruteur</SelectItem><SelectItem value="Manager RH">Manager RH</SelectItem>
                    <SelectItem value="Administrateur">Administrateur</SelectItem><SelectItem value="Collaborateur (Lecture seule)">Collaborateur (Lecture seule)</SelectItem>
                  </SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Send className="mr-2 h-5 w-5" />
                {form.formState.isSubmitting ? "Envoi..." : "Envoyer l'Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    