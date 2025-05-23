
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircleMore, Send, Paperclip, Smile, Loader2, Briefcase, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useFetchUserMessages, useFetchUserConversationDetails, sendUserMessage as apiSendUserMessage } from '@/hooks/useDataFetching'; // Assuming a hook for single conversation details
import type { UserMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function UserConversationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const conversationId = params.conversationId as string;

  const { data: conversation, isLoading: isLoadingConversation, error: conversationError } = useFetchUserConversationDetails(conversationId);
  const { data: messages, isLoading: isLoadingMessages, error: messagesError, setData: setMessages } = useFetchUserMessages(conversationId);
  
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user?.id || !conversation?.recruiterId ) return;
    
    setIsSending(true);
    const messageToSend: Omit<UserMessage, 'id' | 'timestamp' | 'conversationId'> = {
        senderId: user.id,
        receiverId: conversation.recruiterId, // Assuming the 'other' party is the recruiter
        senderRole: 'candidate',
        text: newMessage,
        isRead: false,
    };

    try {
      const sentMessage = await apiSendUserMessage(conversationId, messageToSend);
      setMessages?.(prev => prev ? [...prev, sentMessage] : [sentMessage]);
      setNewMessage("");
      toast({ title: "Message Envoyé" });
      // Optionally, refetch conversation list to update last message preview
    } catch (error) {
        toast({ title: "Erreur d'Envoi", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } finally {
        setIsSending(false);
    }
  };

  if (isLoadingConversation) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[calc(100vh-20rem)] w-full" />
      </div>
    );
  }

  if (conversationError || !conversation) {
     return (
      <div className="space-y-6 text-center">
         <Button variant="outline" size="sm" onClick={() => router.push('/user/messages')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la messagerie
        </Button>
        <p className="text-destructive">Erreur: {conversationError?.message || "Conversation non trouvée."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--header-height,5rem)-4rem)]">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/messages')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la messagerie
      </Button>
      <Card className="shadow-lg flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10"><AvatarImage src={conversation.userAvatar} alt={conversation.userName} data-ai-hint="person avatar"/><AvatarFallback>{conversation.userName.substring(0,2).toUpperCase()}</AvatarFallback></Avatar>
            <div>
                <CardTitle className="text-lg text-primary">{conversation.userName}</CardTitle>
                {conversation.jobTitle && 
                    <CardDescription className="text-xs">
                        Concernant l'offre : <Link href={`/jobs/${conversation.jobId}`} className="text-secondary hover:underline">{conversation.jobTitle}</Link>
                    </CardDescription>
                }
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1 p-4 space-y-4 bg-muted/30">
            {isLoadingMessages && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
            {messagesError && <p className="text-destructive text-center p-4">Erreur de chargement des messages.</p>}
            {!isLoadingMessages && messages?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                     {msg.senderId !== user?.id && ( // Avatar for the other person
                        <Avatar className="h-8 w-8 mr-2 self-end">
                            <AvatarImage src={conversation.userAvatar} alt={conversation.userName} data-ai-hint="person avatar"/>
                            <AvatarFallback>{conversation.userName.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground border'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    {msg.senderId === user?.id && ( // Your avatar
                        <Avatar className="h-8 w-8 ml-2 self-end">
                            <AvatarImage src={user?.avatarUrl} alt={user?.fullName || "Moi"} data-ai-hint="person avatar"/>
                            <AvatarFallback>{user?.fullName?.substring(0,2).toUpperCase() || "M"}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            ))}
            {!isLoadingMessages && (!messages || messages.length === 0) && <p className="text-center text-muted-foreground py-10">Aucun message dans cette conversation. Commencez la discussion !</p>}
        </ScrollArea>
        <CardFooter className="p-4 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary"><Paperclip className="h-5 w-5" /><span className="sr-only">Joindre</span></Button>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Répondre à ${conversation.userName}...`} className="flex-1 bg-background"/>
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
    