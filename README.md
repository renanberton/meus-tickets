# 🎫 Meus Tickets

Sistema completo de gerenciamento de tickets com integração HubSpot, autenticação JWT e 2FA.

![TypeScript](https://img.shields.io/badge/TypeScript-54.1%25-3178C6?logo=typescript)
![Java](https://img.shields.io/badge/Java-38.2%25-007396?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker)

---

## 📋 Sobre o Projeto

**Meus Tickets** é uma aplicação full stack desenvolvida para um teste técnico que simula um sistema de suporte. O usuário faz login e visualiza todos os tickets associados ao seu contato na HubSpot.

### 🎯 Objetivo do Teste

- Autenticação com e-mail e senha (persistência em SQL)
- Busca de contato na HubSpot pelo e-mail do usuário logado
- Exibição dos tickets associados a esse contato
- **Bônus:** Autenticação de dois fatores (2FA) com Google Authenticator

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação
- Login com e-mail e senha (JWT)
- Senhas criptografadas com BCrypt
- Proteção de rotas com Spring Security
- **2FA (Bônus):** Autenticação de dois fatores com TOTP e Google Authenticator

### 🎫 Tickets
- Listagem de tickets associados ao contato logado (integração HubSpot)
- Filtros por prioridade: Alta / Média / Baixa
- Filtros por status: Em aberto / Resolvidos
- Busca textual por título ou descrição
- Paginação (frontend e backend)
- Cards estilo Trello com informações completas

### 🐳 Infraestrutura
- Containerização completa com Docker
- Docker Compose para orquestração
- Variáveis de ambiente para configuração segura

### 🎨 Frontend
- Interface moderna com TailwindCSS
- Design responsivo (mobile/desktop)
- Feedback visual de loading e erros
- Stats cards com métricas

### 🔧 Backend
- API RESTful com Spring Boot 3.x
- JPA/Hibernate para persistência
- Integração com HubSpot CRM API
- Tratamento de exceções e logs estruturados

---

## 🚀 Como Executar

### Opção 1: Docker (recomendado)

```bash
# Clone o repositório
git clone https://github.com/renanberton/meus-tickets.git
cd meus-tickets

# Copie e configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seu token da HubSpot

# Execute a aplicação
docker compose up -d --build

# Acesse no navegador
# Frontend: http://localhost:5173
# Backend: http://localhost:8080