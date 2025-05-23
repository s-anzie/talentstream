
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Changed from next/navigation
import { Loader2, Search } from 'lucide-react';

export default function JobSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This page typically processes searchParams and redirects to the main job listing page with filters
    // For now, it directly redirects to /jobs with any existing query params
    const query = searchParams.toString();
    router.replace(query ? `/jobs?${query}` : '/jobs');
  }, [router, searchParams]);

  return (
    <div className="container mx-auto py-20 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <Search className="h-16 w-16 text-primary mb-6 animate-pulse" />
      <h1 className="text-2xl font-semibold text-foreground">Préparation de votre recherche...</h1>
      <p className="text-muted-foreground mt-2">Vous allez être redirigé vers la page des offres.</p>
      <Loader2 className="h-8 w-8 text-primary animate-spin mt-8" />
    </div>
  );
}
    