
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadResumePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
       if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Fichier Trop Volumineux",
          description: "Veuillez sélectionner un fichier CV de moins de 5MB.",
          variant: "destructive",
        });
        setFile(null);
        event.target.value = ""; // Reset file input
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Aucun Fichier Sélectionné",
        description: "Veuillez sélectionner un fichier CV à téléverser.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would send the file to your backend here
    // e.g., using FormData and fetch/axios

    setIsUploading(false);
    toast({
      title: "CV Téléversé avec Succès (Simulation)",
      description: `${file.name} a été ajouté à votre profil.`,
    });
    router.push("/user/resume"); // Redirect to resume management page
  };


  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <CardTitle className="text-2xl text-primary flex items-center">
          <UploadCloud className="mr-3 h-7 w-7" /> Téléverser un Nouveau CV
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.push("/user/resume")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la gestion de CV
        </Button>
      </div>
      <Card className="shadow-lg max-w-lg mx-auto">
        <CardHeader>
          <CardDescription>
            Sélectionnez un fichier CV depuis votre ordinateur (formats PDF, DOCX, TXT acceptés, max 5MB).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resumeFile" className="text-md font-medium">Choisir un fichier CV</Label>
            <Input 
              id="resumeFile" 
              type="file" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleFileChange}
              className="border-dashed border-primary/50 p-2 h-auto"
            />
            {file && <p className="text-sm text-muted-foreground mt-1">Fichier sélectionné : {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
          </div>
           <Button onClick={handleUpload} disabled={!file || isUploading} size="lg" className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Téléversement en cours...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" /> Téléverser et Enregistrer
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
