// src/app/error.tsx
"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 text-center">
      <h1 className="text-4xl font-bold text-destructive mb-4">Something went wrong!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        We encountered an unexpected error. Please try again.
      </p>
      {error?.message && (
        <pre className="mb-4 p-4 bg-muted text-foreground rounded-md text-left text-sm overflow-x-auto">
          {error.message}
        </pre>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        size="lg"
      >
        Try again
      </Button>
    </div>
  );
}
