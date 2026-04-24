
# 🎬 API de Biblioteca Digital de Filmes

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## 📖 Descrição
Esta é uma **API RESTful profissional** desenvolvida para a gestão de uma Biblioteca Digital de Filmes. O projeto integra um sistema completo de gestão de filmes e diretores com uma camada de segurança robusta baseada em autenticação JWT (Stateless) e encriptação de dados sensíveis.

Desenvolvido como projeto final no âmbito da unidade curricular de **Programação Web / Backend**.

---

## 🚀 Funcionalidades & Arquitetura
* **CRUD Completo:** Gestão de Filmes e Diretores com validações de integridade.
* **Segurança Enterprise:** Hashing de passwords com **Bcrypt** e autenticação via **Bearer Tokens (JWT)**.
* **ORM Moderno:** Utilização de Prisma v7 para modelação de dados e consultas seguras.
* **Middleware Layer:** Implementação de logs (Morgan), controlo de acesso (CORS) e proteção de rotas.

---

## ⚙️ Setup e Instalação

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2\. Configuração do Ambiente (.env)

Cria um ficheiro `.env` na raiz do projeto com as seguintes variáveis:

Fragmento do código

```
SERVER_PORT=4242
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="tua_chave_secreta_aqui"

```

### 3\. Preparação da Base de Dados (Prisma)

Executa os comandos para sincronizar o schema e gerar o cliente:

Bash

```
npx prisma db push
npx prisma generate

```

### 4\. Executar o Servidor

Bash

```
npm run dev

```

* * * * *

📡 Documentação da API
----------------------

### 🔐 Autenticação (Acesso Público)

| **Método** | **Endpoint** | **Descrição** |
| --- | --- | --- |
| `POST` | `/auth/signup` | Regista um utilizador com password encriptada |
| `POST` | `/auth/signin` | Autentica e gera o Token de acesso JWT |

### 🎥 Gestão de Filmes

| **Método** | **Endpoint** | **Descrição** | **Proteção** |
| --- | --- | --- | --- |
| `GET` | `/filmes` | Lista todos os filmes e respetivos diretores | ❌ Livre |
| `GET` | `/filmes/:id` | Detalhes técnicos de um filme específico | ❌ Livre |
| `POST` | `/filmes` | Adiciona um novo filme ao catálogo | ✅ JWT |
| `PUT` | `/filmes/:id` | Atualiza metadados de um filme | ✅ JWT |
| `DELETE` | `/filmes/:id` | Remove um filme permanentemente | ✅ JWT |

* * * * *

📥 Exemplos de Pedidos (Payloads)
---------------------------------

### Signup (Registo)

**POST** `/auth/signup`

JSON

```
{
  "name": "Afonso Carvalho",
  "email": "afonso@email.com",
  "password": "password123"
}

```

### Login (Autenticação)

**POST** `/auth/signin` -> Retorna: `{ "token": "eyJhbG..." }`

### Criar Filme (Requer Token no Header)

**POST** `/filmes`

*Header: Authorization: Bearer <token>*

JSON

```
{
  "titulo": "Inception",
  "ano": 2010,
  "directorId": 1
}

```

* * * * *

🛡️ Segurança & Boas Práticas
-----------------------------

-   **Hashing Dinâmico:** Utilização de Bcrypt com salt rounds para proteção contra ataques de dicionário.

-   **JWT Stateless:** Tokens assinados com validade temporal para sessões seguras.

-   **Middlewares de Erro:** Captura centralizada de erros 404 (Rota não encontrada) e 500 (Erro interno).

* * * * *

🧪 Postman Collection
---------------------

Para testar todos os cenários da API, importa o ficheiro incluído na raiz:

📂 `API-BibliotecaDigital-Filmes.postman_collection.json`

* * * * *

👨‍💻 Autor
-----------

**Afonso José Lopes Carvalho**

*Estudante de Tecnologias e Programação de Sistemas de Informação*