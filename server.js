require("dotenv").config();
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
// 🎬 ENDPOINTS - FILMES & DIRETORES
// ==========================================

// 1️⃣ GET /filmes — Listar todos os filmes
app.get("/filmes", async (req, res) => {
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
app.post("/filmes", async (req, res) => {
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