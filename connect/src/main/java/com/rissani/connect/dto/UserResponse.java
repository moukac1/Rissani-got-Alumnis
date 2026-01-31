package com.rissani.connect.dto;


import com.rissani.connect.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String numTelephone;
    private String role;
    private String sexe;
    private Integer anneeBac;
    private String filiereBac;
    private String statut;
    private String specialite;
    private String avatar;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .numTelephone(user.getNumTelephone())
                .role(user.getRole().name().toLowerCase())
                .sexe(user.getSexe() != null ? user.getSexe().name().toLowerCase() : null)
                .anneeBac(user.getAnneeBac())
                .filiereBac(user.getFiliereBac())
                .statut(user.getStatut() != null ? user.getStatut().name().toLowerCase() : null)
                .specialite(user.getSpecialite())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())
                .build();
    }
}