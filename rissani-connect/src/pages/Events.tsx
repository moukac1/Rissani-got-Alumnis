/**
 * Page liste des événements
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getEvents, Event, participateToEvent, cancelParticipation } from '@/services/api';
import EventCard from '@/components/EventCard';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock } from 'lucide-react';

const Events = () => {
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
        setEvents(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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
      
      // Mettre à jour l'événement localement
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

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  const renderEvents = (eventList: Event[], showActions: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-elevated p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4 w-24"></div>
              <div className="h-8 bg-muted rounded mb-3"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      );
    }

    if (eventList.length === 0) {
      return (
        <div className="card-elevated p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun événement dans cette catégorie.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventList.map((event) => (
          <EventCard
          key={event.id}
          event={event}
          onParticipate={handleParticipate}
          onCancel={handleCancel}
          isParticipating={isUserParticipating(event)}
          showActions={showActions}
        />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Événements</h1>
          <p className="text-muted-foreground">
            Découvrez et participez aux événements de la communauté
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="w-4 h-4" />
              À venir ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <Clock className="w-4 h-4" />
              Passés ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="animate-fade-in">
            {renderEvents(upcomingEvents, true)}
          </TabsContent>

          <TabsContent value="past" className="animate-fade-in">
            {renderEvents(pastEvents, false)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
