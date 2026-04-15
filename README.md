# 🎫 Meus Tickets

Sistema full stack de gerenciamento de tickets com integração ao HubSpot e autenticação JWT.

---

## 📋 Sobre o Projeto

Aplicação web onde o usuário faz login e visualiza seus tickets de atendimento (dados vindos do HubSpot).

---

## 🧰 Tecnologias Utilizadas

### 🔧 Backend
- Java 17
- Spring Boot 3
- Spring Security
- JWT (autenticação)
- JPA / Hibernate
- MySQL

### 🎨 Frontend
- React 18
- TypeScript
- TailwindCSS
- Vite

### 🐳 Infraestrutura
- Docker
- Docker Compose

### 🔗 Integrações
- HubSpot CRM API

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com e-mail e senha
- Geração de token JWT
- Proteção de rotas no backend

### 🎫 Gestão de Tickets
- Listagem de tickets do usuário logado (via HubSpot)
- Integração com contato baseado no e-mail
- Exibição em formato de cards

### 🔎 Filtros e Busca
- Filtro por prioridade (Alta / Média / Baixa)
- Filtro por status (Aberto / Resolvido)
- Busca por título e descrição

### 📄 Paginação
- Paginação no backend e frontend
- Melhor performance na listagem

### 🎨 Interface
- Layout responsivo (desktop/mobile)
- Feedback de loading e erro
- Dashboard com métricas básicas

---

## 🚀 Como Executar o Projeto

Você pode rodar de duas formas:

- Docker rodando no Container (mais fácil)
- Localmente com instalação manual (explicação abaixo)

---

# 🐳 Opção 1: Docker

## Instalar dependências
- Docker

Com o Docker instalado, clone o projeto:

```bash
git clone https://github.com/renanberton/meus-tickets.git
cd meus-tickets

cp .env.example .env
```

Preencha o arquivo `.env` com as credenciais enviadas.

Execute:

```bash
docker compose up -d --build
```

Acesse:
Front-End:
- http://localhost:5173
Back-End:
- http://localhost:8080

---

# 💻 Opção 2: Execução Manual

## Pré-requisitos
- Java 17
- Node.js 18+
- MySQL 8

---

## Instanciando o Banco de Dados

Após instalar tudo:
Acesse seu MySql, faça login com usuário e senha descritos no .env e crie o banco com o comando:

```sql
CREATE DATABASE meus_tickets;
```

O Spring Boot criará as tabelas automaticamente.

---

## Executando o Backend

Entre na pasta do projeto e execute os comandos: 

```bash
cd backend
./mvnw spring-boot:run
```

API estará disponível em:
http://localhost:8080

---

## Executando o Frontend
Entre na pasta do projeto e execute os comandos:

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em:
http://localhost:5173

---


## 🔑 Credenciais de Login no App
* Email	teste@exemplo.com
* Senha	senha123

O usuário é criado automaticamente na primeira execução.

## ⚠️ Problemas comuns

- Banco não conecta → verificar usuário/senha
- Porta ocupada → verificar 8080 / 5173
- HubSpot não retorna dados → conferir token

---

## 📌 Observações

- Necessário token válido do HubSpot
- Tabelas são criadas automaticamente

---

## 👨‍💻 Autor

Renan Alexandre Berton
