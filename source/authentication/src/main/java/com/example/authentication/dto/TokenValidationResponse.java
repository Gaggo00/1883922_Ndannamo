package com.example.authentication.dto;

public class TokenValidationResponse {
    private Boolean status;
    private String username;
    private String message;

    // Costruttore
    public TokenValidationResponse(Boolean status, String username, String message) {
        this.status = status;
        this.username = username;
        this.message = message;
    }

    // Getter e setter
    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
