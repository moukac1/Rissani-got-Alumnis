/**
 * Page de profil utilisateur
 * Permet de voir et modifier ses informations
 */

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    numTelephone: user?.numTelephone || '',
    sexe: user?.sexe || '',
    anneeBac: user?.anneeBac?.toString() || '',
    filiereBac: user?.filiereBac || '',
    statut: user?.statut || '',
    specialite: user?.specialite || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData = {
        nom: formData.nom,
        prenom: formData.prenom,
        numTelephone: formData.numTelephone,
        sexe: formData.sexe as 'homme' | 'femme' | undefined,
        anneeBac: formData.anneeBac ? parseInt(formData.anneeBac) : undefined,
        filiereBac: formData.filiereBac || undefined,
        statut: formData.statut as 'etudiant' | 'employe' | undefined,
        specialite: formData.specialite || undefined,
      };
      await updateUserProfile(updatedData);
      updateUser(updatedData);
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const getInitials = () => {
    return `${user?.prenom?.charAt(0) || ''}${user?.nom?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Mon Profil</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>

        <div className="card-elevated p-8">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-display font-bold text-primary-foreground">
                  {getInitials()}
                </span>
              )}
            </div>
            <h2 className="font-semibold text-xl">
              {user?.prenom} {user?.nom}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informations personnelles
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  {isEditing ? (
                    <Input
                      value={formData.prenom}
                      onChange={(e) => handleChange('prenom', e.target.value)}
                      className="input-styled"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">{user?.prenom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nom</Label>
                  {isEditing ? (
                    <Input
                      value={formData.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      className="input-styled"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">{user?.nom}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="py-2 px-3 bg-secondary rounded-lg text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
              </div>
              <div className="space-y-2">
                  <Label>Num Telephone</Label>
                  {isEditing ? (
                    <Input
                      value={formData.numTelephone}
                      onChange={(e) => handleChange('num tel', e.target.value)}
                      className="input-styled"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">{user?.numTelephone}</p>
                  )}
                </div>
              

              <div className="space-y-2">
                <Label>Sexe</Label>
                {isEditing ? (
                  <Select value={formData.sexe} onValueChange={(v) => handleChange('sexe', v)}>
                    <SelectTrigger className="input-styled">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homme">Homme</SelectItem>
                      <SelectItem value="femme">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2 px-3 bg-secondary rounded-lg">
                    {user?.sexe === 'homme' ? 'Homme' : user?.sexe === 'femme' ? 'Femme' : 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>

            {/* Parcours scolaire */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-semibold text-lg">Parcours scolaire</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Année du Bac</Label>
                  {isEditing ? (
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
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">
                      {user?.anneeBac || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Filière du Bac</Label>
                  {isEditing ? (
                    <Select value={formData.filiereBac} onValueChange={(v) => handleChange('filiereBac', v)}>
                      <SelectTrigger className="input-styled">
                        <SelectValue placeholder="Sélectionner" />
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
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">
                      {user?.filiereBac || 'Non renseigné'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Situation actuelle */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-semibold text-lg">Situation actuelle</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  {isEditing ? (
                    <Select value={formData.statut} onValueChange={(v) => handleChange('statut', v)}>
                      <SelectTrigger className="input-styled">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="etudiant">Étudiant</SelectItem>
                        <SelectItem value="employe">Employé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">
                      {user?.statut === 'etudiant' ? 'Étudiant' : user?.statut === 'employe' ? 'Employé' : 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Spécialité</Label>
                  {isEditing ? (
                    <Input
                      value={formData.specialite}
                      onChange={(e) => handleChange('specialite', e.target.value)}
                      placeholder="Ex: Informatique"
                      className="input-styled"
                    />
                  ) : (
                    <p className="py-2 px-3 bg-secondary rounded-lg">
                      {user?.specialite || 'Non renseigné'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            {isEditing && (
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 btn-primary" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
