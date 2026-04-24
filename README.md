
# 🎬 API de Biblioteca Digital de Filmes

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## 📖 Descrição
Esta é uma **API RESTful profissional** desenvolvida para a gestão de uma Biblioteca Digital de Filmes. O sistema permite o controlo total sobre um catálogo de filmes e diretores, integrando uma camada de segurança robusta para proteger operações de criação, atualização e eliminação de dados.

## 🚀 Tecnologias Utilizadas
* **Backend:** Node.js com Express.js.
* **ORM:** Prisma v7.
* **Base de Dados:** SQLite (via `better-sqlite3`).
* **Autenticação:** JSON Web Token (JWT).
* **Segurança:** Encriptação de passwords com Bcrypt.

## 🏗️ Estrutura da Base de Dados
A API utiliza os seguintes modelos de dados:
* **User:** Gestão de utilizadores com nome, email e password encriptada.
* **Director:** Registo dos diretores de cinema.
* **Filme:** Registo de filmes associados a um diretor.

## ⚙️ Instalação e Execução

### 1. Clonar e Instalar
```bash
npm install
```

### 2\. Configurar Variáveis de Ambiente (.env)

Cria um ficheiro `.env` na raiz do projeto com:

Fragmento do código

```
SERVER_PORT=4242
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="tua_chave_secreta_aqui"

```

### 3\. Preparar a Base de Dados

Bash

```
npx prisma db push
npx prisma generate

```

### 4\. Iniciar o Servidor

Bash

```
npm run dev

```

📡 Endpoints da API
-------------------

### Autenticação (Público)

| **Método** | **Endpoint** | **Descrição** |
| --- | --- | --- |
| `POST` | `/auth/signup` | Registo de novo utilizador |
| `POST` | `/auth/signin` | Login e obtenção de Token JWT |

### Catálogo de Filmes

| **Método** | **Endpoint** | **Autenticação** |
| --- | --- | --- |
| `GET` | `/filmes` | ❌ Pública |
| `GET` | `/filmes/:id` | ❌ Pública |
| `POST` | `/filmes` | ✅ Bearer JWT |
| `PUT` | `/filmes/:id` | ✅ Bearer JWT |
| `DELETE` | `/filmes/:id` | ✅ Bearer JWT |

🛡️ Segurança Implementada
--------------------------

-   **Passwords Hashed:** Utilização de Bcrypt para garantir que as passwords nunca são guardadas em texto simples.

-   **Proteção de Rotas:** Middleware `authenticateToken` que valida o JWT antes de permitir operações de escrita.

🧪 Postman
----------

Podes testar todos os endpoints importando o ficheiro incluído no repositório:

`API-BibliotecaDigital-Filmes.postman_collection.json`.