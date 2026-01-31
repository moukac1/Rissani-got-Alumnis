package com.rissani.connect.service;

import com.rissani.connect.dto.AuthResponse;
import com.rissani.connect.dto.LoginRequest;
import com.rissani.connect.dto.RegisterRequest;
import com.rissani.connect.dto.UserResponse;
import com.rissani.connect.entity.User;
import com.rissani.connect.repository.UserRepository;
import com.rissani.connect.security.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Créer le nouvel utilisateur
        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .numTelephone(request.getNumTelephone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .sexe(request.getSexe() != null ? User.Sexe.valueOf(request.getSexe().toUpperCase()) : null)
                .anneeBac(request.getAnneeBac())
                .filiereBac(request.getFiliereBac())
                .statut(request.getStatut() != null ? User.Statut.valueOf(request.getStatut().toUpperCase()) : null)
                .specialite(request.getSpecialite())
                .build();

        userRepository.save(user);

        // Générer le token JWT
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .user(UserResponse.fromEntity(user))
                .token(jwtToken)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Authentifier l'utilisateur
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Récupérer l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Générer le token JWT
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .user(UserResponse.fromEntity(user))
                .token(jwtToken)
                .build();
    }
}