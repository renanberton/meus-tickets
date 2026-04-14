package com.tickets.meus_tickets.controller;

import com.tickets.meus_tickets.config.JwtUtil;
import com.tickets.meus_tickets.dto.AuthResponse;
import com.tickets.meus_tickets.dto.LoginRequest;
import com.tickets.meus_tickets.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean authenticated = authService.authenticate(request.getEmail(), request.getPassword());
        
        if (!authenticated) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
        
        String token = jwtUtil.generateToken(request.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, request.getEmail()));
    }
}