
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck2, Users, Briefcase, ShieldCheck, MessageSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center space-x-3">
            <FileCheck2 className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold text-primary">
                Conditions Générales d'Utilisation de TalentSphere
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8 prose prose-lg max-w-none prose-headings:text-primary prose-a:text-secondary hover:prose-a:text-secondary/80">
          <p>
            Bienvenue sur TalentSphere ("Plateforme", "Service"), une plateforme SaaS de recrutement exploitée par TalentSphere Inc. ("Nous", "Notre", "Nos"). Ces Conditions Générales d'Utilisation ("CGU") régissent votre accès et votre utilisation de notre Plateforme. En accédant ou en utilisant la Plateforme, vous acceptez d'être lié par ces CGU.
          </p>

          <section className="mt-8">
            <h2 className="flex items-center"><Users className="mr-3 h-6 w-6" /> 1. Acceptation des Conditions</h2>
            <p>
              En créant un compte ou en utilisant nos Services, vous confirmez que vous avez lu, compris et accepté l'intégralité de ces CGU, ainsi que notre <Link href="/legal/privacy">Politique de Confidentialité</Link>. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><Briefcase className="mr-3 h-6 w-6" /> 2. Description du Service</h2>
            <p>
              TalentSphere est une plateforme en ligne qui connecte les entreprises (Recruteurs) cherchant à embaucher des talents, et les individus (Candidats) cherchant des opportunités d'emploi. Nous fournissons des outils pour la publication d'offres, la gestion des candidatures, la communication et d'autres fonctionnalités liées au recrutement.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><ShieldCheck className="mr-3 h-6 w-6" /> 3. Comptes Utilisateurs</h2>
            <p>
              Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités qui se déroulent sous votre compte. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte. Vous devez fournir des informations exactes et complètes lors de la création de votre compte et les maintenir à jour.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Candidats :</strong> Vous pouvez créer un profil, télécharger votre CV, postuler à des offres et communiquer avec les recruteurs.</li>
              <li><strong>Recruteurs/Entreprises :</strong> Vous pouvez publier des offres d'emploi, gérer les candidatures, rechercher des candidats et communiquer avec eux. Des frais d'abonnement peuvent s'appliquer pour les comptes Entreprise.</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center">4. Utilisation Acceptable</h2>
            <p>Vous vous engagez à ne pas utiliser la Plateforme pour :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Publier du contenu illégal, diffamatoire, discriminatoire, frauduleux ou trompeur.</li>
              <li>Violer les droits de propriété intellectuelle de tiers.</li>
              <li>Transmettre des virus, des logiciels malveillants ou tout autre code nuisible.</li>
              <li>Tenter d'obtenir un accès non autorisé à nos systèmes ou aux comptes d'autres utilisateurs.</li>
              <li>Utiliser la Plateforme à des fins autres que celles pour lesquelles elle est destinée (recrutement et recherche d'emploi légitimes).</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center">5. Contenu Utilisateur</h2>
            <p>
              Vous êtes seul responsable de tout contenu que vous soumettez, publiez ou affichez sur la Plateforme (CV, offres d'emploi, messages, etc.). En soumettant du contenu, vous nous accordez une licence mondiale, non exclusive, libre de droits et transférable pour utiliser, reproduire, distribuer, préparer des œuvres dérivées, afficher et exécuter ce contenu dans le cadre de la fourniture du Service.
            </p>
            <p>
              Nous nous réservons le droit de supprimer tout contenu qui, à notre seule discrétion, viole ces CGU ou est autrement répréhensible.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center">6. Propriété Intellectuelle</h2>
            <p>
              La Plateforme et son contenu original (à l'exception du contenu fourni par les utilisateurs), ses caractéristiques et ses fonctionnalités sont et resteront la propriété exclusive de TalentSphere Inc. et de ses concédants de licence.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center"><AlertTriangle className="mr-3 h-6 w-6" /> 7. Limitation de Responsabilité</h2>
            <p>
              Dans toute la mesure permise par la loi applicable, TalentSphere Inc. ne sera en aucun cas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris, sans s'y limiter, la perte de profits, de données, d'utilisation, de clientèle, ou d'autres pertes intangibles, résultant de (i) votre accès ou votre utilisation ou votre incapacité à accéder ou à utiliser le Service ; (ii) toute conduite ou contenu d'un tiers sur le Service ; (iii) tout contenu obtenu à partir du Service ; et (iv) l'accès, l'utilisation ou l'altération non autorisés de vos transmissions ou de votre contenu, que ce soit sur la base d'une garantie, d'un contrat, d'un délit (y compris la négligence) ou de toute autre théorie juridique, que nous ayons été informés ou non de la possibilité de tels dommages.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center">8. Modifications des Conditions</h2>
            <p>
              Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces CGU à tout moment. Si une révision est importante, nous nous efforcerons de fournir un préavis d'au moins 30 jours avant l'entrée en vigueur des nouvelles conditions. Ce qui constitue un changement important sera déterminé à notre seule discrétion.
            </p>
          </section>
          
           <section className="mt-8">
            <h2 className="flex items-center">9. Résiliation</h2>
            <p>
              Nous pouvons résilier ou suspendre votre compte et votre accès au Service immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans s'y limiter, si vous violez les CGU.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="flex items-center">10. Droit Applicable</h2>
            <p>
              Ces CGU seront régies et interprétées conformément aux lois de France, sans égard à ses dispositions relatives aux conflits de lois.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center"><MessageSquare className="mr-3 h-6 w-6" /> 11. Contactez-nous</h2>
            <p>
              Si vous avez des questions concernant ces Conditions Générales d'Utilisation, veuillez nous contacter via notre <Link href="/contact">page de contact</Link> ou par e-mail à <a href="mailto:legal@talentsphere.com">legal@talentsphere.com</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
