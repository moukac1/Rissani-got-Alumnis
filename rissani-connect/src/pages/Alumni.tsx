/**
 * Annuaire des anciens élèves
 */

import { useState, useEffect } from 'react';
import { getAllUsersPublic, User } from '@/services/api';
import UserCard from '@/components/UserCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, Filter } from 'lucide-react';

const Alumni = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsersPublic();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'annuaire',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    let result = users;

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.nom.toLowerCase().includes(term) ||
          user.prenom.toLowerCase().includes(term) ||
          user.specialite?.toLowerCase().includes(term) ||
          user.numTelephone?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatut !== 'all') {
      result = result.filter((user) => user.statut === filterStatut);
    }

    // Filtre par filière
    if (filterFiliere !== 'all') {
      result = result.filter((user) => user.filiereBac === filterFiliere);
    }

    setFilteredUsers(result);
  }, [searchTerm, filterStatut, filterFiliere, users]);

  // Extraire les filières uniques
  const filieres = [...new Set(users.map((u) => u.filiereBac).filter(Boolean))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Annuaire des Anciens</h1>
          <p className="text-muted-foreground">
            Retrouvez et connectez-vous avec les anciens élèves de Rissani
          </p>
        </div>

        {/* Filtres */}
        <div className="card-elevated p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-styled"
              />
            </div>

            <div className="flex gap-4">
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-40 input-styled">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="etudiant">Étudiants</SelectItem>
                  <SelectItem value="employe">Employés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterFiliere} onValueChange={setFilterFiliere}>
                <SelectTrigger className="w-48 input-styled">
                  <SelectValue placeholder="Filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les filières</SelectItem>
                  {filieres.map((filiere) => (
                    <SelectItem key={filiere} value={filiere!}>
                      {filiere}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4 text-muted-foreground">
          {filteredUsers.length} membre{filteredUsers.length > 1 ? 's' : ''} trouvé
          {filteredUsers.length > 1 ? 's' : ''}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun membre ne correspond à vos critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;