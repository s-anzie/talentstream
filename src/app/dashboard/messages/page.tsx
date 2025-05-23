
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Search, Paperclip, Smile, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Dummy data for conversations and messages from Company's perspective
const dummyConversations = [
  {
    id: "candConv1",
    candidateName: "John Doe",
    candidateAvatar: "https://placehold.co/40x40.png?text=JD",
    lastMessage: "Bonjour, je suis très intéressé par le poste de Développeur Full-Stack...",
    timestamp: "11:30",
    unreadCount: 1,
    jobTitle: "Développeur Full-Stack",
    jobId: "job001"
  },
  {
    id: "candConv2",
    candidateName: "Alice Martin",
    candidateAvatar: "https://placehold.co/40x40.png?text=AM",
    lastMessage: "Merci pour l'opportunité, j'aimerais planifier l'entretien.",
    timestamp: "Hier",
    unreadCount: 0,
    jobTitle: "Designer UX/UI Confirmé",
    jobId: "job002"
  },
  {
    id: "candConv3",
    candidateName: "Bob Williams",
    candidateAvatar: "https://placehold.co/40x40.png?text=BW",
    lastMessage: "J'ai quelques questions concernant les responsabilités du poste.",
    timestamp: "18 juil.",
    unreadCount: 3,
    jobTitle: "Ingénieur DevOps Cloud",
    jobId: "job004"
  },
];

const dummyMessages: { [key: string]: Array<{ id: string, sender: 'me' | 'other', text: string, time: string }> } = {
  candConv1: [
    { id: "msgC1_1", sender: "other", text: "Bonjour, je suis très intéressé par le poste de Développeur Full-Stack. J'ai 5 ans d'expérience avec React et Node.js.", time: "11:30" },
    { id: "msgC1_2", sender: "me", text: "Bonjour John, merci pour votre intérêt ! Votre profil correspond bien. Avez-vous des questions sur l'offre ?", time: "11:35" },
  ],
  candConv2: [
     { id: "msgC2_1", sender: "me", text: "Bonjour Alice, nous avons examiné votre portfolio et aimerions vous proposer un entretien.", time: "Avant-hier 10:00" },
     { id: "msgC2_2", sender: "other", text: "Merci pour l'opportunité, j'aimerais planifier l'entretien. Quelles sont vos disponibilités ?", time: "Hier 09:15" },
  ],
  candConv3: [
      { id: "msgC3_1", sender: "other", text: "J'ai quelques questions concernant les responsabilités du poste d'Ingénieur DevOps. Pourriez-vous m'en dire plus sur la gestion de l'infrastructure AWS ?", time: "18 juil. 14:00"}
  ]
};

export default function CompanyMessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (dummyConversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(dummyConversations[0].id);
    }
  }, [selectedConversationId]);


  const selectedConversation = dummyConversations.find(c => c.id === selectedConversationId);
  const messages = selectedConversationId ? dummyMessages[selectedConversationId] || [] : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedConversationId) return;
    
    const newMsg = {id: `msg${Date.now()}`, sender: "me" as const, text: newMessage, time: "Maintenant"};
    
    // This is a temporary update for the demo. In a real app, this would go to a backend.
    if (dummyMessages[selectedConversationId]) {
        dummyMessages[selectedConversationId].push(newMsg);
    } else {
        dummyMessages[selectedConversationId] = [newMsg];
    }
    // Also update the last message in the conversation list (simplified)
    const convIndex = dummyConversations.findIndex(c => c.id === selectedConversationId);
    if (convIndex !== -1) {
        dummyConversations[convIndex].lastMessage = newMessage;
        dummyConversations[convIndex].timestamp = "Maintenant";
    }

    setNewMessage("");
    // Force re-render if necessary, though state update on newMessage should do it
  };

  return (
    <div className="h-[calc(100vh-var(--header-height,10rem)-2rem)] flex flex-col md:flex-row gap-0 overflow-hidden border rounded-lg shadow-lg bg-card">
      {/* Conversations List Panel */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <MessageSquare className="mr-2 h-6 w-6" /> Messagerie Entreprise
          </h2>
          <div className="relative mt-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par candidat, poste..." className="pl-9 text-sm bg-background" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {dummyConversations.map((conv) => (
            <button
              key={conv.id}
              className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConversationId === conv.id ? "bg-muted" : ""}`}
              onClick={() => setSelectedConversationId(conv.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.candidateAvatar} alt={conv.candidateName} data-ai-hint="person avatar" />
                  <AvatarFallback>{conv.candidateName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm truncate text-foreground">{conv.candidateName}</h3>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-primary truncate flex items-center">
                    <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" /> {conv.jobTitle}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Message Display Panel */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.candidateAvatar} alt={selectedConversation.candidateName} data-ai-hint="person avatar" />
                <AvatarFallback>{selectedConversation.candidateName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{selectedConversation.candidateName}</h3>
                <Link href={`/dashboard/jobs/${selectedConversation.jobId}`} className="text-xs text-muted-foreground hover:text-primary flex items-center">
                  <Briefcase className="h-3 w-3 mr-1"/> Candidature pour : <span className="font-medium ml-1">{selectedConversation.jobTitle}</span>
                </Link>
              </div>
              <div className="ml-auto">
                <Link href={`/dashboard/candidates/${selectedConversation.id.replace('candConv', 'cand')}`}> {/* Assuming candidate ID format */}
                    <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4"/> Voir Profil Candidat
                    </Button>
                </Link>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`my-1 flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t bg-card">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Joindre un fichier</span>
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message au candidat..."
                  className="flex-1 bg-background"
                />
                 <Button variant="ghost" size="icon" type="button" className="text-muted-foreground hover:text-primary">
                    <Smile className="h-5 w-5" />
                    <span className="sr-only">Emojis</span>
                </Button>
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Envoyer</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <MessageSquare className="h-24 w-24 opacity-30 mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Sélectionnez une conversation</h3>
            <p>Choisissez une conversation dans la liste de gauche pour afficher les messages ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
