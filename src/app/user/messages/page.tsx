
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Search, Paperclip, Smile, Loader2, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, FormEvent } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useFetchUserConversations, useFetchUserMessages } from "@/hooks/useDataFetching";
import { sendUserMessage as apiSendUserMessage } from "@/lib/mock-api-services";
import type { UserMessage, UserConversation } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { data: conversations, isLoading: isLoadingConversations, error: conversationsError, setData: setConversations } = useFetchUserConversations(user?.id || null);
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { data: messages, isLoading: isLoadingMessages, error: messagesError, setData: setMessages } = useFetchUserMessages(selectedConversationId);
  
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedConversationId || !user?.id || !selectedConversation?.recruiterId) return;
    
    setIsSending(true);
    const messageToSend: Omit<UserMessage, 'id' | 'timestamp' | 'conversationId'> = {
        senderId: user.id,
        receiverId: selectedConversation.recruiterId, 
        senderRole: 'candidate',
        text: newMessage,
        isRead: false,
    };

    try {
      const sentMessage = await apiSendUserMessage(selectedConversationId, messageToSend);
      setMessages?.(prev => prev ? [...prev, sentMessage] : [sentMessage]);
      
      setConversations?.(prevConvs => prevConvs?.map(conv => 
        conv.id === selectedConversationId 
        ? { ...conv, lastMessage: sentMessage.text, timestamp: "Maintenant" } 
        : conv
      ).sort((a,b) => new Date(b.timestamp === "Maintenant" ? Date.now() : new Date(b.timestamp).getTime()).getTime() - new Date(a.timestamp === "Maintenant" ? Date.now() : new Date(a.timestamp).getTime()).getTime()) || null);
      setNewMessage("");
    } catch (error) {
        console.error("Failed to send message:", error);
        // TODO: Add toast notification for error
    } finally {
        setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-var(--header-height,10rem)-2rem)] flex flex-col md:flex-row gap-0 overflow-hidden border rounded-lg shadow-lg bg-card">
      <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
        <div className="p-4 border-b"><h2 className="text-xl font-semibold text-primary flex items-center"><MessageSquare className="mr-2 h-6 w-6" /> Messagerie</h2>
          <div className="relative mt-3"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher par recruteur, offre..." className="pl-9 text-sm bg-background" /></div>
        </div>
        <ScrollArea className="flex-1">
          {isLoadingConversations && <div className="p-4 space-y-3">{[...Array(3)].map((_,i) => <Skeleton key={i} className="h-16 w-full rounded-md"/>)}</div>}
          {conversationsError && <p className="p-4 text-destructive text-center">Erreur: {conversationsError.message}</p>}
          {!isLoadingConversations && !conversationsError && conversations?.map((conv) => (
            <button key={conv.id} className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConversationId === conv.id ? "bg-muted" : ""}`} onClick={() => setSelectedConversationId(conv.id)}>
              <div className="flex items-center gap-3"><Avatar className="h-10 w-10"><AvatarImage src={conv.userAvatar} alt={conv.userName} data-ai-hint="person avatar" /><AvatarFallback>{conv.userName.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center"><h3 className="font-semibold text-sm truncate text-foreground">{conv.userName}</h3><span className="text-xs text-muted-foreground">{conv.timestamp === "Maintenant" ? conv.timestamp : new Date(conv.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                  {conv.jobTitle && <p className="text-xs text-primary truncate flex items-center"><Briefcase className="h-3 w-3 mr-1"/>{conv.jobTitle}</p>}
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>{conv.unreadCount > 0 && (<span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{conv.unreadCount}</span>)}
              </div>
            </button>
          ))}
          {!isLoadingConversations && !conversationsError && conversations?.length === 0 && <p className="p-4 text-muted-foreground text-center py-10">Aucune conversation pour le moment.</p>}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-background">
        {isLoadingMessages && selectedConversationId && <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
        {messagesError && <div className="flex-1 flex items-center justify-center text-destructive text-center p-4">Erreur lors du chargement des messages: {messagesError.message}</div>}
        {!isLoadingMessages && !messagesError && selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarImage src={selectedConversation.userAvatar} alt={selectedConversation.userName} data-ai-hint="person avatar" /><AvatarFallback>{selectedConversation.userName.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
              <div><h3 className="font-semibold text-foreground">{selectedConversation.userName}</h3>
                {selectedConversation.jobTitle && <Link href={`/jobs/${selectedConversation.jobId}`} className="text-xs text-muted-foreground hover:text-primary flex items-center"><Briefcase className="h-3 w-3 mr-1"/> Concernant: <span className="font-medium ml-1">{selectedConversation.jobTitle}</span></Link>}
              </div>
            </div>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary"><Paperclip className="h-5 w-5" /><span className="sr-only">Joindre</span></Button>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 bg-background"/>
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary"><Smile className="h-5 w-5" /><span className="sr-only">Emojis</span></Button>
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90" disabled={isSending}>
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}<span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </div>
          </>
        ) : (!isLoadingMessages && <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground"><MessageSquare className="h-24 w-24 opacity-30 mb-6" /><h3 className="text-xl font-semibold text-foreground mb-2">Sélectionnez une conversation</h3><p>Ou commencez une discussion depuis une offre d'emploi à laquelle vous avez postulé.</p></div>)}
      </div>
    </div>
  );
}
    