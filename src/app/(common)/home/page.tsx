"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Optional: for a loading indicator

export default function HomePageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect to the root path
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Redirection vers la page d'accueil...</p>
    </div>
  );
}
