require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
console.log("🔍 O meu URL da Base de Dados é:", process.env.DATABASE_URL);
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3"); // <-- Importamos a ligação nativa do SQLite

const app = express();

// 🔧 Configuração Correta do Adaptador SQLite
const db = new Database("./prisma/dev.db"); // Aponta diretamente para o teu ficheiro dev.db
const adapter = new PrismaBetterSqlite3({
    url: "file:./prisma/dev.db" // O adaptador usa este formato de URL internamente
});
const prisma = new PrismaClient({ adapter });

// Middlewares obrigatórios
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.SERVER_PORT || 3000;

// ==========================================
// 🛡️ MIDDLEWARE DE AUTENTICAÇÃO (O Segurança)
// ==========================================
const authenticateToken = (req, res, next) => {
    // 1. Procura o token no cabeçalho do pedido
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Se não houver token, barra a entrada (401 Unauthorized)
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    // 3. Se houver token, verifica se é verdadeiro e se foi assinado com o teu JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido ou expirado" });
        }
        // 4. Se for válido, guarda os dados do user e deixa passar para a rota seguinte
        req.user = user;
        next();
    });
};

// ==========================================
// 🎬 ENDPOINTS - FILMES & DIRETORES
// ==========================================

// 1️⃣ GET /filmes — Listar todos os filmes
app.get("/filmes",  async (req, res) => {
  try {
    const filmes = await prisma.filme.findMany({
      include: { director: true } 
    });
    res.status(200).json(filmes);
  } catch (error) {
    console.error("ERRO DETALHADO:", error); // <-- ISTO VAI MOSTRAR-NOS O PROBLEMA!
    res.status(500).json({ error: "Erro ao buscar filmes" });
  }
});

// 2️⃣ POST /filmes — Criar um novo filme
app.post("/filmes",  authenticateToken, async (req, res) => {
  const { titulo, ano, directorId } = req.body;

  if (!titulo || !ano || !directorId) {
    return res.status(400).json({ message: "Campos 'titulo', 'ano' e 'directorId' são obrigatórios" });
  }

  try {
    const novoFilme = await prisma.filme.create({
      data: { titulo, ano, directorId }
    });
    res.status(201).json(novoFilme);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar filme." });
  }
});

// 3️⃣ GET /filmes/:id — Obter apenas UM filme
app.get("/filmes/:id", async (req, res) => {
  const id = parseInt(req.params.id); // Captura o ID do URL e converte para número
  
  try {
    const filme = await prisma.filme.findUnique({
      where: { id: id },
      include: { director: true }
    });

    if (!filme) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    res.status(200).json(filme);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o filme." });
  }
});

// 4️⃣ PUT /filmes/:id — Atualizar um filme
app.put("/filmes/:id",  authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, ano, directorId } = req.body;

  try {
    const filmeAtualizado = await prisma.filme.update({
      where: { id: id },
      data: { titulo, ano, directorId }
    });
    res.status(200).json(filmeAtualizado);
  } catch (error) {
    // Se o Prisma não encontrar o ID para atualizar, ele gera um erro
    res.status(404).json({ error: "Filme não encontrado para atualizar." });
  }
});

// 5️⃣ DELETE /filmes/:id — Apagar um filme
app.delete("/filmes/:id",  authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.filme.delete({
      where: { id: id }
    });
    // O status 204 significa "No Content" (Sucesso, mas sem devolver dados)
    res.status(204).send(); 
  } catch (error) {
    res.status(404).json({ error: "Filme não encontrado para apagar." });
  }
});

// ==========================================
// 🔐 ENDPOINTS - AUTENTICAÇÃO
// ==========================================

// 📝 POST /auth/signup — Registar um novo utilizador
app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Campos 'name', 'email' e 'password' são obrigatórios" });
    }

    try {
        // 1. Verifica se o email já existe na base de dados
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email já registado" });
        }

        // 2. Encripta a password (transforma "1234" num código ilegível)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Guarda o utilizador na BD com a password encriptada
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        // 4. Devolve os dados com sucesso (SEM A PASSWORD!)
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registar utilizador." });
    }
});

// 🔑 POST /auth/signin — Login do utilizador
app.post("/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Campos 'email' e 'password' são obrigatórios" });
    }

    try {
        // 1. Procura o utilizador na base de dados
        const user = await prisma.user.findUnique({ where: { email } });
        
        // 2. Se o utilizador não existir ou a password estiver errada (Mensagem genérica por segurança!)
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // 3. Se tudo estiver certo, gera o "Passe VIP" (Token JWT)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 4. Entrega o token ao utilizador
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Erro ao fazer login." });
    }
});

// ==========================================
// 🛡️ Middlewares de Erro (Sempre no fim!)
// ==========================================

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});