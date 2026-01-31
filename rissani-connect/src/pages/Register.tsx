/**
 * Page d'inscription
 * Champs obligatoires : nom, prénom, email, mot de passe
 * Champs facultatifs : sexe, année bac, filière, statut, spécialité
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numTelephone: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    anneeBac: '',
    filiereBac: '',
    statut: '',
    specialite: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.numTelephone.trim()) newErrors.numTelephone = 'Le nom est requis';

    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        numTelephone: formData.numTelephone,
        sexe: formData.sexe || undefined,
        anneeBac: formData.anneeBac ? parseInt(formData.anneeBac) : undefined,
        filiereBac: formData.filiereBac || undefined,
        statut: formData.statut || undefined,
        specialite: formData.specialite || undefined,
      });
      toast({
        title: 'Inscription réussie',
        description: 'Bienvenue dans la communauté !',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen hero-section py-12 px-4">
      <div className="container max-w-lg mx-auto animate-scale-in">
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
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Inscription</h1>
            <p className="text-muted-foreground mt-2">
              Rejoignez la communauté des anciens de Rissani
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs obligatoires */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  className={`input-styled ${errors.prenom ? 'border-destructive' : ''}`}
                />
                {errors.prenom && <p className="text-destructive text-sm">{errors.prenom}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  className={`input-styled ${errors.nom ? 'border-destructive' : ''}`}
                />
                {errors.nom && <p className="text-destructive text-sm">{errors.nom}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`input-styled ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numTelephone">Num telephone *</Label>
              <Input
                id="numTelephone"
                
                placeholder="votre numéro de téléphone"
                value={formData.numTelephone}
                onChange={(e) => handleChange('numTelephone', e.target.value)}
                className={`input-styled ${errors.numTelephone ? 'border-destructive' : ''}`}
              />
              {errors.numTelephone && <p className="text-destructive text-sm">{errors.numTelephone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`input-styled pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`input-styled ${errors.confirmPassword ? 'border-destructive' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Toggle pour les champs facultatifs */}
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2 border border-dashed border-border rounded-lg"
            >
              {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showOptional ? 'Masquer' : 'Afficher'} les informations facultatives
            </button>

            {/* Champs facultatifs */}
            {showOptional && (
              <div className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sexe">Sexe</Label>
                    <Select value={formData.sexe} onValueChange={(v) => handleChange('sexe', v)}>
                      <SelectTrigger className="input-styled">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anneeBac">Année du Bac</Label>
                    <Select value={formData.anneeBac} onValueChange={(v) => handleChange('anneeBac', v)}>
                      <SelectTrigger className="input-styled">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filiereBac">Filière du Bac</Label>
                  <Select value={formData.filiereBac} onValueChange={(v) => handleChange('filiereBac', v)}>
                    <SelectTrigger className="input-styled">
                      <SelectValue placeholder="Sélectionner votre filière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sciences Mathématiques A">Sciences Mathématiques A</SelectItem>
                      <SelectItem value="Sciences Mathématiques B">Sciences Mathématiques B</SelectItem>
                      <SelectItem value="Sciences Expérimentales">Sciences Expérimentales</SelectItem>
                      <SelectItem value="Sciences Économiques">Sciences Économiques</SelectItem>
                      <SelectItem value="Lettres Modernes">Lettres Modernes</SelectItem>
                      <SelectItem value="Arts Appliqués">Arts Appliqués</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="statut">Statut actuel</Label>
                    <Select value={formData.statut} onValueChange={(v) => handleChange('statut', v)}>
                      <SelectTrigger className="input-styled">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="etudiant">Étudiant</SelectItem>
                        <SelectItem value="employe">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialite">Spécialité</Label>
                    <Input
                      id="specialite"
                      placeholder="Ex: Informatique"
                      value={formData.specialite}
                      onChange={(e) => handleChange('specialite', e.target.value)}
                      className="input-styled"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
              {isLoading ? 'Inscription...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
