
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, LayoutDashboard, User as UserIcon, Settings, LogOut, Home, Building, Newspaper, HelpCircle, Phone, UserCheck2, CreditCard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavLinkDefinition {
  href: string;
  label: string;
  icon?: React.ElementType; // Keep for mobile
}

const publicNavLinks: NavLinkDefinition[] = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/jobs', label: 'Offres', icon: Briefcase },
  { href: '/companies', label: 'Entreprises', icon: Building },
  { href: '/blog', label: 'Blog', icon: Newspaper },
  { href: '/pricing', label: 'Tarifs', icon: CreditCard },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Header() {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isUserSection = pathname.startsWith('/user');
  const isDashboardSection = pathname.startsWith('/dashboard');

  // The public header should NOT be shown for /user/** or /dashboard/**
  if (isUserSection || isDashboardSection) {
    return null;
  }

  const isActivePage = (linkHref: string) => {
    if (linkHref === '/') return pathname === '/';
    return pathname.startsWith(linkHref) && linkHref !== '/';
  };

  const handleLogout = () => {
    logout();
    router.push('/'); // Redirect to homepage after logout
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/30 bg-background/75 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-transparent supports-[backdrop-filter]:bg-background/40 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex flex-shrink-0 items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent transition-all duration-300">
              TalentSphere
            </span>
          </Link>
        </div>

        <nav className="hidden px-6 md:flex flex-1 items-center justify-center">
          <div className="flex gap-1">
            {publicNavLinks.map((link) => (
              <div
                key={link.href}
                onMouseEnter={() => setHoveredItem(link.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-all relative",
                    isActivePage(link.href)
                      ? "text-secondary font-semibold hover:bg-secondary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Link href={link.href}>
                    {link.label}
                    {isActivePage(link.href) && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-secondary rounded-full mx-3 transition-all duration-300" />
                    )}
                    {!isActivePage(link.href) && hoveredItem === link.href && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary/40 rounded-full mx-3 transition-opacity duration-200 opacity-100" />
                    )}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </nav>

        <div className="hidden md:flex items-center space-x-3 ml-auto flex-shrink-0">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild size="sm" className="font-medium hover:text-primary transition-colors duration-300">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button variant="default" asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground relative overflow-hidden group">
                <Link href="/auth/register">
                  <span className="relative z-10">Inscription</span>
                  <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatarUrl || undefined} alt={user?.fullName || "Utilisateur"} data-ai-hint="person avatar" />
                    <AvatarFallback>{user?.fullName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.role === 'candidate' && (
                  <DropdownMenuItem asChild>
                    <Link href="/user"><LayoutDashboard className="mr-2 h-4 w-4" />Espace Candidat</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'recruiter_unassociated' && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/recruiter-onboarding"><UserCheck2 className="mr-2 h-4 w-4" />Finaliser Inscription Entreprise</Link>
                  </DropdownMenuItem>
                )}
                {(user?.role === 'recruiter' || user?.role === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Espace Entreprise</Link>
                  </DropdownMenuItem>
                )}
                
                {/* Settings Link */}
                {user?.role === 'candidate' && (
                  <DropdownMenuItem asChild>
                    <Link href="/user/settings"><Settings className="mr-2 h-4 w-4" />Paramètres Personnels</Link>
                  </DropdownMenuItem>
                )}
                {(user?.role === 'recruiter' || user?.role === 'admin') && (
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Paramètres Entreprise</Link>
                  </DropdownMenuItem>
                )}

                {/* Upgrade Plan Link - Placeholder */}
                {user?.role === 'recruiter_unassociated' && (
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">
                      <CreditCard className="mr-2 h-4 w-4" />Choisir un Plan
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col bg-background/95 backdrop-blur-md">
              <div className="p-6 border-b border-border/30">
                <Link href="/" className="flex items-center space-x-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">TalentSphere</span>
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="flex flex-col space-y-1">
                  {publicNavLinks.map((link) => (
                    <div key={link.href} className="transition-all duration-300">
                      <Button variant={isActivePage(link.href) ? "secondary" : "ghost"} asChild className={cn("justify-start w-full text-base py-3 relative transition-all duration-300", isActivePage(link.href) ? "bg-secondary/10 text-secondary border-l-2 border-secondary pl-4" : "text-foreground pl-4 border-l-2 border-transparent")}>
                        <Link href={link.href}>
                           {link.icon && <link.icon className="mr-3 h-5 w-5" />}
                           {link.label}
                        </Link>
                      </Button>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="border-t border-border/30 p-4 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="w-full justify-center hover:bg-background/50 hover:text-primary transition-colors">
                      <Link href="/auth/login">Connexion</Link>
                    </Button>
                    <Button variant="default" asChild className="w-full justify-center bg-primary hover:bg-primary/90 relative overflow-hidden group">
                      <Link href="/auth/register">
                        <span className="relative z-10">Inscription</span>
                        <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      </Link>
                    </Button>
                  </>
                ) : (
                   <>
                    {user?.role === 'candidate' && (
                      <Button variant="outline" asChild className="w-full justify-start">
                          <Link href="/user"><LayoutDashboard className="mr-2 h-4 w-4" />Espace Candidat</Link>
                      </Button>
                    )}
                    {user?.role === 'recruiter_unassociated' && (
                      <Button variant="outline" asChild className="w-full justify-start">
                          <Link href="/auth/recruiter-onboarding"><UserCheck2 className="mr-2 h-4 w-4" />Finaliser Inscription</Link>
                      </Button>
                    )}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && (
                       <Button variant="outline" asChild className="w-full justify-start">
                          <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Espace Entreprise</Link>
                      </Button>
                    )}
                     {user?.role === 'candidate' && (
                        <Button variant="outline" asChild className="w-full justify-start">
                            <Link href="/user/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link>
                        </Button>
                    )}
                    {(user?.role === 'recruiter_unassociated') && (
                         <Button variant="outline" asChild className="w-full justify-start">
                            <Link href="/pricing"><CreditCard className="mr-2 h-4 w-4" />Choisir un Plan</Link>
                        </Button>
                    )}
                    {(user?.role === 'recruiter' || user?.role === 'admin') && (
                        <Button variant="outline" asChild className="w-full justify-start">
                            <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Paramètres</Link>
                        </Button>
                    )}
                    <Button variant="destructive" onClick={handleLogout} className="w-full justify-center">
                        <LogOut className="mr-2 h-4 w-4" />Déconnexion
                    </Button>
                   </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
