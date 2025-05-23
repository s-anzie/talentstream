
"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Changed from next/navigation
import { Loader2, Building } from 'lucide-react';
import { useFetchPublicJobDetails } from '@/hooks/useDataFetching'; // Use the hook

export default function JobCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  
  // Fetch job details to get companyId
  // In a real scenario, job details might already include basic company info, or we might need a separate fetch if it only has companyId
  const { data: jobDetails, isLoading, error } = useFetchPublicJobDetails(jobId); 

  useEffect(() => {
    if (isLoading) return; // Wait for data to load

    if (error || !jobDetails || !jobDetails.companyId) {
      console.error("Failed to fetch job details or company ID missing for redirect:", error);
      router.replace('/companies'); // Fallback if job or companyId not found
      return;
    }
    
    router.replace(`/companies/${jobDetails.companyId}`);

  }, [router, jobId, jobDetails, isLoading, error]);

  return (
    <div className="container mx-auto py-20 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Building className="h-16 w-16 text-primary animate-pulse mb-6" />
      <h1 className="text-2xl font-semibold text-foreground">Chargement du profil de l'entreprise...</h1>
      <p className="text-muted-foreground mt-2">Redirection en cours...</p>
      <Loader2 className="h-8 w-8 text-primary animate-spin mt-8" />
    </div>
  );
}
    