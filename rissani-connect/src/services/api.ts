/**
 * Service API centralisé pour la communication avec le backend
 * Utilise Axios pour les requêtes HTTP
 * Connecté au backend Spring Boot
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

// Instance Axios configurée
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // VÉRIFIER SI C'EST UNE REQUÊTE DE LOGIN
        const isLoginRequest = error.config?.url?.includes('/auth/login');
        
        // NE PAS REDIRIGER PENDANT UNE TENTATIVE DE LOGIN
        if (!isLoginRequest) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
      
      // Extraire le message d'erreur du backend
      const errorMessage =
      (data as { message?: string })?.message || error.message;
          return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return Promise.reject(new Error('Pas de réponse du serveur'));
    } else {
      // Erreur lors de la configuration de la requête
      return Promise.reject(error);
    }
  }
);

// Types
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTelephone: string;
  role: 'user' | 'admin';
  sexe?: 'homme' | 'femme';
  anneeBac?: number;
  filiereBac?: string;
  statut?: 'etudiant' | 'employe';
  specialite?: string;
  avatar?: string;
  createdAt: string;
}

export interface Event {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  type: 'forum' | 'rencontre' | 'autre';
  participants: string[];
  createdBy: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  numTelephone: string;
  password: string;
  sexe?: string;
  anneeBac?: number;
  filiereBac?: string;
  statut?: string;
  specialite?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============ AUTH API ============

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Sauvegarder le token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connexion utilisateur
 * POST /api/auth/login
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Sauvegarder le token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnexion utilisateur
 */
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
};

// ============ USER API ============

/**
 * Récupérer le profil de l'utilisateur connecté
 * GET /api/users/me
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

/**
 * Mettre à jour le profil utilisateur
 * PUT /api/users/me
 */
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

/**
 * Récupérer un utilisateur par ID
 * GET /api/users/:id
 */
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Récupérer tous les utilisateurs inscrits (public)
 * GET /api/users/all-users
 */
export const getAllUsersPublic = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/users/all-users');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

// ============ ADMIN API ============

/**
 * Récupérer la liste de tous les utilisateurs (admin)
 * GET /api/admin/users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

/**
 * Récupérer un utilisateur par ID (admin)
 * GET /api/admin/users/:id
 */
export const getAdminUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

// ============ EVENTS API ============

/**
 * Récupérer tous les événements
 * GET /api/events
 */
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    throw error;
  }
};

/**
 * Récupérer un événement par ID
 * GET /api/events/:id
 */
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    throw error;
  }
};

/**
 * Participer à un événement
 * POST /api/events/:id/participate
 */
export const participateToEvent = async (eventId: string): Promise<void> => {
  try {
    await apiClient.post(`/events/${eventId}/participate`);
  } catch (error) {
    console.error('Erreur lors de la participation à l\'événement:', error);
    throw error;
  }
};

/**
 * Annuler sa participation à un événement
 * DELETE /api/events/:id/participate
 */
export const cancelParticipation = async (eventId: string): Promise<void> => {
  try {
    await apiClient.delete(`/events/${eventId}/participate`);
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la participation:', error);
    throw error;
  }
};

/**
 * Récupérer les événements d'un utilisateur
 * GET /api/events/user/:userId
 */
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const response = await apiClient.get<Event[]>(`/events/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements de l\'utilisateur:', error);
    throw error;
  }
};

// ============ ADMIN EVENTS API ============

/**
 * Créer un événement (admin)
 * POST /api/admin/events
 */
export const createEvent = async (
  data: Omit<Event, 'id' | 'createdAt' | 'participants' | 'createdBy'>
): Promise<Event> => {
  try {
    const response = await apiClient.post<Event>('/admin/events', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    throw error;
  }
};

/**
 * Supprimer un événement (admin)
 * DELETE /api/admin/events/:id
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/events/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    throw error;
  }
};

// Export de l'instance Axios pour des cas d'usage avancés
export { apiClient };

// Export vide pour compatibilité
export {};