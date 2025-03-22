package com.example.chat.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.ArrayList;


@Service
public class UserPresenceService {

    // Usa un Set per tenere traccia degli utenti attivi
    private final Set<String> activeUsers = ConcurrentHashMap.newKeySet();
    private final long HEARTBEAT_TIMEOUT = 15000; // Timeout di 15 secondi
    private final Map<String, Long> lastActiveTimestamps = new ConcurrentHashMap<>();

    // Aggiunge un utente alla lista degli utenti attivi
    public void userHeartbeat(String userId) {
        activeUsers.add(userId);  // Aggiungi l'utente alla lista degli attivi
        lastActiveTimestamps.put(userId, System.currentTimeMillis());  // Aggiorna timestamp
    }

    // Rimuove gli utenti che non hanno inviato un heartbeat entro il timeout
    public List<String> removeInactiveUsers() {
        long currentTime = System.currentTimeMillis();
        List<String> removed = new ArrayList<>();  // Usa ArrayList per creare la lista
        activeUsers.forEach(userId -> {
            if (currentTime - lastActiveTimestamps.getOrDefault(userId, 0L) > HEARTBEAT_TIMEOUT) {
                removed.add(userId);  // Usa add() per aggiungere elementi alla lista
                activeUsers.remove(userId);  // Rimuovi l'utente dalla lista degli attivi
                lastActiveTimestamps.remove(userId);  // Rimuovi il timestamp
            }
        });

        return removed;
    }


    // Restituisce la lista degli utenti attivi
    public Set<String> getActiveUsers() {
        return activeUsers;
    }
}
