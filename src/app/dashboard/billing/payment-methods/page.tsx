
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, CreditCard, PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFetchPaymentMethods } from '@/hooks/useDataFetching'; // Assuming hook exists
import { useAuthStore } from '@/stores/authStore';
import { addPaymentMethod, deletePaymentMethod, setPrimaryPaymentMethod } from '@/lib/mock-api-services'; // Mock services
import type { PaymentMethod } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge"; // Added Badge import
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: paymentMethods, isLoading, error, setData: setPaymentMethodsData } = useFetchPaymentMethods(user?.companyId || null);

  // State for add/edit dialog (simplified for now)
  // const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  // const [selectedMethod, setSelectedMethod] = useState<Partial<PaymentMethod> | null>(null);

  const handleAddMethod = async () => {
    // For now, adds a dummy method. In real app, this would open a Stripe Elements form or similar.
    if (!user?.companyId) return;
    try {
        const newMethod = await addPaymentMethod(user.companyId, { type: 'Visa', last4: Math.floor(1000 + Math.random() * 9000).toString(), expiry: '12/27' });
        setPaymentMethodsData(prev => prev ? [...prev, newMethod] : [newMethod]);
        toast({title: "Méthode de Paiement Ajoutée (Simulation)"});
    } catch (e) {
        toast({title: "Erreur", description: "Impossible d'ajouter la méthode.", variant: "destructive"});
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    if (!user?.companyId) return;
    try {
        await deletePaymentMethod(user.companyId, methodId);
        setPaymentMethodsData(prev => prev?.filter(pm => pm.id !== methodId) || null);
        toast({title: "Méthode de Paiement Supprimée"});
    } catch (e) {
        toast({title: "Erreur", description: "Impossible de supprimer la méthode.", variant: "destructive"});
    }
  };
  
  const handleSetPrimary = async (methodId: string) => {
    if(!user?.companyId) return;
    try {
        await setPrimaryPaymentMethod(user.companyId, methodId);
        setPaymentMethodsData(prev => prev?.map(pm => ({...pm, isPrimary: pm.id === methodId})) || null);
        toast({title: "Méthode Principale Définie"});
    } catch (e) {
        toast({title: "Erreur", description: "Impossible de définir comme principale.", variant: "destructive"});
    }
  };


  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-20 w-full"/>
            <Skeleton className="h-48 w-full"/>
        </div>
    );
  }
  if (error) return <p className="text-destructive text-center">Erreur de chargement des méthodes de paiement: {error.message}</p>;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Facturation
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center text-2xl text-primary"><CreditCard className="mr-3 h-7 w-7"/>Méthodes de Paiement</CardTitle>
            <CardDescription>Gérez vos cartes enregistrées pour le paiement de votre abonnement TalentSphere.</CardDescription>
          </div>
          <Button onClick={handleAddMethod} disabled> {/* Disabled until proper form */}
            <PlusCircle className="mr-2 h-4 w-4"/> Ajouter une Méthode (Bientôt)
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods && paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map(pm => (
                <div key={pm.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                        <span className="font-medium text-foreground">{pm.type} se terminant par •••• {pm.last4}</span>
                        <span className="block text-sm text-muted-foreground">Expire le {pm.expiry}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    {pm.isPrimary && <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Principal</Badge>}
                    {!pm.isPrimary && (
                        <Button variant="outline" size="sm" onClick={() => handleSetPrimary(pm.id)}>Définir comme principal</Button>
                    )}
                    {/* <Button variant="ghost" size="sm" onClick={() => { setSelectedMethod(pm); setIsManageModalOpen(true);}} disabled><Edit className="mr-1.5 h-4 w-4"/>Modifier (Bientôt)</Button> */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600" disabled={pm.isPrimary}>
                                <Trash2 className="mr-1.5 h-4 w-4"/>Supprimer
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Supprimer cette méthode ?</AlertDialogTitle><AlertDialogDescription>Cette action ne peut pas être annulée. Assurez-vous d'avoir une autre méthode si celle-ci est la principale.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMethod(pm.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="mx-auto h-16 w-16 opacity-50 mb-4"/>
                <h3 className="text-xl font-semibold text-foreground">Aucune méthode de paiement enregistrée.</h3>
                <p className="mt-2">Ajoutez une méthode pour gérer votre abonnement.</p>
            </div>
          )}
        </CardContent>
         <CardFooter>
            <p className="text-xs text-muted-foreground">Vos informations de paiement sont sécurisées par notre partenaire de traitement des paiements (Stripe, etc. - exemple).</p>
        </CardFooter>
      </Card>
      {/* Add/Edit Modal Placeholder - To be implemented with Stripe Elements or similar for real security
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{selectedMethod?.id ? "Modifier" : "Ajouter"} Méthode de Paiement</DialogTitle><DialogDescription>Entrez les détails de votre carte.</DialogDescription></DialogHeader>
            <div className="py-4">Formulaire Stripe Elements ici</div>
            <DialogFooter><Button onClick={() => setIsManageModalOpen(false)}>Fermer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      */}
    </div>
  );
}
    
