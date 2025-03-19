package com.example.chat.dto;

public class StatusNotice {
    private String userEmail;
    private boolean online;

    public StatusNotice(String userEmail, boolean status) {
        this.userEmail = userEmail;
        this.online = status;
    }

    public String getUserEmail() { return userEmail; }
    public boolean getOnline() { return online; }

    public void setUserEmail(String newEmail) { this.userEmail = newEmail; }
    public void setOnline(boolean online) { this.online = online; }

}
