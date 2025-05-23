
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Database, Users, Lock, RefreshCw, MessageSquare, Scale } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center space-x-3">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">
                Politique de Confidentialité de TalentSphere
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8 prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary/80">
          <p>
            Bienvenue sur TalentSphere. Nous nous engageons à protéger la confidentialité et la sécurité des données personnelles de nos utilisateurs (candidats et recruteurs). Cette Politique de Confidentialité décrit comment nous collectons, utilisons, partageons et protégeons vos informations personnelles lorsque vous utilisez notre plateforme SaaS de recrutement.
          </p>

          <section className="mt-8">
            <h2 className="flex items-center"><FileText className="mr-3 h-6 w-6" /> Informations que nous collectons</h2>
            <p>Nous pouvons collecter et traiter les types d'informations suivants vous concernant :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Informations d'identification personnelle :</strong> Nom, adresse e-mail, numéro de téléphone, adresse postale, photo de profil.
              </li>
              <li>
                <strong>Informations professionnelles (pour les candidats) :</strong> CV, historique d'emploi, formation, compétences, portfolio, lettres de motivation, attentes salariales.
              </li>
              <li>
                <strong>Informations sur l'entreprise (pour les recruteurs) :</strong> Nom de l'entreprise, informations de contact professionnel, descriptions de poste, critères de recrutement.
              </li>
              <li>
                <strong>Informations techniques :</strong> Adresse IP, type de navigateur, système d'exploitation, informations sur l'appareil, pages visitées, temps passé sur la plateforme, données d'utilisation.
              </li>
              <li>
                <strong>Communications :</strong> Toute correspondance entre vous et TalentSphere, ou entre vous et d'autres utilisateurs via notre plateforme.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><Database className="mr-3 h-6 w-6" /> Comment nous utilisons vos informations</h2>
            <p>Vos informations sont utilisées aux fins suivantes :</p>
             <ul className="list-disc pl-6 space-y-2">
              <li>Fournir, exploiter et améliorer nos services de recrutement.</li>
              <li>Permettre aux recruteurs de trouver des candidats et aux candidats de trouver des offres d'emploi.</li>
              <li>Faciliter la communication entre recruteurs et candidats.</li>
              <li>Personnaliser votre expérience sur la plateforme.</li>
              <li>Analyser l'utilisation de la plateforme pour améliorer nos services.</li>
              <li>Vous envoyer des communications relatives au service, des mises à jour et des offres promotionnelles (avec votre consentement si requis).</li>
              <li>Assurer la sécurité de notre plateforme et prévenir la fraude.</li>
              <li>Se conformer à nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><Users className="mr-3 h-6 w-6" /> Partage de vos informations</h2>
            <p>Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les cas suivants :</p>
             <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Entre recruteurs et candidats :</strong> Les informations de profil des candidats sont partagées avec les recruteurs lorsque les candidats postulent à des offres ou si leur profil correspond aux recherches des recruteurs (selon les paramètres de confidentialité du candidat). Les informations sur les offres d'emploi sont partagées avec les candidats.
              </li>
              <li>
                <strong>Fournisseurs de services tiers :</strong> Nous pouvons faire appel à des tiers pour nous aider à exploiter notre plateforme (par exemple, hébergement, analyse de données, traitement des paiements, services de messagerie). Ces tiers n'ont accès à vos informations que pour effectuer ces tâches en notre nom et sont tenus de ne pas les divulguer ou les utiliser à d'autres fins.
              </li>
              <li>
                <strong>Obligations légales :</strong> Si la loi l'exige ou en réponse à des demandes valides des autorités publiques (par exemple, un tribunal ou une agence gouvernementale).
              </li>
              <li>
                <strong>Transferts d'entreprise :</strong> En cas de fusion, acquisition, réorganisation, faillite ou autre transaction similaire, vos informations peuvent être transférées dans le cadre de cette transaction.
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><Lock className="mr-3 h-6 w-6" /> Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la divulgation, l'altération ou la destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100%.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><RefreshCw className="mr-3 h-6 w-6" /> Conservation des données</h2>
            <p>
              Nous conservons vos informations personnelles aussi longtemps que nécessaire pour atteindre les objectifs décrits dans cette politique, sauf si une période de conservation plus longue est requise ou autorisée par la loi.
            </p>
          </section>

          <section className="mt-8">
             <h2 className="flex items-center"><Scale className="mr-3 h-6 w-6" /> Vos Droits</h2>
            <p>Selon votre juridiction, vous pouvez avoir les droits suivants concernant vos informations personnelles :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le droit d'accéder à vos informations.</li>
              <li>Le droit de rectifier des informations incorrectes ou incomplètes.</li>
              <li>Le droit de demander la suppression de vos informations.</li>
              <li>Le droit de restreindre ou de vous opposer au traitement de vos informations.</li>
              <li>Le droit à la portabilité des données.</li>
              <li>Le droit de retirer votre consentement à tout moment (si le traitement est basé sur le consentement).</li>
            </ul>
            <p>Pour exercer ces droits, veuillez nous contacter via les informations fournies ci-dessous.</p>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><MessageSquare className="mr-3 h-6 w-6" /> Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page et en mettant à jour la date de "Dernière mise à jour".
            </p>
          </section>

          <section className="mt-8">
            <h3>Contactez-nous</h3>
            <p>
              Si vous avez des questions concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à <Link href="/contact">notre page de contact</Link> ou par e-mail à <a href="mailto:privacy@talentsphere.com">privacy@talentsphere.com</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
