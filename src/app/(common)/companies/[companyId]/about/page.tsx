
"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Changed from next/navigation
import { Loader2, Info } from 'lucide-react';

export default function CompanyAboutPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;

  useEffect(() => {
    if (companyId) {
      // Redirect to the main company profile page, specifically to the 'about' tab (or section)
      // This assumes the main company profile page /companies/[companyId] handles tabs via hash or internal state
      router.replace(`/companies/${companyId}#about`); 
    } else {
      router.replace('/companies'); // Fallback if no companyId
    }
  }, [router, companyId]);

  return (
    <div className="container mx-auto py-20 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Info className="h-16 w-16 text-primary animate-pulse mb-6" />
      <h1 className="text-2xl font-semibold text-foreground">Chargement des informations "À Propos"...</h1>
      <p className="text-muted-foreground mt-2">Redirection vers le profil de l'entreprise.</p>
      <Loader2 className="h-8 w-8 text-primary animate-spin mt-8" />
    </div>
  );
}
    