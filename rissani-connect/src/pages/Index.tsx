/**
 * Page d'accueil du site
 * Présentation de la communauté des anciens de Rissani
 */

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, Calendar, GraduationCap, ArrowRight, MapPin } from "lucide-react";


const Index = () => {
  const { isAuthenticated } = useAuth();
    
    
  
  const navigate = useNavigate();

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Users,
      title: "Connectez-vous",
      description: "Retrouvez vos anciens camarades et créez de nouvelles connexions professionnelles.",
    },
    {
      icon: Calendar,
      title: "Événements",
      description: "Participez aux forums d'orientation et rencontres organisés par la communauté.",
    },
    {
      icon: GraduationCap,
      title: "Orientation",
      description: "Guidez les jeunes de Rissani dans leur parcours scolaire et professionnel.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Rissani, Maroc</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Bienvenue dans la communauté des <span className="gradient-text">Anciens de Rissani</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez un réseau d'anciens élèves passionnés, partagez vos expériences et contribuez à l'avenir des
              jeunes de notre ville.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 btn-primary">
                  Rejoindre la communauté
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pourquoi nous rejoindre ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre plateforme facilite les connexions et les échanges entre anciens élèves
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-8 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Prêt à rejoindre l'aventure ?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Créez votre compte gratuitement et commencez à vous connecter avec la communauté des anciens de Rissani.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Créer mon compte
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© Made with ❤️ for Rissani's new generation by @Mouad_Kacimi</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;