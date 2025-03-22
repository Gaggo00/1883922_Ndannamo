package com.example.chat.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {

        // Recupera l'utente che hai messo nell'interceptor
        Principal userPrincipal = (Principal) attributes.get("principal");

        System.out.println("HandshakeHandler: utente autenticato: " + (userPrincipal != null ? userPrincipal.getName() : "Nessuno!"));

        return userPrincipal; // Spring lo userà come session Principal
    }
}
