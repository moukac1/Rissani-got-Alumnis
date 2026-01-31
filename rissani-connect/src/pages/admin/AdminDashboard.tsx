/**
 * Tableau de bord administrateur
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, getEvents, User, Event } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, Calendar, TrendingUp, ArrowRight, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, eventsData] = await Promise.all([getAllUsers(), getEvents()]);
        setUsers(usersData);
        setEvents(eventsData);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date()).length;
  const totalParticipations = events.reduce((acc, e) => acc + e.participants.length, 0);

  const stats = [
    {
      icon: Users,
      label: 'Membres inscrits',
      value: users.length,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Calendar,
      label: 'Événements à venir',
      value: upcomingEvents,
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: TrendingUp,
      label: 'Total participations',
      value: totalParticipations,
      color: 'bg-secondary text-secondary-foreground',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Espace Administrateur</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Gérez la communauté des anciens de Rissani
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="card-elevated p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold font-display">
                    {isLoading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link to="/admin/users" className="card-elevated p-6 group hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestion des Utilisateurs</h3>
                  <p className="text-muted-foreground text-sm">Voir et gérer tous les membres</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/admin/events" className="card-elevated p-6 group hover:border-accent transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestion des Événements</h3>
                  <p className="text-muted-foreground text-sm">Créer et gérer les événements</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Derniers inscrits */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Derniers membres inscrits</h2>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-48"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {user.prenom.charAt(0)}{user.nom.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.prenom} {user.nom}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
