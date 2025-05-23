
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Eye, Loader2, Filter, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useFetchUserNotifications } from "@/hooks/useDataFetching";
import { markNotificationAsRead as apiMarkNotificationAsRead } from "@/lib/mock-api-services";
import type { UserNotification } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { data: notifications, isLoading, error, setData: setNotifications, refetch } = useFetchUserNotifications(user?.id || null);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiMarkNotificationAsRead(notificationId);
      setNotifications?.(prev => 
        prev?.map(n => n.id === notificationId ? { ...n, isRead: true } : n) || null
      );
      toast({ title: "Notification marquée comme lue." });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de marquer comme lue.", variant: "destructive" });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!notifications || notifications.length === 0 || !notifications.some(n => !n.isRead)) {
      toast({ title: "Aucune notification non lue." });
      return;
    }
    
    try {
      // Simulate marking all as read with the mock API
      for (const n of notifications) {
        if (!n.isRead) {
          await apiMarkNotificationAsRead(n.id);
        }
      }
      setNotifications?.(prev => prev?.map(n => ({ ...n, isRead: true })) || null);
      toast({ title: "Toutes les notifications marquées comme lues." });
    } catch (e) {
      toast({ title: "Erreur", description: "Impossible de marquer toutes les notifications comme lues.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><Bell className="mr-3 h-7 w-7" /> Mes Notifications</CardTitle>
            <CardDescription>Restez informé des mises à jour importantes concernant vos candidatures et la plateforme.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={refetch} disabled={isLoading} className="w-full sm:w-auto">
              <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}/> Rafraîchir
            </Button>
            <Button onClick={handleMarkAllAsRead} disabled={isLoading || !notifications?.some(n => !n.isRead)} className="w-full sm:w-auto">
              Marquer tout comme lu
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="space-y-3">{[...Array(4)].map((_,i) => <Skeleton key={i} className="h-20 w-full rounded-lg"/>)}</div>}
          {error && <p className="text-destructive text-center py-8">Erreur: {error.message}</p>}
          {!isLoading && !error && notifications && notifications.length > 0 && (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li key={notif.id} className={cn("p-4 border rounded-lg flex items-start gap-4 hover:shadow-md transition-shadow", notif.isRead ? "bg-muted/50 opacity-75" : "bg-card border-primary/30")}>
                  <div className={cn("mt-1 p-2 rounded-full",
                    notif.type === "new_job" && "bg-blue-100 text-blue-600",
                    notif.type === "application_status" && "bg-green-100 text-green-600",
                    notif.type === "new_message" && "bg-orange-100 text-orange-600",
                    notif.type === "interview_reminder" && "bg-purple-100 text-purple-600",
                    notif.type === "general" && "bg-gray-100 text-gray-600"
                  )}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={cn("font-semibold text-foreground", !notif.isRead && "text-primary")}>{notif.title}</h4>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(notif.timestamp).toLocaleString('fr-FR', {dateStyle: 'medium', timeStyle: 'short'})}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    {notif.link && (
                      <Button variant="ghost" size="sm" asChild><Link href={notif.link}><Eye className="mr-1.5 h-4 w-4" /> Voir</Link></Button>
                    )}
                    {!notif.isRead && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notif.id)}><CheckCircle className="mr-1.5 h-4 w-4" /> Marquer lu</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !error && (!notifications || notifications.length === 0) && (
            <div className="text-center py-12 text-muted-foreground"><Bell className="mx-auto h-16 w-16 opacity-50 mb-4" /><h3 className="text-xl font-semibold text-foreground">Aucune notification pour le moment.</h3><p className="mt-2">Tout est à jour !</p></div>
          )}
        </CardContent>
        {!isLoading && notifications && notifications.length > 0 && (<CardFooter className="justify-center border-t pt-6"><Button variant="outline" size="sm" className="mr-2" disabled>Précédent</Button><Button variant="outline" size="sm" disabled>Suivant</Button></CardFooter>)}
      </Card>
    </div>
  );
}
    