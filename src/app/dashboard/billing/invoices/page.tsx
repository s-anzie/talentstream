
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFetchInvoices } from '@/hooks/useDataFetching';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvoicesListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: invoices, isLoading, error } = useFetchInvoices(user?.companyId || null);

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/billing')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la Facturation
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><FileText className="mr-3 h-7 w-7"/>Historique des Factures</CardTitle>
          <CardDescription>Consultez et téléchargez toutes vos factures passées pour votre abonnement TalentSphere.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
          )}
          {error && <p className="text-destructive text-center py-6">Erreur de chargement des factures: {error.message}</p>}
          {!isLoading && !error && invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader><TableRow><TableHead className="w-[150px]">N° Facture</TableHead><TableHead>Date</TableHead><TableHead>Montant</TableHead><TableHead className="text-center">Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/10">
                        <TableCell className="font-medium">
                            <Link href={`/dashboard/billing/invoices/${invoice.id}`} className="text-primary hover:underline">
                                {invoice.id.toUpperCase()}
                            </Link>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-medium">{invoice.amount}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={invoice.status === "Payée" ? "secondary" : "destructive"} className={invoice.status === "Payée" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={invoice.pdfLink} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> PDF
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          ) : !isLoading && (<div className="text-center py-12 text-muted-foreground"><FileText className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucune facture disponible.</h3><p className="mt-2">Vos factures apparaîtront ici dès qu'elles seront générées.</p></div>)}
        </CardContent>
         {!isLoading && invoices && invoices.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    