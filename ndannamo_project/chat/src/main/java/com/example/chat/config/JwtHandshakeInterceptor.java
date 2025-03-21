package com.example.chat.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.Map;


public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final String secret;

    public JwtHandshakeInterceptor(String secret) {
        this.secret = secret;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {
    
        String query = request.getURI().getQuery();
        String token = null;
    
        System.out.println(secret);
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length == 2 && pair[0].equals("token")) {
                    token = pair[1];
                    break;
                }
            }
        }

        System.out.println(token);
    
        if (token == null) {
            System.out.println("Token mancante nella query string");
            return false;
        }
    
        try {
            //Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    
            String username = claims.getSubject();
            System.out.println("Utente autenticato: " + username);

            // Creo un Principal con il nome dell'utente
            Principal userPrincipal = new StompPrincipal(username);
            
            // Lo metto negli attributi della sessione WebSocket
            attributes.put("principal", userPrincipal);
    
            return true;
        } catch (Exception e) {
            System.out.println("Token JWT non valido: " + e.getMessage());
            return false;
        }
    }
    

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // Non ti serve nulla qui di solito
    }
}

