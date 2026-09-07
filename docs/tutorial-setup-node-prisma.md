![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![dotenv](https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-338833?style=for-the-badge&logo=letsencrypt&logoColor=white)

# 🚀 Tutorial — Setup de uma API em Node.js

---
## Unidade Curricular: Programação Web  
Curso: Tecnologias e Programação de Sistemas de Informação  
Ano Letivo: 2025-2026  

---

# � Índice

1. [Objetivo](#-objetivo)
2. [Setup Inicial](#️-setup-inicial)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [node_modules](#-node_modules)
5. [.gitignore](#-gitignore-completo)
6. [package.json — Scripts](#-packagejson--scripts)
7. [.env](#-env)
8. [server.js Base](#-serverjs-base)
9. [Exemplo 1 — Apenas OK](#-exemplo-1--apenas-ok)
10. [req e res](#-req)
11. [HTTP Status Codes](#-http-status-codes)
12. [Exemplo 2 — CRUD com Mock](#️-exemplo-2--crud-com-mock)
13. [Middleware de Erros](#-middleware-de-erros)
14. [Testar com Postman](#-testar-com-postman)
15. [Deploy no Vercel](#️-deploy-no-vercel)
16. [LAB-1 — API Gestão de Filmes](#-lab-1--api-gestão-de-filmes-)
17. [LAB-2 — API Gestão de Tarefas](#-lab-2--api-gestão-de-tarefas-)
18. [Explicação Detalhada da Configuração](#-explicação-detalhada-da-configuração)
19. [Glossário](#-glossário)
20. [Recursos Úteis](#-recursos-úteis)
21. [Prisma ORM — Base de Dados com PostgreSQL](#️-prisma-orm--base-de-dados-com-postgresql)
22. [LAB-3 — API Gestão de Tarefas com Prisma](#-lab-3--api-gestão-de-tarefas-com-prisma-️)
23. [Autenticação com JWT e bcrypt](#-autenticação-com-jwt-e-bcrypt)
24. [LAB-4 — Autenticação e Rotas Protegidas](#-lab-4--autenticação-e-rotas-protegidas-)

---

# �📌 Objetivo

Criar uma API simples em Node.js com Express com:

- GET
- POST
- PUT
- DELETE
- Dados mock (em memória)
- Tudo no server.js

Compreender:
- node_modules
- endpoint
- req e res
- deploy

---

# 🛠️ Setup Inicial

Criar repositório:
PW-P-LAB-{{numero-de-aluno}}

Instalar Node:
https://nodejs.org/en

Confirmar:
node -v
npm -v

Inicializar:
npm init

Instalar dependências:
npm install express nodemon cors dotenv morgan --save

---

# � Estrutura do Projeto

Após o setup, o projeto deverá ter a seguinte estrutura:

```
PW-P-LAB-{{numero-de-aluno}}/
├── node_modules/         # Dependências (NÃO enviar para GitHub)
├── .env                  # Variáveis de ambiente
├── .gitignore            # Ficheiros a ignorar pelo Git
├── package.json          # Configurações e dependências do projeto
├── package-lock.json     # Versões exatas das dependências
├── server.js             # Ficheiro principal da API
├── vercel.json           # Configuração do deploy na Vercel
└── README.md             # Documentação do projeto
```

> 💡 **Dica:** Manter uma boa estrutura de projeto desde o início facilita a manutenção e colaboração.

---

# �📦 node_modules

Criada automaticamente com:
npm install

Contém todas as bibliotecas.

Não enviar para GitHub.
Adicionar ao .gitignore:
node_modules

---

# 🚫 .gitignore Completo

Criar um ficheiro `.gitignore` na raiz do projeto com o seguinte conteúdo:

```
# Dependências
node_modules/

# Variáveis de ambiente
.env

# Logs
logs/
*.log
npm-debug.log*

# Sistema operativo
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Vercel
.vercel/
```

> ⚠️ **Importante:** O ficheiro `.env` contém informações sensíveis (passwords, tokens, etc.) e **nunca** deve ser enviado para o GitHub.

---

# 📋 package.json — Scripts

Após o `npm init`, o `package.json` é criado. Adicionar os seguintes **scripts**:

```json
{
  "name": "pw-p-lab",
  "version": "1.0.0",
  "description": "API REST - Programação Web",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["api", "express", "node"],
  "author": "O teu nome",
  "license": "ISC"
}
```

| Script | Comando | Descrição |
|--------|---------|---------- |
| `start` | `npm start` | Inicia o servidor com Node (produção) |
| `dev` | `npm run dev` | Inicia com Nodemon — reinicia automaticamente ao guardar ficheiros |

> 💡 **Nodemon** vigia os ficheiros e reinicia o servidor automaticamente sempre que detetar alterações. Ideal para desenvolvimento.

Para correr em modo de desenvolvimento:
```bash
npm run dev
```

---

# 🌱 .env

SERVER_PORT=4242

---

# 📄 server.js Base

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.SERVER_PORT || 3000;

---

# 🧪 EXEMPLO 1 — Apenas OK

app.get("/users", (req, res) => {
  res.status(200).json({ message: "OK - GET users" });
});

app.post("/users", (req, res) => {
  res.status(200).json({ message: "OK - POST users" });
});

app.put("/users/:id", (req, res) => {
  res.status(200).json({ message: "OK - PUT users" });
});

app.delete("/users/:id", (req, res) => {
  res.status(200).json({ message: "OK - DELETE users" });
});

---

# 🧠 req

Request.
Contém:
req.params
req.body
req.query

---

# 📤 res

Response.
Envia dados ao cliente:

res.status(200).json({ message: "OK" });

### Métodos mais usados de `res`:

| Método | Descrição | Exemplo |
|--------|-----------|---------- |
| `res.json()` | Envia resposta JSON | `res.json({ name: "Ana" })` |
| `res.status()` | Define o status code | `res.status(201)` |
| `res.send()` | Envia texto simples | `res.send("Hello")` |
| `res.redirect()` | Redireciona | `res.redirect("/home")` |

---

# 📊 HTTP Status Codes

Tabela de referência dos códigos HTTP mais comuns:

| Código | Nome | Descrição | Quando usar |
|--------|------|-----------|------------|
| **200** | OK | Sucesso | GET, PUT com sucesso |
| **201** | Created | Recurso criado | POST com sucesso |
| **204** | No Content | Sem conteúdo | DELETE com sucesso |
| **400** | Bad Request | Pedido inválido | Dados em falta ou inválidos |
| **404** | Not Found | Não encontrado | Recurso não existe |
| **409** | Conflict | Conflito | Recurso duplicado |
| **500** | Internal Server Error | Erro interno | Erro inesperado no servidor |

### Categorias:

| Gama | Significado |
|------|------------|
| `1xx` | Informacional |
| `2xx` | ✅ Sucesso |
| `3xx` | Redirecionamento |
| `4xx` | ❌ Erro do Cliente |
| `5xx` | 💥 Erro do Servidor |

---

# 🗂️ EXEMPLO 2 — CRUD com Mock

```js
let users = [
  { id: 1, name: "Ana", email: "ana@email.com" },
  { id: 2, name: "João", email: "joao@email.com" }
];
```

### GET /users — Listar todos

```js
app.get("/users", (req, res) => {
  res.status(200).json({ data: users });
});
```

### GET /users/:id — Obter um

```js
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Utilizador não encontrado" });
  }

  res.status(200).json({ data: user });
});
```

### POST /users — Criar

```js
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validação
  if (!name || !email) {
    return res.status(400).json({ message: "Campos 'name' e 'email' são obrigatórios" });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json({ data: newUser });
});
```

### PUT /users/:id — Atualizar

```js
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Utilizador não encontrado" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Campos 'name' e 'email' são obrigatórios" });
  }

  users[index] = { id, name, email };
  res.status(200).json({ data: users[index] });
});
```

### DELETE /users/:id — Apagar

```js
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Utilizador não encontrado" });
  }

  users.splice(index, 1);
  res.status(200).json({ message: "Utilizador eliminado com sucesso" });
});
```

### Iniciar o servidor

```js
app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});
```

> 💡 Este bloco `app.listen()` deve estar **sempre no final** do ficheiro `server.js`.

---

# 🛡️ Middleware de Erros

Adicionar no final do `server.js` (antes do `app.listen`):

```js
// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
});
```

Ordem recomendada no `server.js`:
1. Imports e configuração
2. Middlewares (`cors`, `json`, `morgan`)
3. Rotas (GET, POST, PUT, DELETE)
4. Middleware de erros (404 e 500)
5. `app.listen()`

---

# 🧪 Testar com Postman

O **Postman** é uma ferramenta para testar APIs sem precisar de frontend.

### Instalação
Descarregar em: https://www.postman.com/downloads/

### Como testar cada endpoint:

#### 1. GET — Listar todos os utilizadores
| Campo | Valor |
|-------|-------|
| Método | `GET` |
| URL | `http://localhost:4242/users` |
| Body | Nenhum |

#### 2. GET — Obter um utilizador
| Campo | Valor |
|-------|-------|
| Método | `GET` |
| URL | `http://localhost:4242/users/1` |
| Body | Nenhum |

#### 3. POST — Criar utilizador
| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:4242/users` |
| Body → raw → JSON | Ver abaixo |

```json
{
  "name": "Maria",
  "email": "maria@email.com"
}
```

#### 4. PUT — Atualizar utilizador
| Campo | Valor |
|-------|-------|
| Método | `PUT` |
| URL | `http://localhost:4242/users/1` |
| Body → raw → JSON | Ver abaixo |

```json
{
  "name": "Ana Silva",
  "email": "ana.silva@email.com"
}
```

#### 5. DELETE — Apagar utilizador
| Campo | Valor |
|-------|-------|
| Método | `DELETE` |
| URL | `http://localhost:4242/users/2` |
| Body | Nenhum |

> 💡 **Dica:** Criar uma **Collection** no Postman para organizar todos os pedidos do projeto.

---

# ☁️ Deploy no Vercel

Criar conta em:
https://vercel.com

Instalar CLI:
npm install -g vercel

Login:
vercel login

Deploy:
vercel

### Ficheiro `vercel.json`

Criar o ficheiro `vercel.json` na raiz do projeto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Exportar o `app` para a Vercel

No final do `server.js`, alterar o `app.listen()` para:

```js
// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
  });
}

// Para a Vercel
module.exports = app;
```

> ⚠️ **Nota:** A Vercel precisa que o `app` seja exportado com `module.exports`. O `app.listen()` só deve correr localmente.

---

# 🧪 LAB-1 — API Gestão de Filmes 🎬

Criar array:

let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Interstellar", year: 2014 }
];

Implementar:
GET /movies
GET /movies/:id
POST /movies
PUT /movies/:id
DELETE /movies/:id

Requisitos:
- Dados mock
- Validar ID
- Status codes corretos
- Testar no Postman

---

---

# 🧪 LAB-2 — API Gestão de Tarefas ✅

Criar array:

```js
let tasks = [
  { id: 1, title: "Estudar Node.js", completed: false, priority: "high" },
  { id: 2, title: "Fazer LAB-1", completed: true, priority: "medium" }
];
```

Implementar:
- `GET /tasks` — Listar todas as tarefas
- `GET /tasks/:id` — Obter uma tarefa
- `GET /tasks?completed=true` — Filtrar por estado (usar `req.query`)
- `POST /tasks` — Criar tarefa
- `PUT /tasks/:id` — Atualizar tarefa
- `PATCH /tasks/:id/toggle` — Alternar estado `completed`
- `DELETE /tasks/:id` — Apagar tarefa

Requisitos:
- Dados mock
- Validar campos obrigatórios (`title`, `priority`)
- Validar que `priority` seja `"low"`, `"medium"` ou `"high"`
- Status codes corretos (200, 201, 400, 404)
- Testar todos os endpoints no Postman
- Fazer deploy na Vercel

> 💡 **Desafio extra:** Implementar `GET /tasks/stats` que retorna o número total de tarefas, quantas estão completas e quantas estão pendentes.

---

# 🎯 Fim


---

# 📘 Explicação Detalhada da Configuração

## 🌱 O que é o ficheiro `.env`?

```
SERVER_PORT=4242
```

O ficheiro `.env` (environment file) serve para guardar **variáveis de ambiente**.

Estas variáveis:

- Guardam configurações do projeto
- Não ficam escritas diretamente no código
- Permitem alterar valores sem modificar o programa
- São muito usadas para portas, passwords, tokens e configurações de base de dados

No nosso caso:

`SERVER_PORT=4242`  
Define a porta onde o servidor vai arrancar.

---

## 📄 Explicação do `server.js` Base

```js
require("dotenv").config();
```

Carrega o ficheiro `.env` e disponibiliza as variáveis através de:

```js
process.env.NOME_DA_VARIAVEL
```

---

```js
const express = require("express");
```

Importa o **Express**, que é o framework que usamos para criar a API.

---

```js
const cors = require("cors");
```

Importa o **CORS**.

CORS significa *Cross-Origin Resource Sharing*.

Permite que a nossa API possa ser chamada por aplicações externas (por exemplo, um frontend em React).

---

```js
const morgan = require("morgan");
```

Importa o **Morgan**, que serve para mostrar no terminal:

- Tipo de pedido (GET, POST, etc.)
- URL chamada
- Tempo de resposta
- Status code

Ajuda muito no debugging.

---

```js
const app = express();
```

Cria a aplicação Express.

É aqui que vamos definir os endpoints.

---

```js
app.use(cors());
```

Ativa o CORS para todas as rotas.

---

```js
app.use(express.json());
```

Permite que a API receba dados em formato JSON no body dos pedidos (POST e PUT).

Sem esta linha, `req.body` não funcionaria.

---

```js
app.use(morgan("dev"));
```

Ativa o Morgan no modo "dev".

Mostra logs simples e organizados no terminal.

---

```js
const PORT = process.env.SERVER_PORT || 3000;
```

Define a porta do servidor.

- Primeiro tenta ler do `.env`
- Se não existir, usa 3000 como valor por defeito

Isto permite flexibilidade entre desenvolvimento e produção.

---

# 📖 Glossário

| Termo | Definição |
|-------|----------|
| **API** | Application Programming Interface — conjunto de endpoints que permitem comunicação entre sistemas |
| **REST** | Representational State Transfer — arquitetura para APIs baseada em recursos e métodos HTTP |
| **Endpoint** | URL específica que responde a pedidos HTTP (ex: `/users`) |
| **Middleware** | Função que interceta o pedido antes de chegar à rota final |
| **CRUD** | Create, Read, Update, Delete — as 4 operações básicas |
| **Mock** | Dados simulados em memória para testes |
| **Rota** | Combinação de método HTTP + URL (ex: `GET /users`) |
| **Body** | Corpo do pedido HTTP, usado em POST e PUT para enviar dados |
| **Params** | Parâmetros na URL (ex: `/users/:id` → `req.params.id`) |
| **Query** | Parâmetros de consulta na URL (ex: `/users?name=Ana` → `req.query.name`) |
| **Status Code** | Código numérico que indica o resultado do pedido (200, 404, 500...) |
| **JSON** | JavaScript Object Notation — formato de dados usado nas APIs |
| **Deploy** | Publicar a aplicação num servidor acessível pela internet |
| **Nodemon** | Ferramenta que reinicia automaticamente o servidor ao detetar alterações nos ficheiros |
| **CORS** | Cross-Origin Resource Sharing — permite pedidos de origens diferentes |
| **dotenv** | Biblioteca para carregar variáveis de ambiente a partir do ficheiro `.env` |
| **Prisma** | ORM (Object-Relational Mapping) moderno para Node.js que facilita a comunicação com bases de dados |
| **PostgreSQL** | Sistema de gestão de bases de dados relacional open-source |
| **ORM** | Object-Relational Mapping — camada de abstração entre o código e a base de dados |
| **JWT** | JSON Web Token — standard para criar tokens de autenticação seguros |
| **bcrypt** | Biblioteca para hashing seguro de passwords |
| **Hash** | Transformação irreversível de uma string (ex: password) numa string encriptada |
| **Token** | String gerada pelo servidor que prova que o utilizador está autenticado |
| **Bearer Token** | Formato de envio do token no header: `Authorization: Bearer <token>` |
| **Middleware** | Função que interceta o pedido antes de chegar à rota final |

---

# 🔗 Recursos Úteis

| Recurso | Link |
|---------|------|
| Documentação Node.js | https://nodejs.org/docs/latest/api/ |
| Documentação Express | https://expressjs.com/ |
| Postman Learning | https://learning.postman.com/ |
| Vercel Docs | https://vercel.com/docs |
| HTTP Status Codes | https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status |
| REST API Tutorial | https://restfulapi.net/ |
| Nodemon | https://nodemon.io/ |
| Shields.io (badges) | https://shields.io/ |
| GitHub Student Pack | https://education.github.com/pack |
| MDN Web Docs | https://developer.mozilla.org/pt-BR/ |
| Prisma Docs | https://www.prisma.io/docs |
| PostgreSQL Docs | https://www.postgresql.org/docs/ |
| JWT.io | https://jwt.io/ |
| bcrypt npm | https://www.npmjs.com/package/bcrypt |
| jsonwebtoken npm | https://www.npmjs.com/package/jsonwebtoken |

---

# 🗄️ Prisma ORM — Base de Dados com PostgreSQL

O **Prisma** é um ORM (Object-Relational Mapping) moderno para Node.js que facilita a comunicação com bases de dados.

Em vez de escrever queries SQL manualmente, usamos métodos como `prisma.task.findMany()` para interagir com a base de dados.

### 🔄 Fluxo de um pedido HTTP com Prisma

```
Cliente (Postman/Browser)
        │
        ▼
   Pedido HTTP
   (GET /tasks)
        │
        ▼
┌───────────────────┐
│    Express.js     │
│   (server.js)     │
│                   │
│  app.get("/tasks")│
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│   Prisma Client   │
│                   │
│ prisma.task       │
│   .findMany()     │
└───────┬───────────┘
        │  Query SQL gerada
        ▼  automaticamente
┌───────────────────┐
│   PostgreSQL      │
│   (Base de Dados) │
│                   │
│  SELECT * FROM    │
│  "Task"           │
└───────┬───────────┘
        │  Dados
        ▼
┌───────────────────┐
│   Prisma Client   │
│                   │
│  Converte para    │
│  objetos JS       │
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│    Express.js     │
│                   │
│  res.json(tasks)  │
└───────┬───────────┘
        │
        ▼
   Resposta HTTP
   (JSON com dados)
        │
        ▼
Cliente (Postman/Browser)
```

---

## 📦 Instalação

### 0 — Instalar extensão Prisma no VS Code

Procurar por **Prisma** no marketplace de extensões.

### 1 — Instalar dependências de desenvolvimento

```bash
npm install prisma @types/pg --save-dev
```

### 2 — Instalar dependências de produção

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

### 3 — Ver comandos disponíveis

```bash
npx prisma
```

### 4 — Inicializar o Prisma

```bash
npx prisma init
```

Isto cria:
- Pasta `prisma/` com o ficheiro `schema.prisma`
- Ficheiro `.env` (se não existir)

---

## ⚙️ Configuração

### 5 — Configurar a connection string no `.env`

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tasks_db?schema=public"
```

| Parte | Significado |
|-------|------------|
| `postgresql` | Tipo de base de dados |
| `postgres:postgres` | Utilizador e password |
| `localhost:5432` | Host e porta do PostgreSQL |
| `tasks_db` | Nome da base de dados |
| `schema=public` | Schema a utilizar |

### 6 — Configurar o `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js" // para o prisma v7 sem ESM
}

datasource db {
  provider = "postgresql"
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `String` | Identificador único (UUID gerado automaticamente) |
| `title` | `String` | Título da tarefa (obrigatório) |
| `description` | `String?` | Descrição (opcional — o `?` indica que pode ser `null`) |
| `completed` | `Boolean` | Estado da tarefa (default: `false`) |
| `createdAt` | `DateTime` | Data de criação (gerada automaticamente) |
| `updatedAt` | `DateTime` | Data de última atualização (atualizada automaticamente) |

---

## 🚀 Sincronizar com a Base de Dados

### 7 — Enviar o schema para a base de dados

```bash
npx prisma db push
```

> Cria as tabelas na base de dados com base no `schema.prisma`.

### 8 — Gerar o Prisma Client

```bash
npx prisma generate
```

> Gera o código do client que vamos usar no `server.js`.

---

## 🔌 Configurar o Prisma no `server.js`

### Imports

```js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require("@prisma/adapter-pg");
```

### Criar o adapter e o client

```js
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
```

O **adapter** configura a ligação ao PostgreSQL usando a connection string do `.env`.

---

## 📡 Endpoints CRUD com Prisma

### GET /tasks — Listar todas as tarefas

```js
app.get("/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
});
```

### GET /tasks/:id — Obter uma tarefa

```js
app.get("/tasks/:id", async (req, res) => {
    const task = await prisma.task.findUnique({
        where: { id: req.params.id },
    });
    res.status(200).json(task);
});
```

### POST /tasks — Criar tarefa

```js
app.post("/tasks", async (req, res) => {
    const { title, description } = req.body;
    const newTask = await prisma.task.create({
        data: { title, description },
    });
    res.status(201).json(newTask);
});
```

### PUT /tasks/:id — Atualizar tarefa

```js
app.put("/tasks/:id", async (req, res) => {
    const { title, description, completed } = req.body;
    const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { title, description, completed },
    });
    res.status(200).json(updatedTask);
});
```

### DELETE /tasks/:id — Apagar tarefa

```js
app.delete("/tasks/:id", async (req, res) => {
    await prisma.task.delete({
        where: { id: req.params.id },
    });
    res.status(204).send();
});
```

---

## 🔍 Métodos Prisma mais usados

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `findMany()` | Listar todos os registos | `prisma.task.findMany()` |
| `findUnique()` | Obter um registo por campo único | `prisma.task.findUnique({ where: { id } })` |
| `create()` | Criar um novo registo | `prisma.task.create({ data: { title } })` |
| `update()` | Atualizar um registo | `prisma.task.update({ where: { id }, data: { title } })` |
| `delete()` | Apagar um registo | `prisma.task.delete({ where: { id } })` |
| `count()` | Contar registos | `prisma.task.count()` |
| `findMany({ where })` | Filtrar registos | `prisma.task.findMany({ where: { completed: true } })` |

---

# 🧪 LAB-3 — API Gestão de Tarefas com Prisma 🗄️

Refazer o **LAB-2** mas agora com **base de dados real** usando **Prisma + PostgreSQL**.

### Configuração inicial:

1. Instalar dependências: `prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`
2. Inicializar o Prisma: `npx prisma init`
3. Configurar a connection string no `.env`
4. Criar o model `Task` no `schema.prisma`:

```prisma
model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    String   @default("medium")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

5. Sincronizar: `npx prisma db push`
6. Gerar client: `npx prisma generate`

### Implementar:

- `GET /tasks` — Listar todas as tarefas
- `GET /tasks/:id` — Obter uma tarefa por ID
- `GET /tasks?completed=true` — Filtrar por estado (usar `req.query` + `prisma.task.findMany({ where })`)
- `POST /tasks` — Criar tarefa
- `PUT /tasks/:id` — Atualizar tarefa
- `PATCH /tasks/:id/toggle` — Alternar estado `completed` (ler o valor atual e inverter)
- `DELETE /tasks/:id` — Apagar tarefa

### Requisitos:

- Usar **Prisma** para todas as operações (sem dados mock)
- Validar campos obrigatórios (`title`, `priority`)
- Validar que `priority` seja `"low"`, `"medium"` ou `"high"`
- Retornar **404** quando a tarefa não existe
- Status codes corretos (200, 201, 400, 404, 204)
- Testar todos os endpoints no Postman

> 💡 **Desafio extra:** Implementar `GET /tasks/stats` que retorna o número total de tarefas, quantas estão completas e quantas estão pendentes, usando `prisma.task.count()` com filtros.

---

# 🔐 Autenticação com JWT e bcrypt

A **autenticação** permite identificar quem está a fazer pedidos à API e **proteger rotas** que só utilizadores autenticados podem aceder.

### 🔄 Fluxo de Autenticação

```
1. SIGNUP (Registo)
   Cliente envia: { name, email, password }
        │
        ▼
   Servidor:
   - Valida os campos
   - Verifica se o email já existe
   - Faz hash da password com bcrypt
   - Guarda o utilizador na BD
   - Retorna os dados do utilizador (sem password)

2. SIGNIN (Login)
   Cliente envia: { email, password }
        │
        ▼
   Servidor:
   - Procura o utilizador pelo email
   - Compara a password com bcrypt.compare()
   - Se válido, gera um JWT token
   - Retorna o token

3. ACEDER A ROTAS PROTEGIDAS
   Cliente envia pedido com header:
   Authorization: Bearer <token>
        │
        ▼
   Middleware:
   - Extrai o token do header
   - Verifica o token com jwt.verify()
   - Se válido, permite o acesso
   - Se inválido, retorna 401/403
```

---

## 📦 Instalação

```bash
npm install jsonwebtoken bcrypt
```

---

## 🗄️ Model User no Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Depois sincronizar:

```bash
npx prisma db push
npx prisma generate
```

---

## ⚙️ Configuração do `.env`

Adicionar a secret key para o JWT:

```
JWT_SECRET="supersecretkey123"
```

> ⚠️ **Importante:** Em produção, usar uma chave forte e nunca a partilhar publicamente.

---

## 📡 Imports no `server.js`

```js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
```

---

## 🛡️ Middleware de Autenticação

```js
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido" });
        }
        req.user = user;
        next();
    });
};
```

| Código | Significado |
|--------|------------|
| `401` | Token não fornecido — o utilizador não enviou o token |
| `403` | Token inválido ou expirado — não tem permissão |

---

## 📝 Endpoint: Signup (Registo)

```js
app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Campos 'name', 'email' e 'password' são obrigatórios" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: "Email já registado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    });
});
```

| Passo | Descrição |
|-------|-----------|
| Validação | Verifica se todos os campos foram enviados |
| Duplicado | Verifica se o email já existe (retorna `409`) |
| Hash | `bcrypt.hash(password, 10)` — transforma a password num hash seguro |
| Criar | Guarda o utilizador com a password encriptada |
| Resposta | Retorna os dados do utilizador **sem a password** |

> 💡 O número `10` em `bcrypt.hash(password, 10)` é o **salt rounds** — quanto maior, mais seguro mas mais lento.

---

## 🔑 Endpoint: Signin (Login)

```js
app.post("/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Campos 'email' e 'password' são obrigatórios" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ token });
});
```

| Passo | Descrição |
|-------|-----------|
| Validação | Verifica se email e password foram enviados |
| Procurar | Procura o utilizador pelo email |
| Comparar | `bcrypt.compare()` — compara a password enviada com o hash guardado |
| Gerar token | `jwt.sign()` — cria um token com os dados do utilizador |
| Expiração | `expiresIn: "1h"` — o token expira em 1 hora |

> ⚠️ **Segurança:** A mensagem de erro é sempre "Credenciais inválidas" — nunca revelar se o email existe ou não.

---

## 🔒 Proteger Rotas

Para proteger uma rota, basta adicionar `authenticateToken` como middleware:

```js
// Rota NÃO protegida
app.get("/tasks", async (req, res) => { ... });

// Rota PROTEGIDA
app.get("/tasks", authenticateToken, async (req, res) => { ... });
```

Dentro da rota protegida, o utilizador autenticado está disponível em `req.user`:

```js
app.get("/tasks", authenticateToken, async (req, res) => {
    console.log(req.user); // { id: "...", email: "..." }
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
});
```

---

## 🧪 Testar no Postman

### 1. Signup

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:4242/auth/signup` |
| Body → raw → JSON | Ver abaixo |

```json
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "123456"
}
```

### 2. Signin

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:4242/auth/signin` |
| Body → raw → JSON | Ver abaixo |

```json
{
  "email": "ana@email.com",
  "password": "123456"
}
```

**Resposta:** Copiar o `token` retornado.

### 3. Aceder a rota protegida

| Campo | Valor |
|-------|-------|
| Método | `GET` |
| URL | `http://localhost:4242/tasks` |
| Header | `Authorization: Bearer <token_copiado>` |

No Postman:
1. Ir ao separador **Authorization**
2. Selecionar tipo **Bearer Token**
3. Colar o token

---

# 🧪 LAB-4 — Autenticação e Rotas Protegidas 🔐

Adicionar **autenticação** ao projeto do **LAB-3** usando **JWT** e **bcrypt**.

### Configuração inicial:

1. Instalar dependências: `jsonwebtoken`, `bcrypt`
2. Adicionar `JWT_SECRET` ao `.env`
3. Adicionar o model `User` ao `schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

4. Sincronizar: `npx prisma db push`
5. Gerar client: `npx prisma generate`

### Implementar:

- `POST /auth/signup` — Registar um novo utilizador
  - Validar campos obrigatórios (`name`, `email`, `password`)
  - Verificar se o email já existe (retornar `409`)
  - Fazer hash da password com `bcrypt.hash()`
  - Retornar dados do utilizador **sem a password**

- `POST /auth/signin` — Login do utilizador
  - Validar campos obrigatórios (`email`, `password`)
  - Procurar utilizador pelo email
  - Comparar password com `bcrypt.compare()`
  - Gerar token JWT com `jwt.sign()`
  - Retornar o token

- **Middleware `authenticateToken`** — Verificar o token JWT
  - Extrair o token do header `Authorization: Bearer <token>`
  - Verificar com `jwt.verify()`
  - Se válido, adicionar `req.user` e chamar `next()`
  - Se inválido, retornar `401` ou `403`

- **Proteger todas as rotas de tasks** do LAB-3 com o middleware

### Requisitos:

- Usar **bcrypt** para encriptar passwords (nunca guardar em texto simples)
- Usar **JWT** para gerar e verificar tokens
- Nunca retornar a password do utilizador na resposta
- Mensagens de erro genéricas no login ("Credenciais inválidas")
- Status codes corretos (200, 201, 400, 401, 403, 409)
- Testar todos os endpoints no Postman

> 💡 **Desafio extra:** Implementar `GET /auth/profile` (rota protegida) que retorna os dados do utilizador autenticado usando `req.user.id` para buscar na base de dados.

