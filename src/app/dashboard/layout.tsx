
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutGrid, Briefcase, PlusCircle, Users, BarChart3, CreditCard, Settings, LogOut, PanelLeft, Building, Bell, MessageSquare, Users2, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useAuthProtection } from '@/hooks/useAuthProtection';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authProtectionOptions = useMemo(() => ({ requiredRole: 'recruiter' as const }), []);
  useAuthProtection(authProtectionOptions);

  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading: authLoading, checkAuthStatus } = useAuthStore();
  const router = useRouter();
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id && !authLoading && !initialAuthCheckDone) {
      checkAuthStatus();
      setInitialAuthCheckDone(true);
    }
  }, [isAuthenticated, user?.id, authLoading, checkAuthStatus, initialAuthCheckDone]);


  const navItems = [
    { href: '/dashboard', label: 'Accueil Dashboard', icon: LayoutGrid },
    {
      href: '/dashboard/jobs',
      label: 'Gérer les Offres',
      icon: Briefcase,
      subItems: [
        { href: '/dashboard/jobs', label: 'Voir les Offres', icon: ListOrdered },
        { href: '/dashboard/jobs/create', label: 'Publier une Offre', icon: PlusCircle },
      ]
    },
    { href: '/dashboard/candidates', label: 'Base de Candidats', icon: Users },
    { href: '/dashboard/applications', label: 'Toutes les Candidatures', icon: Briefcase },
    { href: '/dashboard/interviews', label: 'Entretiens', icon: Users },
    { href: '/dashboard/calendar', label: 'Calendrier', icon: Users },
    { href: '/dashboard/messages', label: 'Messagerie', icon: MessageSquare },
    { href: '/dashboard/team', label: 'Équipe', icon: Users2 },
    { href: '/dashboard/analytics', label: 'Analyses', icon: BarChart3 },
    { href: '/dashboard/billing', label: 'Facturation', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
  ];

  const getPageTitle = () => {
    for (const item of navItems) {
      if (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))) {
        if (item.subItems) {
          const activeSubItem = item.subItems.find(sub => pathname.startsWith(sub.href));
          if (activeSubItem) return activeSubItem.label;
        }
        return item.label;
      }
    }
    return 'Tableau de Bord Entreprise';
  };
  const pageTitle = getPageTitle();
  
  const companyName = user?.companyName || "Mon Entreprise";
  const companyAvatarFallback = companyName ? companyName.substring(0, 2).toUpperCase() : "CO";

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (authLoading && !initialAuthCheckDone) {
    return <div className="flex justify-center items-center min-h-screen">Chargement de votre tableau de bord...</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="w-full flex flex-1 bg-background">
        <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/90">
              <Building className="h-7 w-7" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                TalentSphere
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 flex-1">
            <SidebarMenu>
              {navItems.map((item) => {
                const isParentActive = item.href === '/dashboard'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isParentActive && !item.subItems} // Active only if no subitems or if it's the direct page
                      tooltip={{ children: item.label, side: 'right' }}
                    >
                      <Link href={item.subItems && item.subItems.length > 0 ? item.href : item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.subItems && (
                      <SidebarMenuSub
                        className={cn(
                          "transition-all duration-300 ease-in-out",
                          pathname.startsWith(item.href) ? "max-h-[500px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
                        )}
                      >
                        {item.subItems.map(subItem => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href || pathname.startsWith(subItem.href + '/')}
                            >
                              <Link href={subItem.href}>
                                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
             <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: 'Déconnexion', side: 'right' }}
                  onClick={handleLogout}
                >
                  <button type="button" className="w-full h-full flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/75 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sm:px-6 w-full">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                 <SidebarTrigger asChild>
                   <Button size="icon" variant="outline" className="rounded-full">
                     <PanelLeft className="h-5 w-5" />
                     <span className="sr-only">Ouvrir/Fermer la sidebar</span>
                   </Button>
                 </SidebarTrigger>
              </div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                {pageTitle}
              </h1>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatarUrl || undefined} alt={companyName} data-ai-hint="company logo abstract"/>
                      <AvatarFallback>{companyAvatarFallback}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{companyName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "recruteur@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings/profile"> 
                      <Building className="mr-2 h-4 w-4" />
                      <span>Profil Entreprise</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Facturation</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto bg-muted/30 min-h-0"> {/* Ensure main can fill height and min-h-0 for flex overflow */}
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
