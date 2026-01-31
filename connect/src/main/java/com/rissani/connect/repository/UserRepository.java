package com.rissani.connect.repository;

import com.rissani.connect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    default void createAdminIfNotExists(org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        if (findByEmail("admin@rissani.com").isEmpty()) {
            User admin = User.builder()
                    .nom("Admin")
                    .prenom("System")
                    .email("admin@rissani.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .role(User.Role.ADMIN)
                    .statut(User.Statut.EMPLOYE)
                    .sexe(User.Sexe.HOMME)
                    .build();

            save(admin);
            System.out.println("✓ Admin créé avec succès !");
            System.out.println("✓ Email: admin@rissani.com");
            System.out.println("✓ Mot de passe: Admin123!");
        } else {
            System.out.println("✓ Admin existe déjà");
        }
    }
}