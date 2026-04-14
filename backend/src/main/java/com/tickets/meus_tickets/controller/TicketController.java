package com.tickets.meus_tickets.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tickets.meus_tickets.config.JwtUtil;
import com.tickets.meus_tickets.service.HubSpotService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TicketController {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private HubSpotService hubSpotService;

	@GetMapping
	public ResponseEntity<?> getTickets(@RequestHeader("Authorization") String authHeader) {
		try {
			String email = SecurityContextHolder.getContext().getAuthentication().getName();

			String contactId = hubSpotService.findContactByEmail(email);

			if (contactId == null) {
				return ResponseEntity.status(404).body("Contato não encontrado: " + email);
			}

			List<Map<String, Object>> tickets = hubSpotService.getContactTickets(contactId);
			return ResponseEntity.ok(Map.of("tickets", tickets));

		} catch (Exception e) {
			return ResponseEntity.status(500).body("Erro: " + e.getMessage());
		}
	}
}