/**
 * Tableau de bord utilisateur
 * Affiche les informations et les événements à venir
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getEvents, Event, participateToEvent, cancelParticipation } from '@/services/api';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, User, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isUserParticipating = (event: Event): boolean => {
    return event.participants.includes(user?.id || '');
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Filtrer les événements futurs et les trier par date
        const futureEvents = data
          .filter((e) => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);
        setEvents(futureEvents);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les événements',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleParticipate = async (eventId: string) => {
    try {
      await participateToEvent(eventId);
      
      
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, participants: [...event.participants, user?.id || ''] }
            : event
        )
      );
      
      toast({
        title: 'Inscription confirmée',
        description: 'Vous êtes inscrit à cet événement',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de vous inscrire',
        variant: 'destructive',
      });
    }
  };
  const handleCancel = async (eventId: string) => {
    try {
      await cancelParticipation(eventId);
      
      // Retirer l'utilisateur des participants localement
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { 
                ...event, 
                participants: event.participants.filter(id => id !== user?.id) 
              }
            : event
        )
      );
      
      toast({
        title: 'Participation annulée',
        description: 'Vous n\'êtes plus inscrit à cet événement',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'annuler votre participation',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header de bienvenue */}
      <div className="mb-12 animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Bienvenue, <span className="gradient-text">{user?.prenom}</span> !
        </h1>
        <p className="text-muted-foreground">
          Retrouvez ici vos informations et les prochains événements de la communauté.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card-elevated p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Mon Profil</p>
            <p className="font-semibold">{user?.specialite || 'Non renseigné'}</p>
          </div>
        </div>

        <div className="card-elevated p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Événements à venir</p>
            <p className="font-semibold">{events.length} événement(s)</p>
          </div>
        </div>

        <div className="card-elevated p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Users className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Statut</p>
            <p className="font-semibold">
              {user?.statut === 'etudiant' ? 'Étudiant' : user?.statut === 'employe' ? 'Employé' : 'Membre'}
            </p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-semibold mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-between h-auto py-4">
              <span>Modifier mon profil</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="outline" className="w-full justify-between h-auto py-4">
              <span>Voir les événements</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/alumni">
            <Button variant="outline" className="w-full justify-between h-auto py-4">
              <span>Parcourir l'annuaire</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="secondary" className="w-full justify-between h-auto py-4" disabled>
            <span>Contacter un mentor</span>
            <span className="text-xs">Bientôt</span>
          </Button>
        </div>
      </div>

      {/* Prochains événements */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Prochains événements</h2>
          <Link to="/events">
            <Button variant="ghost" className="gap-2">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4 w-24"></div>
                <div className="h-8 bg-muted rounded mb-3"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
              key={event.id}
              event={event}
              onParticipate={handleParticipate}
              onCancel={handleCancel}
              isParticipating={isUserParticipating(event)}
            />
            ))}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
