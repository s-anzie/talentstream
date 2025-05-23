
import type {Metadata} from 'next';
import { Montserrat, Open_Sans } from 'next/font/google'; // Updated fonts
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'TalentSphere - Modern Recruitment SaaS',
  description: 'Find your next talent or your dream job with TalentSphere.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={cn(montserrat.variable, openSans.variable)}>
      <body className={cn(
        "h-screen bg-background font-sans antialiased flex flex-col overflow-hidden"
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
