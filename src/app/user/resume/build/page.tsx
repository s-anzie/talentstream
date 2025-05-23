
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Briefcase, Building, CalendarDays, Download, Edit3, FolderGit2, GraduationCap, Languages, Link as LinkIcon, Lightbulb, Mail, MapPin, Phone, PlusCircle, Save, Trash2, UserCircle, Wand2 } from "lucide-react";
import type { CVData, ExperienceEntry, EducationEntry, ProjectEntry, LanguageEntry, LanguageLevel } from "@/lib/types";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    githubUrl: "",
  },
  summary: "",
  skills: "",
  experiences: [],
  education: [],
  projects: [],
  languages: [],
  interests: "",
};

const languageLevels: LanguageLevel[] = ["Débutant", "Intermédiaire", "Avancé", "C1/C2 (Courant)", "Langue Maternelle"];
const initialNewExperience: Omit<ExperienceEntry, 'id'> = { title: "", company: "", dates: "", description: "" };
const initialNewEducation: Omit<EducationEntry, 'id'> = { degree: "", institution: "", dates: "" };
const initialNewProject: Omit<ProjectEntry, 'id'> = { title: "", description: "", dates: "", link: "" };
const initialNewLanguage: Omit<LanguageEntry, 'id'> = { name: "", level: "Intermédiaire" };


export default function BuildResumePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [cvData, setCvData] = useState<CVData>(initialCVData);

  // Form states for new/editing entries
  const [currentExperience, setCurrentExperience] = useState<Omit<ExperienceEntry, 'id'> & { id?: string }>(initialNewExperience);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  const [currentEducation, setCurrentEducation] = useState<Omit<EducationEntry, 'id'> & { id?: string }>(initialNewEducation);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);

  const [currentProject, setCurrentProject] = useState<Omit<ProjectEntry, 'id'> & { id?: string }>(initialNewProject);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [currentLanguage, setCurrentLanguage] = useState<Omit<LanguageEntry, 'id'> & { id?: string }>(initialNewLanguage);
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);


  useEffect(() => {
    const savedCV = localStorage.getItem("cvBuilderData");
    if (savedCV) {
      try {
        setCvData(JSON.parse(savedCV));
        toast({ title: "Progression Chargée", description: "Votre CV sauvegardé automatiquement a été chargé." });
      } catch (error) {
        console.error("Failed to parse saved CV data:", error);
        toast({ title: "Erreur de Chargement", description: "Impossible de charger les données sauvegardées.", variant: "destructive" });
      }
    }
  }, [toast]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleGenericChange = (field: keyof CVData, value: string) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  // --- Experience Handlers ---
  const handleExperienceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveExperience = () => {
    if (!currentExperience.title || !currentExperience.company) {
      toast({ title: "Champs manquants", description: "Veuillez remplir le titre et l'entreprise pour l'expérience.", variant: "destructive" });
      return;
    }
    if (editingExperienceId) {
      setCvData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp => exp.id === editingExperienceId ? { ...currentExperience, id: editingExperienceId } as ExperienceEntry : exp)
      }));
      setEditingExperienceId(null);
      toast({ title: "Expérience Mise à Jour"});
    } else {
      setCvData(prev => ({ ...prev, experiences: [...prev.experiences, { ...currentExperience, id: uuidv4() } as ExperienceEntry] }));
      toast({ title: "Expérience Ajoutée"});
    }
    setCurrentExperience(initialNewExperience);
  };

  const handleEditExperience = (id: string) => {
    const expToEdit = cvData.experiences.find(exp => exp.id === id);
    if (expToEdit) {
      setCurrentExperience(expToEdit);
      setEditingExperienceId(id);
    }
  };
  
  const cancelEditExperience = () => {
    setCurrentExperience(initialNewExperience);
    setEditingExperienceId(null);
  };

  const deleteExperience = (id: string) => {
    setCvData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
    if (id === editingExperienceId) cancelEditExperience();
  };

  // --- Education Handlers ---
  const handleEducationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEducation = () => {
     if (!currentEducation.degree || !currentEducation.institution) {
      toast({ title: "Champs manquants", description: "Veuillez remplir le diplôme et l'établissement.", variant: "destructive" });
      return;
    }
    if (editingEducationId) {
      setCvData(prev => ({
        ...prev,
        education: prev.education.map(edu => edu.id === editingEducationId ? { ...currentEducation, id: editingEducationId } as EducationEntry : edu)
      }));
      setEditingEducationId(null);
      toast({ title: "Formation Mise à Jour"});
    } else {
      setCvData(prev => ({ ...prev, education: [...prev.education, { ...currentEducation, id: uuidv4() } as EducationEntry] }));
      toast({ title: "Formation Ajoutée"});
    }
    setCurrentEducation(initialNewEducation);
  };

  const handleEditEducation = (id: string) => {
    const eduToEdit = cvData.education.find(edu => edu.id === id);
    if (eduToEdit) {
      setCurrentEducation(eduToEdit);
      setEditingEducationId(id);
    }
  };
  
  const cancelEditEducation = () => {
    setCurrentEducation(initialNewEducation);
    setEditingEducationId(null);
  };

  const deleteEducation = (id: string) => {
    setCvData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
     if (id === editingEducationId) cancelEditEducation();
  };

  // --- Project Handlers ---
  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProject = () => {
    if (!currentProject.title) {
      toast({ title: "Champ manquant", description: "Veuillez remplir au moins le titre du projet.", variant: "destructive" });
      return;
    }
    if (editingProjectId) {
      setCvData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => proj.id === editingProjectId ? { ...currentProject, id: editingProjectId } as ProjectEntry : proj)
      }));
      setEditingProjectId(null);
      toast({ title: "Projet Mis à Jour"});
    } else {
      setCvData(prev => ({ ...prev, projects: [...prev.projects, { ...currentProject, id: uuidv4() } as ProjectEntry] }));
       toast({ title: "Projet Ajouté"});
    }
    setCurrentProject(initialNewProject);
  };

  const handleEditProject = (id: string) => {
    const projToEdit = cvData.projects.find(proj => proj.id === id);
    if (projToEdit) {
      setCurrentProject(projToEdit);
      setEditingProjectId(id);
    }
  };

  const cancelEditProject = () => {
    setCurrentProject(initialNewProject);
    setEditingProjectId(null);
  };

  const deleteProject = (id: string) => {
    setCvData(prev => ({ ...prev, projects: prev.projects.filter(proj => proj.id !== id) }));
    if (id === editingProjectId) cancelEditProject();
  };
  
  // --- Language Handlers ---
  const handleLanguageFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLanguage(prev => ({ ...prev, name: e.target.value }));
  };
  const handleLanguageLevelChange = (value: LanguageLevel) => {
    setCurrentLanguage(prev => ({ ...prev, level: value }));
  };

  const handleSaveLanguage = () => {
     if (!currentLanguage.name) {
      toast({ title: "Champ manquant", description: "Veuillez indiquer le nom de la langue.", variant: "destructive" });
      return;
    }
    if (editingLanguageId) {
      setCvData(prev => ({
        ...prev,
        languages: prev.languages.map(lang => lang.id === editingLanguageId ? { ...currentLanguage, id: editingLanguageId } as LanguageEntry : lang)
      }));
      setEditingLanguageId(null);
      toast({ title: "Langue Mise à Jour"});
    } else {
      setCvData(prev => ({ ...prev, languages: [...prev.languages, { ...currentLanguage, id: uuidv4() } as LanguageEntry] }));
      toast({ title: "Langue Ajoutée"});
    }
    setCurrentLanguage(initialNewLanguage);
  };

  const handleEditLanguage = (id: string) => {
    const langToEdit = cvData.languages.find(lang => lang.id === id);
    if (langToEdit) {
      setCurrentLanguage(langToEdit);
      setEditingLanguageId(id);
    }
  };

  const cancelEditLanguage = () => {
    setCurrentLanguage(initialNewLanguage);
    setEditingLanguageId(null);
  };

  const deleteLanguage = (id: string) => {
    setCvData(prev => ({ ...prev, languages: prev.languages.filter(lang => lang.id !== id) }));
    if (id === editingLanguageId) cancelEditLanguage();
  };

  const handleSaveCV = () => {
    localStorage.setItem("cvBuilderData", JSON.stringify(cvData));
    toast({ title: "Progression Sauvegardée !", description: "Votre CV a été sauvegardé localement." });
  };

  const handleLoadCV = () => {
    const savedCV = localStorage.getItem("cvBuilderData");
    if (savedCV) {
      try {
        setCvData(JSON.parse(savedCV));
        toast({ title: "Progression Chargée", description: "Votre CV sauvegardé a été chargé." });
      } catch (error) {
         toast({ title: "Erreur de Chargement", description: "Impossible de charger les données sauvegardées.", variant: "destructive" });
      }
    } else {
      toast({ title: "Aucune Donnée Sauvegardée", description: "Aucun CV n'a été trouvé dans le stockage local." });
    }
  };

  const handleDirectDownloadPDF = async () => {
    setIsDownloading(true);
    const cvPreviewElement = document.getElementById('cv-preview-content'); 
    if (!cvPreviewElement) {
      toast({ title: "Erreur", description: "Impossible de trouver l'élément CV à télécharger.", variant: "destructive" });
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(cvPreviewElement, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const pageMargin = 10; 

      const contentWidth = pdfWidth - (2 * pageMargin);
      const contentHeight = pdfHeight - (2 * pageMargin);

      const imgProps = pdf.getImageProperties(imgData);
      const aspectRatio = imgProps.width / imgProps.height;
      
      let imgRenderWidth = contentWidth;
      let imgRenderHeight = contentWidth / aspectRatio;

      if (imgRenderHeight > contentHeight) {
        imgRenderHeight = contentHeight;
        imgRenderWidth = contentHeight * aspectRatio;
      }
      
      const xOffset = pageMargin + (contentWidth - imgRenderWidth) / 2;
      const yOffset = pageMargin + (contentHeight - imgRenderHeight) / 2;

      if (imgProps.height * (imgRenderWidth / imgProps.width) > contentHeight) {
        let currentY = 0;
        const originalImgHeight = imgProps.height;
        const originalImgWidth = imgProps.width;
        const scaleFactor = imgRenderWidth / originalImgWidth; 
        
        const scaledPageContentHeight = contentHeight / scaleFactor; 

        while(currentY < originalImgHeight) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = originalImgWidth;
            const sliceHeight = Math.min(scaledPageContentHeight, originalImgHeight - currentY);
            tempCanvas.height = sliceHeight;
            const ctx = tempCanvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(canvas, 0, currentY, originalImgWidth, sliceHeight, 0, 0, originalImgWidth, sliceHeight);
                const sliceImgData = tempCanvas.toDataURL('image/png');
                const actualSliceImgHeightMM = sliceHeight * scaleFactor;
                
                pdf.addImage(sliceImgData, 'PNG', pageMargin, pageMargin, imgRenderWidth, actualSliceImgHeightMM);
                currentY += sliceHeight;
                if (currentY < originalImgHeight) {
                    pdf.addPage();
                }
            } else {
                break; 
            }
        }
      } else {
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgRenderWidth, imgRenderHeight);
      }
      
      pdf.save('cv-talentsphere.pdf');
      toast({ title: "Téléchargement Initié", description: "Votre CV est en cours de téléchargement." });
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast({ title: "Erreur de Génération PDF", description: "Une erreur est survenue lors de la création du PDF.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <CardTitle className="text-2xl text-primary flex items-center">
          <Wand2 className="mr-3 h-7 w-7" /> Bâtisseur de CV
        </CardTitle>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleLoadCV} className="flex-1 sm:flex-initial">Charger Progrès</Button>
          <Button onClick={handleSaveCV} className="flex-1 sm:flex-initial"><Save className="mr-2 h-4 w-4" /> Sauvegarder Progrès</Button>
           <Button onClick={handleDirectDownloadPDF} variant="secondary" className="flex-1 sm:flex-initial" disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" /> Génération PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Télécharger en PDF (Direct)
              </>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={() => router.push("/user/resume")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardDescription>
        Créez ou modifiez votre CV professionnel. L'aperçu se met à jour en temps réel.
        <br />Pour le téléchargement direct en PDF, assurez-vous d'avoir installé ` + "`jspdf` et `html2canvas`" + ` dans votre projet.
      </CardDescription>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ScrollArea className="h-auto lg:h-[calc(100vh-10rem)] lg:pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><UserCircle className="mr-2 text-secondary"/>Informations Personnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="fullName">Nom Complet</Label><Input id="fullName" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="Ex: Marie Curie" /></div>
                  <div><Label htmlFor="professionalTitle">Titre Professionnel</Label><Input id="professionalTitle" name="professionalTitle" value={cvData.personalInfo.professionalTitle} onChange={handlePersonalInfoChange} placeholder="Ex: Chercheuse Scientifique" /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="marie.curie@example.com" /></div>
                  <div><Label htmlFor="phone">Téléphone</Label><Input id="phone" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="+33 1 23 45 67 89" /></div>
                </div>
                <div><Label htmlFor="location">Localisation</Label><Input id="location" name="location" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="Paris, France" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="linkedinUrl">LinkedIn</Label><Input id="linkedinUrl" name="linkedinUrl" value={cvData.personalInfo.linkedinUrl} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/mariecurie" /></div>
                  <div><Label htmlFor="portfolioUrl">Portfolio/Site Web</Label><Input id="portfolioUrl" name="portfolioUrl" value={cvData.personalInfo.portfolioUrl} onChange={handlePersonalInfoChange} placeholder="mariecurie.dev" /></div>
                </div>
                <div><Label htmlFor="githubUrl">GitHub (Optionnel)</Label><Input id="githubUrl" name="githubUrl" value={cvData.personalInfo.githubUrl} onChange={handlePersonalInfoChange} placeholder="github.com/mariecurie" /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 text-secondary"/>Résumé / Objectif</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={cvData.summary} onChange={(e) => handleGenericChange('summary', e.target.value)} placeholder="Décrivez brièvement votre profil et vos objectifs..." rows={5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><Wand2 className="mr-2 text-secondary"/>Compétences</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={cvData.skills} onChange={(e) => handleGenericChange('skills', e.target.value)} placeholder="Listez vos compétences, séparées par des virgules (ex: React, Node.js, Gestion de projet)" rows={4} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 text-secondary"/>Expériences Professionnelles</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cvData.experiences.map(exp => (
                  <div key={exp.id} className="p-3 border rounded-md relative">
                    <p className="font-semibold">{exp.title} chez {exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.dates}</p>
                    <p className="text-sm mt-1 whitespace-pre-line">{exp.description}</p>
                    <div className="absolute top-1 right-1 flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditExperience(exp.id)} className="h-7 w-7"><Edit3 className="h-4 w-4 text-blue-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 p-3 border border-dashed rounded-md">
                  <h4 className="font-medium">{editingExperienceId ? "Modifier l'expérience" : "Ajouter une expérience"}</h4>
                  <div><Label htmlFor="expTitle">Titre du Poste</Label><Input id="expTitle" name="title" value={currentExperience.title || ""} onChange={handleExperienceFormChange} /></div>
                  <div><Label htmlFor="expCompany">Entreprise</Label><Input id="expCompany" name="company" value={currentExperience.company || ""} onChange={handleExperienceFormChange} /></div>
                  <div><Label htmlFor="expDates">Dates</Label><Input id="expDates" name="dates" value={currentExperience.dates || ""} onChange={handleExperienceFormChange} placeholder="Ex: Jan 2020 - Présent"/></div>
                  <div><Label htmlFor="expDesc">Description</Label><Textarea id="expDesc" name="description" value={currentExperience.description || ""} onChange={handleExperienceFormChange} rows={3} /></div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveExperience} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" />{editingExperienceId ? "Mettre à Jour" : "Ajouter"}</Button>
                    {editingExperienceId && <Button onClick={cancelEditExperience} size="sm" variant="ghost">Annuler</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><GraduationCap className="mr-2 text-secondary"/>Formations et Diplômes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cvData.education.map(edu => (
                  <div key={edu.id} className="p-3 border rounded-md relative">
                    <p className="font-semibold">{edu.degree} - {edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.dates}</p>
                     <div className="absolute top-1 right-1 flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEducation(edu.id)} className="h-7 w-7"><Edit3 className="h-4 w-4 text-blue-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 p-3 border border-dashed rounded-md">
                  <h4 className="font-medium">{editingEducationId ? "Modifier la formation" : "Ajouter une formation"}</h4>
                  <div><Label htmlFor="eduDegree">Diplôme</Label><Input id="eduDegree" name="degree" value={currentEducation.degree || ""} onChange={handleEducationFormChange} /></div>
                  <div><Label htmlFor="eduInstitution">Établissement</Label><Input id="eduInstitution" name="institution" value={currentEducation.institution || ""} onChange={handleEducationFormChange} /></div>
                  <div><Label htmlFor="eduDates">Dates</Label><Input id="eduDates" name="dates" value={currentEducation.dates || ""} onChange={handleEducationFormChange} placeholder="Ex: 2018 - 2020"/></div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEducation} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" />{editingEducationId ? "Mettre à Jour" : "Ajouter"}</Button>
                    {editingEducationId && <Button onClick={cancelEditEducation} size="sm" variant="ghost">Annuler</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><FolderGit2 className="mr-2 text-secondary"/>Projets</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cvData.projects.map(proj => (
                  <div key={proj.id} className="p-3 border rounded-md relative">
                    <p className="font-semibold">{proj.title} <span className="text-xs text-muted-foreground">({proj.dates})</span></p>
                    <p className="text-sm mt-1 whitespace-pre-line">{proj.description}</p>
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center mt-1"><LinkIcon className="mr-1 h-3 w-3"/>Voir le projet</a>}
                    <div className="absolute top-1 right-1 flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProject(proj.id)} className="h-7 w-7"><Edit3 className="h-4 w-4 text-blue-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProject(proj.id)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 p-3 border border-dashed rounded-md">
                  <h4 className="font-medium">{editingProjectId ? "Modifier le projet" : "Ajouter un projet"}</h4>
                  <div><Label htmlFor="projTitle">Titre du Projet</Label><Input id="projTitle" name="title" value={currentProject.title || ""} onChange={handleProjectFormChange} /></div>
                  <div><Label htmlFor="projDates">Dates</Label><Input id="projDates" name="dates" value={currentProject.dates || ""} onChange={handleProjectFormChange} placeholder="Ex: 2021"/></div>
                  <div><Label htmlFor="projLink">Lien (Optionnel)</Label><Input id="projLink" name="link" value={currentProject.link || ""} onChange={handleProjectFormChange} placeholder="https://github.com/projet"/></div>
                  <div><Label htmlFor="projDesc">Description</Label><Textarea id="projDesc" name="description" value={currentProject.description || ""} onChange={handleProjectFormChange} rows={3} /></div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProject} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" />{editingProjectId ? "Mettre à Jour" : "Ajouter"}</Button>
                    {editingProjectId && <Button onClick={cancelEditProject} size="sm" variant="ghost">Annuler</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><Languages className="mr-2 text-secondary"/>Langues</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cvData.languages.map(lang => (
                  <div key={lang.id} className="p-3 border rounded-md relative flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">{lang.level}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditLanguage(lang.id)} className="h-7 w-7"><Edit3 className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLanguage(lang.id)} className="h-7 w-7"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 p-3 border border-dashed rounded-md">
                  <h4 className="font-medium">{editingLanguageId ? "Modifier la langue" : "Ajouter une langue"}</h4>
                  <div><Label htmlFor="langName">Langue</Label><Input id="langName" name="name" value={currentLanguage.name || ""} onChange={handleLanguageFormChange} placeholder="Ex: Anglais"/></div>
                  <div>
                    <Label htmlFor="langLevel">Niveau</Label>
                    <Select value={currentLanguage.level} onValueChange={handleLanguageLevelChange}>
                      <SelectTrigger id="langLevel"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {languageLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveLanguage} size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" />{editingLanguageId ? "Mettre à Jour" : "Ajouter"}</Button>
                    {editingLanguageId && <Button onClick={cancelEditLanguage} size="sm" variant="ghost">Annuler</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 text-secondary"/>Centres d'Intérêt</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={cvData.interests} onChange={(e) => handleGenericChange('interests', e.target.value)} placeholder="Listez vos centres d'intérêt, séparés par des virgules (ex: Photographie, Randonnée, Lecture)" rows={3} />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div id="cv-preview-container" className="lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-10rem)]">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle className="text-xl text-center text-primary">Aperçu du CV</CardTitle>
            </CardHeader>
            {/* Ensure this CardContent has the ID cv-preview-content */}
            <CardContent id="cv-preview-content" className="w-full h-[calc(100%-5rem)] overflow-y-auto p-2 sm:p-4 md:p-6 bg-white text-black aspect-[210/297]">
              {/* CV Preview Structure - This will be rendered by html2canvas */}
              <div className="max-w-2xl mx-auto"> {/* A4-like proportions, can be adjusted */}
                <header className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{cvData.personalInfo.fullName || "Votre Nom Complet"}</h1>
                  <p className="text-md text-gray-600">{cvData.personalInfo.professionalTitle || "Votre Titre Professionnel"}</p>
                  <div className="flex justify-center items-center gap-x-3 gap-y-1 text-[10px] text-gray-500 mt-1.5 flex-wrap">
                    {cvData.personalInfo.email && <span className="flex items-center"><Mail className="mr-1 h-2.5 w-2.5"/>{cvData.personalInfo.email}</span>}
                    {cvData.personalInfo.phone && <span className="flex items-center"><Phone className="mr-1 h-2.5 w-2.5"/>{cvData.personalInfo.phone}</span>}
                    {cvData.personalInfo.location && <span className="flex items-center"><MapPin className="mr-1 h-2.5 w-2.5"/>{cvData.personalInfo.location}</span>}
                  </div>
                  <div className="flex justify-center items-center gap-x-2.5 text-[10px] text-blue-600 mt-1 flex-wrap">
                    {cvData.personalInfo.linkedinUrl && <a href={cvData.personalInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center"><LinkIcon className="mr-1 h-2.5 w-2.5"/>LinkedIn</a>}
                    {cvData.personalInfo.portfolioUrl && <a href={cvData.personalInfo.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center"><LinkIcon className="mr-1 h-2.5 w-2.5"/>Portfolio</a>}
                    {cvData.personalInfo.githubUrl && <a href={cvData.personalInfo.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center"><LinkIcon className="mr-1 h-2.5 w-2.5"/>GitHub</a>}
                  </div>
                </header>

                {cvData.summary && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">RÉSUMÉ</h2>
                    <p className="text-xs text-gray-700 whitespace-pre-line">{cvData.summary}</p>
                  </section>
                )}

                 {cvData.experiences.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">EXPÉRIENCES PROFESSIONNELLES</h2>
                    {cvData.experiences.map(exp => (
                      <div key={exp.id} className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">{exp.title || "Titre non spécifié"}</h3>
                        <p className="text-xs font-medium text-gray-600">{exp.company || "Entreprise non spécifiée"} <span className="text-[10px] text-gray-500">| {exp.dates || "Dates non spécifiées"}</span></p>
                        <p className="text-[10px] text-gray-700 mt-0.5 whitespace-pre-line">{exp.description || "Description non spécifiée"}</p>
                      </div>
                    ))}
                  </section>
                )}

                {cvData.education.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">FORMATIONS</h2>
                    {cvData.education.map(edu => (
                      <div key={edu.id} className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">{edu.degree || "Diplôme non spécifié"}</h3>
                        <p className="text-xs font-medium text-gray-600">{edu.institution || "Établissement non spécifié"} <span className="text-[10px] text-gray-500">| {edu.dates || "Dates non spécifiées"}</span></p>
                      </div>
                    ))}
                  </section>
                )}

                {cvData.skills && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">COMPÉTENCES</h2>
                    <div className="flex flex-wrap gap-1">
                      {cvData.skills.split(',').map(skill => skill.trim()).filter(skill => skill).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-[9px] px-1.5 py-0.5 rounded-full">{skill}</span>
                      ))}
                    </div>
                  </section>
                )}
                
                {cvData.projects.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">PROJETS</h2>
                    {cvData.projects.map(proj => (
                      <div key={proj.id} className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-800">{proj.title || "Titre non spécifié"} <span className="text-[10px] text-gray-500">({proj.dates || "Dates non spécifiées"})</span></h3>
                        {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center mb-0.5"><LinkIcon className="mr-1 h-2.5 w-2.5"/>Lien vers le projet</a>}
                        <p className="text-[10px] text-gray-700 mt-0.5 whitespace-pre-line">{proj.description || "Description non spécifiée"}</p>
                      </div>
                    ))}
                  </section>
                )}

                {cvData.languages.length > 0 && (
                  <section className="mb-3">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">LANGUES</h2>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {cvData.languages.map(lang => (
                      <div key={lang.id}>
                        <p className="text-xs font-medium text-gray-800">{lang.name || "Langue"}: <span className="text-[10px] text-gray-600">{lang.level || "Niveau non spécifié"}</span></p>
                      </div>
                    ))}
                    </div>
                  </section>
                )}

                {cvData.interests && (
                  <section>
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-0.5 mb-1 text-gray-700">CENTRES D'INTÉRÊT</h2>
                    <p className="text-xs text-gray-700">{cvData.interests}</p>
                  </section>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    