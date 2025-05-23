
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, KeyRound, ShieldCheck, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// import { useAuthStore } from '@/stores/authStore';
// import { changePassword } from '@/lib/mock-api-services'; // Assuming service exists

export default function UserSecuritySettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // const { user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
        toast({title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas.", variant: "destructive"});
        return;
    }
    if (newPassword.length < 6) {
        toast({title: "Erreur", description: "Le nouveau mot de passe doit comporter au moins 6 caractères.", variant: "destructive"});
        return;
    }
    setIsSavingPassword(true);
    try {
        // await changePassword(user.id, currentPassword, newPassword); // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
        toast({title: "Mot de Passe Modifié (Simulation)", description: "Votre mot de passe a été mis à jour."});
        setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (error: any) {
        toast({title: "Erreur", description: error.message || "Impossible de changer le mot de passe.", variant: "destructive"});
    } finally {
        setIsSavingPassword(false);
    }
  };
  
  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
    toast({title: "2FA (Simulation)", description: "L'authentification à deux facteurs serait configurée ici."});
    setIsEnabling2FA(false);
  }


  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => router.push('/user/settings')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux Paramètres
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-primary"><KeyRound className="mr-3 h-7 w-7"/>Paramètres de Sécurité</CardTitle>
          <CardDescription>Gérez votre mot de passe et renforcez la sécurité de votre compte TalentSphere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <form onSubmit={handleChangePassword} className="space-y-6 p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary">Changer de Mot de Passe</h3>
                <div className="space-y-2 relative">
                    <Label htmlFor="currentPassword">Mot de Passe Actuel</Label>
                    <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} placeholder="Votre mot de passe actuel" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                        {showCurrentPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>} <span className="sr-only">Afficher/Cacher</span>
                    </Button>
                </div>
                 <div className="space-y-2 relative">
                    <Label htmlFor="newPassword">Nouveau Mot de Passe</Label>
                    <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Minimum 6 caractères" />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>} <span className="sr-only">Afficher/Cacher</span>
                    </Button>
                </div>
                 <div className="space-y-2 relative">
                    <Label htmlFor="confirmNewPassword">Confirmer le Nouveau Mot de Passe</Label>
                    <Input id="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} placeholder="Retapez le nouveau mot de passe" />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>} <span className="sr-only">Afficher/Cacher</span>
                    </Button>
                </div>
                <Button type="submit" disabled={isSavingPassword || !currentPassword || !newPassword || !confirmNewPassword}>
                    {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4"/>
                    {isSavingPassword ? "Modification..." : "Changer le Mot de Passe"}
                </Button>
            </form>
            <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-secondary mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5"/>Authentification à Deux Facteurs (2FA)</h3>
                <p className="text-sm text-muted-foreground mb-3">Ajoutez une couche de sécurité supplémentaire à votre compte en activant la 2FA. Vous aurez besoin d'une application d'authentification (Google Authenticator, Authy, etc.).</p>
                <Button variant="outline" onClick={handleEnable2FA} disabled={isEnabling2FA}>
                    {isEnabling2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isEnabling2FA ? "Activation..." : "Activer la 2FA (Bientôt)"}
                </Button>
            </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Il est recommandé d'utiliser un mot de passe unique et fort pour TalentSphere.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    