
"use client";

import { useState, useEffect } from "react";
import { CreditCard, FileText, Download, Edit, AlertCircle, RotateCcw, ShieldCheck, PlusCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFetchBillingInfo, useFetchInvoices } from "@/hooks/useDataFetching";
import { useAuthStore } from "@/stores/authStore";
import { updateBillingInfo as apiUpdateBillingInfo } from "@/lib/mock-api-services";
import { BillingInfo, PaymentMethod } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const initialBillingFormValues: Partial<BillingInfo> = {
  companyName: "", addressLine1: "", addressLine2: "", city: "", postalCode: "", country: "", billingEmail: "",
};

export default function BillingPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { data: billingInfo, isLoading: isLoadingBillingInfo, error: billingError, setData: setBillingInfoData } = useFetchBillingInfo(user?.companyId || null);
  const { data: invoices, isLoading: isLoadingInvoices, error: invoicesError } = useFetchInvoices(user?.companyId || null);
  
  const [isEditBillingInfoOpen, setIsEditBillingInfoOpen] = useState(false);
  const [billingForm, setBillingForm] = useState<Partial<BillingInfo>>(initialBillingFormValues);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]); // Placeholder, could be fetched

  useEffect(() => {
    if (billingInfo) {
      setBillingForm({
        companyName: billingInfo.companyName,
        addressLine1: billingInfo.addressLine1,
        addressLine2: billingInfo.addressLine2,
        city: billingInfo.city,
        postalCode: billingInfo.postalCode,
        country: billingInfo.country,
        billingEmail: billingInfo.billingEmail,
      });
      // Simulate fetching payment methods linked to billing info
      setPaymentMethods([{ id: "pm1", type: "Visa", last4: "4242", expiry: "12/25", isPrimary: true }]);
    }
  }, [billingInfo]);

  const handleCancelSubscription = () => {
    toast({ title: "Demande d'Annulation Reçue", description: "Votre demande d'annulation a été prise en compte.", variant: "default" });
  };

  const handleSaveBillingInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.companyId) return;
    try {
      await apiUpdateBillingInfo(user.companyId, billingForm);
      setBillingInfoData?.(prev => prev ? { ...prev, ...billingForm } : null); // Optimistic update
      toast({ title: "Infos Facturation Mises à Jour", description: "Vos informations ont été sauvegardées." });
      setIsEditBillingInfoOpen(false);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder les informations.", variant: "destructive" });
    }
  };

  const handleBillingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({ ...prev, [name]: value }));
  };

  if (isLoadingBillingInfo || isLoadingInvoices) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full" /> <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" /> <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (billingError || invoicesError) {
    return <p className="text-destructive text-center">Erreur de chargement: {billingError?.message || invoicesError?.message}</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg"><CardHeader><CardTitle className="text-2xl text-primary flex items-center"><CreditCard className="mr-3 h-7 w-7" /> Facturation & Abonnement</CardTitle><CardDescription>Gérez votre abonnement, paiements et factures.</CardDescription></CardHeader></Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle className="text-xl text-primary">Votre Abonnement Actuel</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {billingInfo ? (<>
            <div className="p-4 border rounded-lg bg-primary/5">
              <h3 className="text-2xl font-semibold text-secondary">{billingInfo.planName}</h3>
              <p className="text-xl font-bold text-foreground">{billingInfo.price}</p>
              <p className="text-sm text-muted-foreground">Renouvellement le: {billingInfo.renewalDate}</p>
            </div>
            <div><h4 className="font-medium text-foreground/90 mb-2">Fonctionnalités incluses :</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                {billingInfo.features?.map(feature => <li key={feature}>{feature}</li>)}
              </ul>
            </div>
          </>) : <p>Aucun plan actif.</p>}
        </CardContent>
        <CardFooter className="border-t pt-6 flex flex-col sm:flex-row gap-3 justify-start">
          <Button asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto"><Link href="/pricing">Changer d'Abonnement</Link></Button>
          <AlertDialog><AlertDialogTrigger asChild><Button variant="outline" className="w-full sm:w-auto">Annuler l'Abonnement</Button></AlertDialogTrigger>
            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Sûr de vouloir annuler ?</AlertDialogTitle><AlertDialogDescription>L'accès aux fonctionnalités prendra fin à la période de facturation en cours.</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Rester Abonné</AlertDialogCancel><AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Confirmer Annulation</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-xl text-primary">Méthodes de Paiement</CardTitle><Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4" /> Ajouter (Bientôt)</Button></CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (<div className="space-y-4">
            {paymentMethods.map(pm => (<div key={pm.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20">
                <div className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-muted-foreground" /><div><span className="font-medium">{pm.type} se terminant par {pm.last4}</span><span className="block text-xs text-muted-foreground">Expire le {pm.expiry}</span></div></div>
                <div className="flex items-center gap-2">{pm.isPrimary && <Badge variant="secondary" className="bg-green-100 text-green-700">Principal</Badge>}<Button variant="ghost" size="sm" className="text-xs" disabled>Modifier</Button><Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive/80" disabled>Supprimer</Button></div>
            </div>))}</div>) : (<p className="text-sm text-muted-foreground">Aucune méthode enregistrée.</p>)}
           <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-sm text-blue-700"><ShieldCheck className="h-5 w-5"/>Vos infos de paiement sont sécurisées.</div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle className="text-xl text-primary">Historique des Factures</CardTitle><CardDescription>Consultez vos factures.</CardDescription></CardHeader>
        <CardContent>
          {invoices && invoices.length > 0 ? (<div className="overflow-x-auto"><Table>
            <TableHeader><TableRow><TableHead>N° Facture</TableHead><TableHead>Date</TableHead><TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{invoices.map((invoice) => (<TableRow key={invoice.id}><TableCell className="font-medium">{invoice.id.toUpperCase()}</TableCell><TableCell>{invoice.date}</TableCell><TableCell>{invoice.amount}</TableCell>
                <TableCell><Badge variant={invoice.status === "Payée" ? "secondary" : "destructive"} className={invoice.status === "Payée" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>{invoice.status}</Badge></TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm" asChild><Link href={invoice.pdfLink} target="_blank"><Download className="mr-2 h-4 w-4" /> PDF</Link></Button></TableCell></TableRow>))}
            </TableBody></Table></div>) : (<p className="text-sm text-muted-foreground">Aucune facture.</p>)}
        </CardContent>
        {invoices && invoices.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle className="text-xl text-primary">Infos Facturation</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {billingInfo ? (<>
            <div><h4 className="font-medium text-sm text-muted-foreground">Adresse</h4><p className="text-foreground/90">{billingForm.companyName}<br/>{billingForm.addressLine1}{billingForm.addressLine2 && <><br/>{billingForm.addressLine2}</>}<br/>{billingForm.postalCode} {billingForm.city}, {billingForm.country}</p></div>
            <div><h4 className="font-medium text-sm text-muted-foreground">Email Facturation</h4><p className="text-foreground/90">{billingForm.billingEmail}</p></div>
          </>) : <p>Infos non disponibles.</p>}
            <Dialog open={isEditBillingInfoOpen} onOpenChange={setIsEditBillingInfoOpen}>
              <DialogTrigger asChild><Button variant="outline" size="sm" className="mt-2"><Edit className="mr-2 h-4 w-4" /> Modifier</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader><DialogTitle>Modifier Infos Facturation</DialogTitle><DialogDescription>Mettez à jour votre adresse et e-mail.</DialogDescription></DialogHeader>
                <form onSubmit={handleSaveBillingInfo} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="companyName" className="text-right col-span-1">Entreprise</Label><Input id="companyName" name="companyName" value={billingForm.companyName} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="addressLine1" className="text-right col-span-1">Adresse</Label><Input id="addressLine1" name="addressLine1" value={billingForm.addressLine1} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="addressLine2" className="text-right col-span-1">Adresse 2</Label><Input id="addressLine2" name="addressLine2" value={billingForm.addressLine2} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="postalCode" className="text-right col-span-1">Code Postal</Label><Input id="postalCode" name="postalCode" value={billingForm.postalCode} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="city" className="text-right col-span-1">Ville</Label><Input id="city" name="city" value={billingForm.city} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="country" className="text-right col-span-1">Pays</Label><Input id="country" name="country" value={billingForm.country} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="billingEmail" className="text-right col-span-1">Email Fact.</Label><Input id="billingEmail" name="billingEmail" type="email" value={billingForm.billingEmail} onChange={handleBillingFormChange} className="col-span-3" /></div>
                  <DialogFooter><Button type="submit">Sauvegarder</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </CardContent>
      </Card>

      <Card className="shadow-md border-accent/30 bg-accent/5">
        <CardHeader><CardTitle className="text-lg text-accent-foreground/90 flex items-center"><AlertCircle className="mr-2 h-5 w-5 text-accent" /> Une question ?</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-accent-foreground/80 mb-3">Consultez notre <Link href="/faq" className="underline hover:text-accent">FAQ</Link> ou <Link href="/contact" className="underline hover:text-accent">contactez notre support</Link>.</p>
           <Button variant="outline" size="sm" className="border-accent/50 text-accent hover:bg-accent/20 hover:text-accent-foreground" asChild><Link href="/contact?subject=Question%20Facturation">Support Facturation</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}

    