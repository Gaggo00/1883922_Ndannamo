package com.example.backend.mainDb.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private String currentPassword;
    private String newPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }
}
