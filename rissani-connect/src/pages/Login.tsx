import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState(''); // Nouveau state pour erreur de login

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); // Réinitialiser l'erreur de login

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue !',
      });
      // Rediriger vers la page admin si c'est un admin
      if (email === 'admin@rissani.ma') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      // Gestion améliorée des erreurs
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (error.response?.status === 401) {
        errorMessage = 'Identifiants incorrects. Vérifiez votre email et mot de passe.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Compte désactivé. Contactez l\'administrateur.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Aucun compte trouvé avec cet email.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Trop de tentatives. Veuillez réessayer dans quelques minutes.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Problème serveur. Veuillez réessayer plus tard.';
      } else if (!navigator.onLine) {
        errorMessage = 'Pas de connexion internet. Vérifiez votre connexion.';
      }
      
      setLoginError(errorMessage);
      
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effacer les erreurs quand l'utilisateur corrige
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email || loginError) {
      setErrors({...errors, email: undefined});
      setLoginError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password || loginError) {
      setErrors({...errors, password: undefined});
      setLoginError('');
    }
  };

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

        <div className="card-elevated p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Connexion</h1>
            <p className="text-muted-foreground mt-2">
              Accédez à votre espace membre
            </p>
          </div>

          {/* Affichage de l'erreur de login */}
          {loginError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-destructive font-medium">Échec de connexion</p>
                  <p className="text-destructive/90 text-sm mt-1">{loginError}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={handleEmailChange}
                className={`input-styled transition-all duration-200 ${errors.email ? 'border-destructive focus:border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-destructive text-sm animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`input-styled pr-10 transition-all duration-200 ${errors.password ? 'border-destructive focus:border-destructive' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Connexion...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:underline font-medium transition-colors"
                onClick={(e) => isLoading && e.preventDefault()}
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;