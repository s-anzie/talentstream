
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, ScanSearch } from "lucide-react";
import { parseResumeAI } from "@/lib/mock-api-services"; // Changed from actions to mock-api-services
import type { ParseResumeOutput, ParseResumeInput } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ParseResumePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [resumeContent, setResumeContent]  = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParseResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({ title: "Fichier Trop Volumineux", description: "Veuillez sélectionner un fichier de moins de 5MB.", variant: "destructive" });
        setFile(null);
        event.target.value = "";
        return;
      }
      setFile(selectedFile);
      setResumeContent("");
    }
  };
  
  const handleParseResume = async () => {
    setIsLoading(true);
    setError(null);
    setParsedData(null);

    let resumeDataUri = "";

    if (file) {
      try {
        resumeDataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.error("Error reading file:", err);
        toast({ title: "Erreur de Lecture du Fichier", description: "Impossible de lire le fichier sélectionné.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
    } else if (resumeContent.trim()) {
      const base64Text = Buffer.from(resumeContent).toString('base64');
      resumeDataUri = `data:text/plain;base64,${base64Text}`;
    } else {
       toast({ title: "Aucun CV Fourni", description: "Veuillez téléverser un fichier CV ou coller son contenu.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    if (!resumeDataUri) {
      toast({ title: "Aucun CV Fourni", description: "Le contenu du CV est vide.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const inputData: ParseResumeInput = { resumeDataUri };

    try {
        const result = await parseResumeAI(inputData); // Use service directly
        setParsedData(result);
        toast({ title: "Analyse Réussie !", description: "Les informations du CV ont été extraites." });
    } catch (err: any) {
        setError(err.message || "Erreur inconnue lors de l'analyse.");
        toast({ title: "Erreur d'Analyse IA", description: err.message || "Une erreur est survenue.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl text-primary flex items-center"><ScanSearch className="mr-3 h-7 w-7" /> Analyser un CV avec l'IA</CardTitle>
        <Button variant="outline" size="sm" onClick={() => router.push("/user/resume")}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader><CardDescription>Téléversez un CV (PDF, DOCX, TXT - max 5MB) ou collez son contenu pour extraction IA.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="resumeFile" className="text-md font-medium">Option 1: Téléverser un fichier CV</Label>
            <Input id="resumeFile" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="mt-2 border-dashed border-primary/50 p-2"/>
            {file && <p className="text-sm text-muted-foreground mt-1">Fichier : {file.name}</p>}
          </div>
          <div className="flex items-center my-4"><div className="flex-grow border-t border-muted-foreground"></div><span className="flex-shrink mx-4 text-muted-foreground text-sm">OU</span><div className="flex-grow border-t border-muted-foreground"></div></div>
          <div>
            <Label htmlFor="resumePaste" className="text-md font-medium">Option 2: Coller le contenu du CV</Label>
            <Textarea id="resumePaste" value={resumeContent} onChange={(e) => { setResumeContent(e.target.value); if (file) setFile(null); }} placeholder="Collez ici le contenu brut de votre CV..." rows={10} className="mt-2" disabled={!!file}/>
            {file && <p className="text-sm text-orange-600 mt-1">Le contenu collé est désactivé car un fichier a été sélectionné.</p>}
          </div>
          <Button onClick={handleParseResume} disabled={isLoading} size="lg" className="w-full sm:w-auto">
            {isLoading ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyse...</>) : (<><ScanSearch className="mr-2 h-5 w-5" /> Analyser le CV</>)}
          </Button>
        </CardContent>
      </Card>
      {error && (<Card className="border-destructive bg-destructive/10 shadow-md"><CardHeader><CardTitle className="text-destructive text-lg">Erreur</CardTitle></CardHeader><CardContent><p className="text-destructive/90">{error}</p></CardContent></Card>)}
      {parsedData && (
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-xl text-primary">Résultats de l'Analyse</CardTitle><CardDescription>Informations extraites. Utilisez-les pour remplir votre profil.</CardDescription></CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto whitespace-pre-wrap">{JSON.stringify(parsedData, null, 2)}</pre>
            <Button className="mt-4" variant="outline" disabled>Utiliser pour profil (Bientôt)</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    