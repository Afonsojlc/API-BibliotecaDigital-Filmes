require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const app = express();
const PORT = process.env.SERVER_PORT || 4242;

// ==========================================
// 🔧 SQLite Adapter & Prisma Client Setup
// ==========================================
// Resolves the database URL from environment or defaults to the local Prisma SQLite file
const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbFilePath = databaseUrl.replace(/^file:/, "");

// Instantiate the native SQLite connection and Prisma adapter
const db = new Database(dbFilePath);
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

// ==========================================
// 🌐 Global Middlewares
// ==========================================
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(morgan("dev")); // HTTP request logger middleware

// ==========================================
// 🛡️ AUTHENTICATION MIDDLEWARE (JWT Guard)
// ==========================================
const authenticateToken = (req, res, next) => {
  // 1. Extract Bearer token from the HTTP Authorization header
  // Expected Header Format: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2. If no token is provided, block access (401 Unauthorized)
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token not provided." });
  }

  // 3. Verify token integrity using JWT_SECRET
  const secret = process.env.JWT_SECRET || "fallback_secret_key";
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // 403 Forbidden indicates an invalid or expired token
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    // 4. Attach decoded token payload to req.user and proceed to next handler
    req.user = user;
    next();
  });
};

// ==========================================
// 🎬 ENDPOINTS - DIRECTORS (REALIZADORES)
// ==========================================

// 1️⃣ GET /directores (and /directors) — List all directors with their movies
const listDirectors = async (req, res) => {
  try {
    const directors = await prisma.director.findMany({
      include: { filmes: true }
    });
    res.status(200).json(directors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch directors." });
  }
};
app.get("/directores", listDirectors);
app.get("/directors", listDirectors);

// 2️⃣ GET /directores/:id — Get a single director by ID with their filmography
const getDirectorById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid director ID. Must be a number." });
  }

  try {
    const director = await prisma.director.findUnique({
      where: { id },
      include: { filmes: true }
    });

    if (!director) {
      return res.status(404).json({ message: "Director not found." });
    }

    res.status(200).json(director);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch director." });
  }
};
app.get("/directores/:id", getDirectorById);
app.get("/directors/:id", getDirectorById);

// 3️⃣ POST /directores — Create a new director (Protected Route)
const createDirector = async (req, res) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return res.status(400).json({ message: "Field 'nome' is required." });
  }

  try {
    const newDirector = await prisma.director.create({
      data: { nome: nome.trim() }
    });
    res.status(201).json(newDirector);
  } catch (error) {
    res.status(500).json({ error: "Failed to create director." });
  }
};
app.post("/directores", authenticateToken, createDirector);
app.post("/directors", authenticateToken, createDirector);

// ==========================================
// 🎥 ENDPOINTS - MOVIES (FILMES)
// ==========================================

// 1️⃣ GET /filmes (and /movies) — List all movies including their director
const listMovies = async (req, res) => {
  try {
    const filmes = await prisma.filme.findMany({
      include: { director: true }
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies." });
  }
};
app.get("/filmes", listMovies);
app.get("/movies", listMovies);

// 2️⃣ POST /filmes (and /movies) — Create a new movie (Protected Route)
const createMovie = async (req, res) => {
  const { titulo, ano, directorId } = req.body;

  if (!titulo || !ano || !directorId) {
    return res.status(400).json({
      message: "Fields 'titulo', 'ano', and 'directorId' are required."
    });
  }

  const parsedYear = parseInt(ano, 10);
  const parsedDirectorId = parseInt(directorId, 10);

  if (isNaN(parsedYear) || isNaN(parsedDirectorId)) {
    return res.status(400).json({
      message: "Fields 'ano' and 'directorId' must be valid integers."
    });
  }

  try {
    // Verify that the referenced director exists before creating movie
    const directorExists = await prisma.director.findUnique({
      where: { id: parsedDirectorId }
    });

    if (!directorExists) {
      return res.status(404).json({
        message: `Director with ID ${parsedDirectorId} does not exist.`
      });
    }

    const novoFilme = await prisma.filme.create({
      data: {
        titulo: titulo.trim(),
        ano: parsedYear,
        directorId: parsedDirectorId
      },
      include: { director: true }
    });
    res.status(201).json(novoFilme);
  } catch (error) {
    res.status(500).json({ error: "Failed to create movie." });
  }
};
app.post("/filmes", authenticateToken, createMovie);
app.post("/movies", authenticateToken, createMovie);

// 3️⃣ GET /filmes/:id — Get a single movie by ID
const getMovieById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid movie ID. Must be a number." });
  }

  try {
    const filme = await prisma.filme.findUnique({
      where: { id },
      include: { director: true }
    });

    if (!filme) {
      return res.status(404).json({ message: "Movie not found." });
    }

    res.status(200).json(filme);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." });
  }
};
app.get("/filmes/:id", getMovieById);
app.get("/movies/:id", getMovieById);

// 4️⃣ PUT /filmes/:id — Update an existing movie (Protected Route)
const updateMovie = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid movie ID. Must be a number." });
  }

  const { titulo, ano, directorId } = req.body;
  if (!titulo && !ano && !directorId) {
    return res.status(400).json({
      message: "At least one field ('titulo', 'ano', or 'directorId') must be provided."
    });
  }

  const updateData = {};
  if (titulo) updateData.titulo = titulo.trim();
  if (ano) {
    const parsedYear = parseInt(ano, 10);
    if (isNaN(parsedYear)) {
      return res.status(400).json({ message: "Field 'ano' must be a valid integer." });
    }
    updateData.ano = parsedYear;
  }
  if (directorId) {
    const parsedDirectorId = parseInt(directorId, 10);
    if (isNaN(parsedDirectorId)) {
      return res.status(400).json({ message: "Field 'directorId' must be a valid integer." });
    }
    const directorExists = await prisma.director.findUnique({
      where: { id: parsedDirectorId }
    });
    if (!directorExists) {
      return res.status(404).json({
        message: `Director with ID ${parsedDirectorId} does not exist.`
      });
    }
    updateData.directorId = parsedDirectorId;
  }

  try {
    const filmeAtualizado = await prisma.filme.update({
      where: { id },
      data: updateData,
      include: { director: true }
    });
    res.status(200).json(filmeAtualizado);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Movie not found to update." });
    }
    res.status(500).json({ error: "Failed to update movie." });
  }
};
app.put("/filmes/:id", authenticateToken, updateMovie);
app.put("/movies/:id", updateMovie);

// 5️⃣ DELETE /filmes/:id — Delete a movie (Protected Route)
const deleteMovie = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid movie ID. Must be a number." });
  }

  try {
    await prisma.filme.delete({
      where: { id }
    });
    // 204 No Content indicates successful deletion
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Movie not found to delete." });
    }
    res.status(500).json({ error: "Failed to delete movie." });
  }
};
app.delete("/filmes/:id", authenticateToken, deleteMovie);
app.delete("/movies/:id", authenticateToken, deleteMovie);

// ==========================================
// 🔐 ENDPOINTS - AUTHENTICATION
// ==========================================

// 📝 POST /auth/signup — Register a new user
app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Fields 'name', 'email', and 'password' are required."
    });
  }

  try {
    // 1. Verify if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // 2. Hash password securely using bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Persist new user in database
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword
      }
    });

    // 4. Return created user payload (excluding sensitive password hash)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user." });
  }
});

// 🔑 POST /auth/signin — User Login & JWT Token issuance
app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Fields 'email' and 'password' are required."
    });
  }

  try {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    // 2. Protect against user enumeration by returning a generic 401 error
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. Generate signed JWT token valid for 1 hour
    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn: "1h" }
    );

    // 4. Return token and user metadata
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate." });
  }
});

// ==========================================
// 🛡️ Error Middlewares (Keep at the end!)
// ==========================================

// Route not found handler (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global internal error handler (500)
app.use((err, req, res, next) => {
  console.error("Unhandled Application Error:", err.stack || err);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`✅ Movie Catalog API running at http://localhost:${PORT}`);
});
