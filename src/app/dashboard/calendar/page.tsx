
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarDays, ListOrdered, PlusCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFetchCalendarEvents } from '@/hooks/useDataFetching'; // Assuming this hook is created
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/types';

export default function RecruitmentCalendarPage() {
  const { user } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const lastDayCurrentMonth = endOfMonth(currentMonth);

  // Adjust range to include days from prev/next month to fill the grid
  const startDate = startOfWeek(firstDayCurrentMonth, { locale: fr });
  const endDate = endOfWeek(lastDayCurrentMonth, { locale: fr });

  const { data: events, isLoading, error } = useFetchCalendarEvents(user?.companyId || null, startDate, endDate);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const colStartClasses = [ "", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7", ];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events?.filter(event => 
        new Date(event.start).toDateString() === day.toDateString()
    ) || [];
  };

  if (isLoading && !events) { // Initial load might show skeleton longer
    return (
        <div className="space-y-6">
            <Skeleton className="h-24 w-full"/>
            <Skeleton className="h-[500px] w-full"/>
        </div>
    );
  }
  if (error) return <p className="text-destructive text-center">Erreur de chargement du calendrier: {error.message}</p>;


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center"><CalendarDays className="mr-3 h-7 w-7"/>Calendrier de Recrutement</CardTitle>
            <CardDescription>Visualisez et gérez tous vos événements de recrutement.</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/dashboard/calendar/events"><ListOrdered className="mr-2 h-4 w-4"/> Voir Liste Événements</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/interviews/schedule"><PlusCircle className="mr-2 h-4 w-4"/> Planifier Entretien</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Mois précédent">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl font-semibold text-foreground">
                    {format(currentMonth, "MMMM yyyy", { locale: fr })}
                </h2>
                <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Mois suivant">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
            {isLoading && <div className="flex justify-center my-4"><Loader2 className="h-6 w-6 animate-spin text-primary"/></div>}
            <div className="grid grid-cols-7 gap-px border-l border-t border-border bg-border shadow-sm rounded-md overflow-hidden">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card">
                        {day}
                    </div>
                ))}
                {days.map((day, dayIdx) => {
                    const dayEvents = getEventsForDay(day);
                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                dayIdx === 0 && colStartClasses[getDay(day) === 0 ? 6 : getDay(day) -1], // Adjust for week start (0=Sun)
                                "bg-card p-1.5 min-h-[100px] border-r border-b border-border relative flex flex-col",
                                !isSameMonth(day, currentMonth) && "bg-muted/30 text-muted-foreground"
                            )}
                        >
                            <time dateTime={format(day, "yyyy-MM-dd")} className={cn("text-xs", isToday(day) && "bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center font-semibold")}>
                                {format(day, "d")}
                            </time>
                            <div className="flex-grow mt-1 space-y-0.5 overflow-y-auto max-h-[70px]"> {/* Max height for event list */}
                                {dayEvents.map(event => (
                                     <Link key={event.id} href={event.data?.id ? `/dashboard/interviews/${event.data.id}` : "#"} className="block">
                                        <div className="text-[10px] p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 truncate">
                                            <span className="font-medium">{format(event.start, "HH:mm")}</span> {event.title}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Cliquez sur un événement pour voir les détails. Le calendrier affiche les entretiens planifiés.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    