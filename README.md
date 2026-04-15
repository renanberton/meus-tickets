# 🎫 Meus Tickets

Sistema full stack de gerenciamento de tickets com integração ao HubSpot e autenticação JWT.

---

## 📋 Sobre o Projeto

Aplicação web onde o usuário faz login e visualiza seus tickets de atendimento (dados vindos do HubSpot).

---

## 🚀 Como Executar o Projeto

Você pode rodar de duas formas:

- Docker rodando no Container (mais fácil)
- Localmente com instalação manual (explicação abaixo)

---

# 🐳 Opção 1: Docker

Clone o projeto, no terminal CMD digite:
```bash

git clone https://github.com/renanberton/meus-tickets.git
cd meus-tickets 

cp .env.example .env
```

Edite arquivo .env com as credenciais enviadas por e-mail

Execute o comando:
docker compose up -d --build

E o Docker irá executar o projeto no Container

Acesse para visualizar e usar o projeto:
- http://localhost:5173
- http://localhost:8080

---

# 💻 Opção 2: Execução Manual (passo a passo detalhado)

## 1. Instalar dependências

Você precisa ter instalado:

- Java 17
- Node.js 18+
- MySQL 8

---

## 2. Criar banco de dados

Abra seu MySQL (Workbench, terminal, etc) e execute:

```sql
CREATE DATABASE meus_tickets;
```

👉 Isso cria um banco vazio.  
👉 **Não precisa criar tabelas manualmente** — o Spring Boot faz isso automaticamente.

---

## 3. Configurar backend

Entre na pasta do Backend:

```bash
cd backend
```

Agora você precisa configurar a conexão com o banco.

Você pode fazer isso de duas formas:

### ✔️ Opção A (recomendado): variáveis de ambiente

Crie um arquivo `.env` ou configure no sistema:

```
DB_URL=jdbc:mysql://localhost:3306/meus_tickets
DB_USERNAME=root
DB_PASSWORD=sua_senha
JWT_SECRET=uma_chave_grande
HUBSPOT_TOKEN=seu_token
```

E cole as credenciais enviadas separadamente por e-mail

---

### ✔️ Opção B: application.properties

Ou edite direto o arquivo:

`backend/src/main/resources/application.properties`

Exemplo:

```
spring.datasource.url=jdbc:mysql://localhost:3306/meus_tickets
spring.datasource.username=root
spring.datasource.password=sua_senha
```

---

## 4. Rodar backend

```bash
./mvnw spring-boot:run
```

Se deu certo:
- API disponível em http://localhost:8080

---

## 5. Rodar frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse:
- http://localhost:5173

---

## ⚠️ Problemas comuns

### Erro de banco
- Verifique se o MySQL está rodando
- Confira usuário e senha
- Veja se o banco `meus_tickets` existe

### Porta ocupada
- 8080 ou 5173 já em uso → feche outros projetos

### HubSpot não funciona
- Token inválido ou não configurado

---

## 📌 Observações

- O backend cria automaticamente as tabelas
- Sem HUBSPOT_TOKEN válido, os tickets não aparecem

---

## 👨‍💻 Autor

Renan Alexandre Berton
