
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This page is now obsolete and replaced by /app/auth/company-create/page.tsx
// It will redirect to the new company creation page.
export default function ObsoleteCompanySetupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/company-create');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">Redirection vers la configuration de l'entreprise...</p>
    </div>
  );
}
