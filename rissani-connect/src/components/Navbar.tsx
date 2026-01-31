/**
 * Barre de navigation principale
 * Affiche les liens selon le statut de connexion
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Calendar, Users, Home, Shield } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `nav-link flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isActive(path) ? 'active bg-secondary' : 'hover:bg-secondary/50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">R</span>
            </div>
            <span className="font-display font-semibold text-xl hidden sm:block">
              Anciens de Rissani
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  // Admin Navigation
                  <>
                    <Link to="/admin" className={navLinkClass('/admin')}>
                      <Shield className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                      <Users className="w-4 h-4" />
                      Utilisateurs
                    </Link>
                    <Link to="/admin/events" className={navLinkClass('/admin/events')}>
                      <Calendar className="w-4 h-4" />
                      Événements
                    </Link>
                  </>
                ) : (
                  // User Navigation
                  <>
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                      <Home className="w-4 h-4" />
                      Accueil
                    </Link>
                    <Link to="/events" className={navLinkClass('/events')}>
                      <Calendar className="w-4 h-4" />
                      Événements
                    </Link>
                    <Link to="/alumni" className={navLinkClass('/alumni')}>
                      <Users className="w-4 h-4" />
                      Annuaire
                    </Link>
                    <Link to="/profile" className={navLinkClass('/profile')}>
                      <User className="w-4 h-4" />
                      Profil
                    </Link>
                  </>
                )}
                <div className="ml-4 pl-4 border-l border-border flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {user?.prenom} {user?.nom}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin"
                        className={navLinkClass('/admin')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Dashboard Admin
                      </Link>
                      <Link
                        to="/admin/users"
                        className={navLinkClass('/admin/users')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="w-4 h-4" />
                        Utilisateurs
                      </Link>
                      <Link
                        to="/admin/events"
                        className={navLinkClass('/admin/events')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        Événements
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/dashboard"
                        className={navLinkClass('/dashboard')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Home className="w-4 h-4" />
                        Accueil
                      </Link>
                      <Link
                        to="/events"
                        className={navLinkClass('/events')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Calendar className="w-4 h-4" />
                        Événements
                      </Link>
                      <Link
                        to="/alumni"
                        className={navLinkClass('/alumni')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="w-4 h-4" />
                        Annuaire
                      </Link>
                      <Link
                        to="/profile"
                        className={navLinkClass('/profile')}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profil
                      </Link>
                    </>
                  )}
                  <div className="pt-4 mt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2 px-3">
                      Connecté en tant que {user?.prenom} {user?.nom}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 w-full text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
