
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, ScanSearch, Trash2, Download, Eye, Wand2 } from "lucide-react"; // Added Wand2
import Link from "next/link";

// Dummy data for resumes
const dummyResumes = [
  {
    id: "cv1",
    fileName: "Mon_CV_Developpeur_2024.pdf",
    uploadDate: "2024-07-15",
    isPrimary: true,
    size: "256 KB",
  },
  {
    id: "cv2",
    fileName: "CV_Marketing_Alternatif.docx",
    uploadDate: "2024-06-20",
    isPrimary: false,
    size: "180 KB",
  },
];

export default function ManageResumePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <FileText className="mr-3 h-7 w-7" /> Gestion de Mes CV et Documents
          </CardTitle>
          <CardDescription>
            Gérez vos CV, téléversez de nouvelles versions, utilisez notre bâtisseur de CV ou nos outils d'analyse IA.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6"> {/* Changed to 3 columns */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg flex items-center text-secondary">
                    <UploadCloud className="mr-2 h-5 w-5" /> Téléverser un CV
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                    Ajoutez un nouveau CV (PDF, DOCX, TXT - Max 5MB).
                </p>
                <Button className="w-full" asChild>
                     <Link href="/user/resume/upload">Téléverser maintenant</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg flex items-center text-secondary">
                    <Wand2 className="mr-2 h-5 w-5" /> Bâtisseur de CV
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                    Créez ou modifiez votre CV professionnel avec notre outil intégré.
                </p>
                <Button className="w-full" variant="outline" asChild>
                    <Link href="/user/resume/build">Ouvrir le Bâtisseur</Link>
                </Button>
            </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg flex items-center text-secondary">
                    <ScanSearch className="mr-2 h-5 w-5" /> Analyser un CV (IA)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                    Extrayez automatiquement les informations clés d'un CV.
                </p>
                <Button className="w-full" variant="outline" asChild>
                    <Link href="/user/resume/parse">Analyser un CV</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Mes CV Téléversés</CardTitle>
        </CardHeader>
        <CardContent>
          {dummyResumes.length > 0 ? (
            <ul className="space-y-4">
              {dummyResumes.map((resume) => (
                <li key={resume.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{resume.fileName} {resume.isPrimary && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-2">Principal</span>}</p>
                      <p className="text-xs text-muted-foreground">
                        Téléversé le : {resume.uploadDate} - Taille : {resume.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0">
                    <Button variant="ghost" size="sm" disabled><Eye className="mr-1.5 h-4 w-4"/>Aperçu</Button>
                    <Button variant="outline" size="sm" disabled><Download className="mr-1.5 h-4 w-4"/>Télécharger</Button>
                    {!resume.isPrimary && <Button variant="outline" size="sm" disabled>Définir comme principal</Button>}
                    <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600" disabled><Trash2 className="mr-1.5 h-4 w-4"/>Supprimer</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-6">Aucun CV téléversé pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    