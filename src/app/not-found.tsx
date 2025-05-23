// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <AlertTriangle className="h-24 w-24 text-destructive mb-8" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
