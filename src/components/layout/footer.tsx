
import Link from 'next/link';
import { Copyright, Facebook, Twitter, Linkedin, Newspaper } from 'lucide-react'; // Added Newspaper for Blog

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 text-foreground/70 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"> {/* Changed to 4 columns for Blog */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">TalentSphere</h3>
            <p className="text-sm">
              La plateforme de recrutement nouvelle génération pour les PME.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-foreground/60 hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground/90 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-primary">Voir les Offres</Link></li>
              <li><Link href="/companies" className="hover:text-primary">Entreprises</Link></li> {/* Added Companies link */}
              <li><Link href="/about" className="hover:text-primary">À Propos</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Tarifs</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contactez-nous</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold text-foreground/90 mb-3">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              {/* Add more resource links here if needed */}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground/90 mb-3">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/privacy" className="hover:text-primary">Politique de Confidentialité</Link></li>
              <li><Link href="/legal/terms" className="hover:text-primary">Conditions d'Utilisation</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p className="flex items-center justify-center">
            <Copyright size={16} className="mr-1.5" /> {currentYear} TalentSphere. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
