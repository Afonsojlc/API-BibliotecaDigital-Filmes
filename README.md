# 🎬 Biblioteca Digital de Filmes API

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📖 Descrição

API RESTful para gestão de uma Biblioteca Digital de Filmes com autenticação JWT.

---

## 🏗️ Arquitetura

```
[ Cliente (Postman / Frontend) ]
              │
              ▼
        [ Express API ]
              │
   ┌──────────┼──────────┐
   ▼          ▼          ▼
[Routes]  [Middleware] [Auth]
              │
              ▼
         [ Prisma ORM ]
              │
              ▼
         [ SQLite DB ]
```

---

## ⚙️ Instalação

```bash
npm install
```

```env
SERVER_PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="secret"
```

```bash
npx prisma db push
npm run dev
```

---

## 🔐 Autenticação

Header obrigatório nas rotas protegidas:

```
Authorization: Bearer <token>
```

---

## 📡 Endpoints

### Auth

| Método | Endpoint | Auth |
|--------|---------|------|
| POST | /auth/signup | ❌ |
| POST | /auth/signin | ❌ |

### Filmes

| Método | Endpoint | Auth |
|--------|---------|------|
| GET | /filmes | ❌ |
| GET | /filmes/:id | ❌ |
| POST | /filmes | ✅ |
| PUT | /filmes/:id | ✅ |
| DELETE | /filmes/:id | ✅ |

---

## 📥 Exemplos

### Signup

Request:
```json
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

Response:
```json
{
  "id": 1,
  "email": "joao@email.com"
}
```

---

### Signin

Request:
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

Response:
```json
{
  "token": "jwt_token"
}
```

---

### Criar Filme (Protegido)

Request:
```json
{
  "titulo": "Inception",
  "ano": 2010,
  "directorId": 1
}
```

Response:
```json
{
  "id": 1,
  "titulo": "Inception"
}
```

---

## 🧪 Postman

Importar:
API-BibliotecaDigital-Filmes.postman_collection.json

---

## 👨‍💻 Autor

Projeto académico de Programação Web.
