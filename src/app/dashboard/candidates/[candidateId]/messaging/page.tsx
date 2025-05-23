
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Send, Paperclip, Smile, Loader2, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';
import { useFetchCompanyCandidateDetails, useFetchUserMessages } from '@/hooks/useDataFetching';
import { sendUserMessage as apiSendUserMessage } from '@/lib/mock-api-services'; // Corrected import
import type { UserMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function DirectMessageCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: recruiterUser } = useAuthStore();
  const candidateId = params.candidateId as string;

  // A conversation ID might be globally unique or specific to candidate-recruiter pair.
  // For this mock, we'll use a simple one. In a real app, this might be fetched or created.
  const conversationId = `direct-cand-${candidateId}-rec-${recruiterUser?.id}`;

  const { data: candidate, isLoading: isLoadingCandidate, error: candidateError } = useFetchCompanyCandidateDetails(candidateId);
  const { data: messages, isLoading: isLoadingMessages, error: messagesError, setData: setMessages } = useFetchUserMessages(conversationId); // Assuming useFetchUserMessages can take any conversation ID
  
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !recruiterUser?.id || !candidate?.id) return;
    
    setIsSending(true);
    const messageToSend: Omit<UserMessage, 'id' | 'timestamp' | 'conversationId'> = {
        senderId: recruiterUser.id,
        receiverId: candidate.id, 
        senderRole: 'recruiter',
        text: newMessage,
        isRead: false,
    };

    try {
      const sentMessage = await apiSendUserMessage(conversationId, messageToSend);
      setMessages?.(prev => prev ? [...prev, sentMessage] : [sentMessage]);
      setNewMessage("");
      toast({ title: "Message Envoyé" });
    } catch (error) {
        toast({ title: "Erreur d'Envoi", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
        setIsSending(false);
    }
  };
  
  if (isLoadingCandidate) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[calc(100vh-20rem)] w-full" />
      </div>
    );
  }

  if (candidateError || !candidate) {
    return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/candidates/${candidateId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil
        </Button>
        <p className="text-destructive">Erreur: {candidateError?.message || "Candidat non trouvé."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--header-height,5rem)-4rem)]">
      <Button variant="outline" size="sm" className='w-fit' onClick={() => router.push(`/dashboard/candidates/${candidateId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil de {candidate.name}
      </Button>
      <Card className="shadow-lg flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center text-2xl text-primary"><MessageSquare className="mr-3 h-7 w-7"/> Message Direct à {candidate.name}</CardTitle>
          <CardDescription>
            Échangez directement avec le candidat.
          </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1 p-4 space-y-4 bg-muted/30">
            {isLoadingMessages && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
            {messagesError && <p className="text-destructive text-center p-4">Erreur de chargement des messages.</p>}
            {!isLoadingMessages && messages?.map((msg) => (
                <div key={msg.id} className={`my-1 flex ${msg.senderId === recruiterUser?.id ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== recruiterUser?.id && (
                        <Avatar className="h-8 w-8 mr-2 self-end">
                            <AvatarImage src={candidate.avatarUrl} alt={candidate.name} data-ai-hint="person avatar"/>
                            <AvatarFallback>{candidate.name?.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.senderId === recruiterUser?.id ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground border'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === recruiterUser?.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                     {msg.senderId === recruiterUser?.id && (
                        <Avatar className="h-8 w-8 ml-2 self-end">
                            <AvatarImage src={recruiterUser?.avatarUrl} alt={recruiterUser?.fullName || "Moi"} data-ai-hint="person avatar"/>
                            <AvatarFallback>{recruiterUser?.fullName?.substring(0,2).toUpperCase() || "M"}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
            {!isLoadingMessages && (!messages || messages.length === 0) && <p className="text-center text-muted-foreground py-10">Aucun message dans cette conversation.</p>}
        </ScrollArea>
        <CardFooter className="p-4 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary"><Paperclip className="h-5 w-5" /><span className="sr-only">Joindre</span></Button>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Envoyer un message à ${candidate.name}...`} className="flex-1 bg-background"/>
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary"><Smile className="h-5 w-5" /><span className="sr-only">Emojis</span></Button>
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}<span className="sr-only">Envoyer</span>
                </Button>
            </form>
        </CardFooter>
      </Card>
    </div>
  );
}
    
