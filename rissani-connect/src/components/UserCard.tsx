/**
 * Carte d'affichage d'un utilisateur pour l'annuaire
 */

import { User } from '@/services/api';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, User as UserIcon } from 'lucide-react';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getStatusIcon = () => {
    if (user.statut === 'etudiant') return <GraduationCap className="w-4 h-4" />;
    if (user.statut === 'employe') return <Briefcase className="w-4 h-4" />;
    return <UserIcon className="w-4 h-4" />;
  };

  const statusLabels: Record<string, string> = {
    etudiant: 'Étudiant',
    employe: 'Employé',
  };

  return (
    <div className="card-elevated p-6 flex flex-col items-center text-center group">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.prenom} ${user.nom}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-2xl font-display font-bold text-primary-foreground">
            {getInitials(user.nom, user.prenom)}
          </span>
        )}
      </div>

      {/* Nom */}
      <h3 className="font-semibold text-lg mb-1">
        {user.prenom} {user.nom}
      </h3>

      {/* Spécialité */}
      {user.specialite && (
        <p className="text-primary font-medium text-sm mb-2">{user.specialite}</p>
      )}

      {/* Statut */}
      {user.statut && (
        <Badge variant="secondary" className="flex items-center gap-1 mb-3">
          {getStatusIcon()}
          {statusLabels[user.statut]}
        </Badge>
      )}

      {/* Infos Bac */}
      <div className="text-sm text-muted-foreground space-y-1">
        {user.filiereBac && <p>{user.filiereBac}</p>}
        {user.anneeBac && <p>Bac {user.anneeBac}</p>}
        
      </div>
      <div> {user.numTelephone && <p>{user.numTelephone}</p>}</div>
    </div>
  );
};

export default UserCard;
