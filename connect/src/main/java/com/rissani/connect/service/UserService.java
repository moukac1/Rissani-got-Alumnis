package com.rissani.connect.service;

import com.rissani.connect.dto.UserResponse;
import com.rissani.connect.entity.User;
import com.rissani.connect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public UserResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return UserResponse.fromEntity(user);
    }

    public UserResponse updateProfile(UserResponse updateRequest) {
        User user = getCurrentUser();

        // Mise à jour des champs
        if (updateRequest.getNom() != null) {
            user.setNom(updateRequest.getNom());
        }
        if (updateRequest.getPrenom() != null) {
            user.setPrenom(updateRequest.getPrenom());
        }
        if (updateRequest.getSexe() != null) {
            user.setSexe(User.Sexe.valueOf(updateRequest.getSexe().toUpperCase()));
        }
        if (updateRequest.getAnneeBac() != null) {
            user.setAnneeBac(updateRequest.getAnneeBac());
        }
        if (updateRequest.getFiliereBac() != null) {
            user.setFiliereBac(updateRequest.getFiliereBac());
        }
        if (updateRequest.getStatut() != null) {
            user.setStatut(User.Statut.valueOf(updateRequest.getStatut().toUpperCase()));
        }
        if (updateRequest.getSpecialite() != null) {
            user.setSpecialite(updateRequest.getSpecialite());
        }
        if (updateRequest.getNumTelephone() != null) {
            user.setSpecialite(updateRequest.getNumTelephone());
        }
        if (updateRequest.getAvatar() != null) {
            user.setAvatar(updateRequest.getAvatar());
        }

        userRepository.save(user);
        return UserResponse.fromEntity(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return UserResponse.fromEntity(user);
    }
}

