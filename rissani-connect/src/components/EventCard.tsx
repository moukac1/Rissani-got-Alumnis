/**
 * Carte d'affichage d'un événement
 */

import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  onParticipate?: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
  isParticipating?: boolean;
  showActions?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onParticipate,
  onCancel,
  isParticipating = false,
  showActions = true,
}) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  const typeLabels: Record<string, string> = {
    forum: 'Forum d\'orientation',
    rencontre: 'Rencontre',
    autre: 'Événement',
  };

  const typeColors: Record<string, string> = {
    forum: 'bg-accent text-accent-foreground',
    rencontre: 'bg-primary text-primary-foreground',
    autre: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="card-elevated p-6 flex flex-col h-full group">
      <div className="flex items-start justify-between mb-4">
        <Badge className={`${typeColors[event.type]} text-xs font-medium`}>
          {typeLabels[event.type]}
        </Badge>
        {isPast && (
          <Badge variant="secondary" className="text-xs">
            Passé
          </Badge>
        )}
      </div>

      <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
        {event.titre}
      </h3>

      <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
        {event.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>
            {eventDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{event.lieu}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>{event.participants.length} participant(s)</span>
        </div>
      </div>

      {showActions && !isPast && (
  <>
    {isParticipating ? (
      <Button
        onClick={() => onCancel?.(event.id)}
        variant="outline"
        className="w-full mt-auto text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        Annuler ma participation
      </Button>
    ) : (
      <Button
        onClick={() => onParticipate?.(event.id)}
        variant="default"
        className="w-full mt-auto"
      >
        Participer
      </Button>
    )}
  </>
)}
    </div>
  );
};

export default EventCard;
