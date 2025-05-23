
"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Changed from next/navigation
import { Loader2, Briefcase } from 'lucide-react';

export default function CompanyJobsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;

  useEffect(() => {
    if (companyId) {
      // Redirect to the main jobs page, filtered by companyId
      // The main /jobs page would then need to handle this 'company' query parameter
      router.replace(`/jobs?company=${companyId}`); 
    } else {
      router.replace('/jobs'); // Fallback if no companyId
    }
  }, [router, companyId]);

  return (
    <div className="container mx-auto py-20 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Briefcase className="h-16 w-16 text-primary animate-pulse mb-6" />
      <h1 className="text-2xl font-semibold text-foreground">Chargement des offres d'emploi...</h1>
      <p className="text-muted-foreground mt-2">Redirection vers la liste des offres filtrées.</p>
      <Loader2 className="h-8 w-8 text-primary animate-spin mt-8" />
    </div>
  );
}
    