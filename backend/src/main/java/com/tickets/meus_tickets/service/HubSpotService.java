package com.tickets.meus_tickets.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HubSpotService {
    
    @Value("${hubspot.token}")
    private String hubspotToken;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // 1. Buscar contato pelo email
    public String findContactByEmail(String email) throws Exception {
        String url = "https://api.hubapi.com/crm/v3/objects/contacts/search";
        
        String body = String.format(
            "{\"filterGroups\":[{\"filters\":[{\"propertyName\":\"email\",\"operator\":\"EQ\",\"value\":\"%s\"}]}]}",
            email
        );
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + hubspotToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode results = root.get("results");
        
        if (results != null && results.size() > 0) {
            return results.get(0).get("id").asText();
        }
        return null;
    }
    
    // 2. Buscar tickets associados a um contato
    public List<Map<String, Object>> getContactTickets(String contactId) throws Exception {
        String url = "https://api.hubapi.com/crm/v4/objects/contacts/" + contactId + "/associations/tickets";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + hubspotToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        List<Map<String, Object>> tickets = new ArrayList<>();
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode results = root.get("results");
        
        if (results != null) {
            for (JsonNode assoc : results) {
                // Pega o ID do ticket
                String ticketId = assoc.get("toObjectId").asText();
                
                // Busca detalhes do ticket
                Map<String, Object> ticket = getTicketDetails(ticketId);
                if (ticket != null) {
                    tickets.add(ticket);
                }
            }
        }
        return tickets;
    }
    
    // 3. Buscar detalhes de um ticket específico
    private Map<String, Object> getTicketDetails(String ticketId) throws Exception {
        String url = "https://api.hubapi.com/crm/v3/objects/tickets/" + ticketId;
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + hubspotToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode properties = root.get("properties");
        
        if (properties != null) {
            Map<String, Object> ticket = new HashMap<>();
            ticket.put("id", root.get("id").asText());
            ticket.put("subject", properties.has("subject") ? properties.get("subject").asText() : "Sem título");
            ticket.put("content", properties.has("content") ? properties.get("content").asText() : "");
            ticket.put("status", properties.has("hs_pipeline_stage") ? properties.get("hs_pipeline_stage").asText() : "");
            ticket.put("priority", properties.has("hs_ticket_priority") ? properties.get("hs_ticket_priority").asText() : "");
            ticket.put("createdDate", properties.has("createdate") ? properties.get("createdate").asText() : "");
            ticket.put("lastModified", properties.has("hs_lastmodifieddate") ? properties.get("hs_lastmodifieddate").asText() : "");
            return ticket;
        }
        return null;
    }
    
    // 4. Método auxiliar para buscar todos os tickets (caso necessário)
    public List<Map<String, Object>> getAllTickets() throws Exception {
        String url = "https://api.hubapi.com/crm/v3/objects/tickets?properties=subject,content,hs_pipeline_stage,hs_ticket_priority,createdate,hs_lastmodifieddate";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + hubspotToken);
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        List<Map<String, Object>> tickets = new ArrayList<>();
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode results = root.get("results");
        
        if (results != null) {
            for (JsonNode ticket : results) {
                JsonNode props = ticket.get("properties");
                Map<String, Object> t = new HashMap<>();
                t.put("id", ticket.get("id").asText());
                t.put("subject", props.has("subject") ? props.get("subject").asText() : "Sem título");
                t.put("content", props.has("content") ? props.get("content").asText() : "");
                t.put("status", props.has("hs_pipeline_stage") ? props.get("hs_pipeline_stage").asText() : "");
                t.put("priority", props.has("hs_ticket_priority") ? props.get("hs_ticket_priority").asText() : "");
                t.put("createdDate", props.has("createdate") ? props.get("createdate").asText() : "");
                t.put("lastModified", props.has("hs_lastmodifieddate") ? props.get("hs_lastmodifieddate").asText() : "");
                tickets.add(t);
            }
        }
        return tickets;
    }
}