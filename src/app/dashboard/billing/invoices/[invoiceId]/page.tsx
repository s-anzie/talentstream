
"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, FileDigit, Printer, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFetchInvoiceDetails } from '@/hooks/useDataFetching';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.invoiceId as string;
  
  const { data: invoice, isLoading, error } = useFetchInvoiceDetails(invoiceId);

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48"/>
            <Skeleton className="h-24 w-full"/>
            <Skeleton className="h-[400px] w-full"/>
        </div>
    );
  }
  if (error || !invoice) {
      return (
        <div className="space-y-6 text-center">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing/invoices')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux factures
            </Button>
            <p className="text-destructive">Erreur: {error?.message || "Facture non trouvée."}</p>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing/invoices')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux factures
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
                <CardTitle className="flex items-center text-2xl text-primary"><FileDigit className="mr-3 h-7 w-7"/>Facture #{invoice.id.toUpperCase()}</CardTitle>
                <CardDescription>Détails de votre facture du {new Date(invoice.date).toLocaleDateString('fr-FR')}.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Imprimer</Button>
                <Button asChild className="w-full sm:w-auto"><Link href={invoice.pdfLink} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4"/> Télécharger PDF</Link></Button>
            </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border rounded-lg p-6 bg-card shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <h3 className="font-semibold text-lg text-primary">TalentSphere SAS</h3>
                    <p className="text-sm text-muted-foreground">123 Rue de l'Innovation<br/>75000 Paris, France<br/>SIRET: 123 456 789 00010</p>
                </div>
                <div className="md:text-right">
                    <h3 className="font-semibold text-lg text-primary">{invoice.companyName || "Votre Entreprise"}</h3>
                    <p className="text-sm text-muted-foreground">{invoice.companyAddress || "Votre Adresse"}</p>
                     <p className="text-sm text-muted-foreground">Email Facturation: {invoice.billingEmail || "Non fourni"}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div><p className="text-sm text-muted-foreground">N° Facture</p><p className="font-semibold">{invoice.id.toUpperCase()}</p></div>
                <div><p className="text-sm text-muted-foreground">Date d'Émission</p><p className="font-semibold">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-sm text-muted-foreground">Date d'Échéance</p><p className="font-semibold">{new Date(invoice.dueDate || invoice.date).toLocaleDateString('fr-FR')}</p></div>
            </div>
            
            <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr className="border-b"><th className="text-left font-semibold py-3 px-4">Description</th><th className="text-center font-semibold py-3 px-4">Qté</th><th className="text-right font-semibold py-3 px-4">Prix Unitaire HT</th><th className="text-right font-semibold py-3 px-4">Total HT</th></tr>
                    </thead>
                    <tbody>
                        {([{description: `Abonnement TalentSphere - Plan ${invoice.planName || 'Standard'}`, quantity: 1, unitPrice: invoice.amount, total: invoice.amount}]).map((item: any, index: number) => (
                            <tr key={index} className="border-b"><td className="py-3 px-4">{item.description}</td><td className="text-center py-3 px-4">{item.quantity}</td><td className="text-right py-3 px-4">{item.unitPrice}</td><td className="text-right py-3 px-4">{item.total}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-start-2 md:col-span-2">
                     <div className="flex justify-between py-1"><span className="text-muted-foreground">Sous-total HT:</span><span>{invoice.subTotal || invoice.amount}</span></div>
                     <div className="flex justify-between py-1"><span className="text-muted-foreground">TVA (20%):</span><span>{invoice.taxAmount || (parseFloat(invoice.amount.replace('€',''))*0.2).toFixed(2) + '€'}</span></div>
                     <div className="flex justify-between py-2 border-t mt-2 text-lg font-bold text-primary"><span >TOTAL TTC:</span><span>{invoice.totalAmount || (parseFloat(invoice.amount.replace('€',''))*1.2).toFixed(2) + '€'}</span></div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold mb-2 text-primary">Statut du Paiement</h4>
                <p className="text-lg font-bold " style={{color: invoice.status === "Payée" ? 'hsl(var(--secondary))' : 'hsl(var(--destructive))'}}>{invoice.status}</p>
                {invoice.paymentMethod && <p className="text-sm text-muted-foreground">Payée via {invoice.paymentMethod}</p>}
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
                <p>Merci de votre confiance.</p>
                <p>Pour toute question concernant cette facture, veuillez contacter support@talentsphere.com</p>
            </div>
          </div>
        </CardContent>
         <CardFooter className="print:hidden">
            <p className="text-xs text-muted-foreground">Cette facture est générée automatiquement et est valable sans signature.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    