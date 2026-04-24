
# 🎬 Biblioteca Digital de Filmes API

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![SQLite](https://img.shields.io/badge/SQLite-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📖 Descrição

API RESTful profissional para gestão de uma Biblioteca Digital de Filmes.

Inclui:
- CRUD completo de filmes
- Autenticação JWT
- Segurança com bcrypt
- ORM com Prisma
- Estrutura escalável estilo empresa

---

## 🏗️ Arquitetura Profissional

```
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── prisma/
├── utils/
└── app.js
```

### Fluxo

```
Client → Routes → Controller → Service → Prisma → DB
```

---

## ⚙️ Setup Completo

### Instalar dependências

```bash
npm install
npm install express cors morgan dotenv
npm install jsonwebtoken bcrypt
npm install @prisma/client @prisma/adapter-better-sqlite3
npm install prisma --save-dev
```

---

### Configurar .env

```env
SERVER_PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="super_secret_key"
```

---

### Prisma

```bash
npx prisma init
npx prisma db push
npx prisma generate
```

---

### Run

```bash
npm run dev
```

---

## 🔐 Autenticação

Header obrigatório:

```
Authorization: Bearer <token>
```

---

## 📡 Endpoints

### Auth

| Método | Endpoint |
|--------|---------|
| POST | /auth/signup |
| POST | /auth/signin |

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

```json
{
  "name": "Ana",
  "email": "ana@email.com",
  "password": "123456"
}
```

---

### Signin Response

```json
{
  "token": "jwt_token"
}
```

---

### Criar Filme

```json
{
  "titulo": "Interstellar",
  "ano": 2014,
  "directorId": 1
}
```

---

## 🛡️ Segurança

- bcrypt hashing
- JWT expiração
- Middleware auth
- Validação de inputs

---

## 🧪 Postman

Importar ficheiro incluído no repo.

---

## 🚀 Melhorias Enterprise

- Separação em camadas (Controller/Service)
- Código modular
- Escalável
- Preparado para deploy

---

## 👨‍💻 Autor

Projeto académico — Programação Web
