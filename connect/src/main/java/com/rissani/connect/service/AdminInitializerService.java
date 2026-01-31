
package com.rissani.connect.service;

import com.rissani.connect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminInitializerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void initAdmin() {
        System.out.println("⏳ Vérification de l'administrateur...");

        if (userRepository.findByEmail("mouad.admin@rissani.com").isEmpty()) {
            com.rissani.connect.entity.User admin = com.rissani.connect.entity.User.builder()
                    .nom("Rissani")
                    .prenom("Admin")
                    .email("mouad.admin@rissani.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(com.rissani.connect.entity.User.Role.ADMIN)
                    .statut(com.rissani.connect.entity.User.Statut.EMPLOYE)
                    .sexe(com.rissani.connect.entity.User.Sexe.HOMME)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ ADMIN CRÉÉ AVEC SUCCÈS !");
            System.out.println("📧 Email: mouad.admin@rissani.com");
            System.out.println("🔑 Mot de passe: Admin123!");
            System.out.println("⚠️ CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT !");
        } else {
            System.out.println("✅ Admin existe déjà");
        }
    }
}
