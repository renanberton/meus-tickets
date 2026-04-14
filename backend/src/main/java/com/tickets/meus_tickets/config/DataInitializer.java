package com.tickets.meus_tickets.config;

import com.tickets.meus_tickets.model.User;
import com.tickets.meus_tickets.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("teste@exemplo.com")) {
            User user = new User();
            user.setEmail("teste@exemplo.com");
            user.setPassword(passwordEncoder.encode("senha123"));
            userRepository.save(user);
            System.out.println("✅ Usuário criado: teste@exemplo.com / senha123");
            System.out.println("Hash gerado: " + user.getPassword());
        }
    }
}