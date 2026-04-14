package com.tickets.meus_tickets.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

	// ✅ Método com paginação (substitua o antigo por este)
	@GetMapping
	public ResponseEntity<?> getTickets(
			@RequestHeader("Authorization") String authHeader,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		try {
			String email = SecurityContextHolder.getContext().getAuthentication().getName();

			String contactId = hubSpotService.findContactByEmail(email);

			if (contactId == null) {
				return ResponseEntity.status(404).body("Contato não encontrado: " + email);
			}

			// Usar o método com paginação
			Map<String, Object> result = hubSpotService.getContactTicketsPaginated(contactId, page, size);
			return ResponseEntity.ok(result);

		} catch (Exception e) {
			return ResponseEntity.status(500).body("Erro: " + e.getMessage());
		}
	}
	
	@PostMapping("/seed")
	public ResponseEntity<?> seedTickets(@RequestBody Map<String, String> ticketData) {
	    try {
	        String email = SecurityContextHolder.getContext().getAuthentication().getName();
	        String contactId = hubSpotService.findContactByEmail(email);

	        if (contactId == null) {
	            return ResponseEntity.status(404).body("Contato não encontrado");
	        }

	        hubSpotService.createAndAssociateTicket(contactId, ticketData);

	        return ResponseEntity.ok(Map.of("message", "Ticket criado!", "subject", ticketData.get("subject")));

	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Erro: " + e.getMessage());
	    }
	}
}