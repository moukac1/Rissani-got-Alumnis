import { Link } from 'react-router-dom';
import { ArrowLeft, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen hero-section flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-scale-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="card-elevated p-12 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Smile className="w-12 h-12 text-primary" />
            </div>
            
            <h1 className="font-display text-3xl font-bold mb-4">
              Créer un nouveau compte <Smile className="inline-block w-8 h-8 ml-2" />
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Rejoignez notre communauté dès maintenant !
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/register" className="block">
              <Button className="w-full btn-primary h-14 text-lg">
                S'inscrire gratuitement
              </Button>
            </Link>
            
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full h-12">
                Déjà un compte ? Se connecter
              </Button>
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Une nouvelle aventure vous attend ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;