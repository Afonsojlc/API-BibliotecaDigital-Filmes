require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// 1. Initialize the SQLite adapter using DATABASE_URL or default to dev.db
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Resetting database tables...");
  await prisma.filme.deleteMany();
  await prisma.director.deleteMany();
  await prisma.user.deleteMany();

  console.log("🎬 Seeding directors...");
  // Iconic Directors
  const nolan = await prisma.director.create({ data: { nome: "Christopher Nolan" } });
  const stallone = await prisma.director.create({ data: { nome: "Sylvester Stallone" } });
  const tarantino = await prisma.director.create({ data: { nome: "Quentin Tarantino" } });

  // Harry Potter Directors
  const columbus = await prisma.director.create({ data: { nome: "Chris Columbus" } });
  const cuaron = await prisma.director.create({ data: { nome: "Alfonso Cuarón" } });
  const newell = await prisma.director.create({ data: { nome: "Mike Newell" } });
  const yates = await prisma.director.create({ data: { nome: "David Yates" } });

  // Culpables Saga Director
  const gonzalez = await prisma.director.create({ data: { nome: "Domingo González" } });

  console.log("🎥 Seeding movies...");
  await prisma.filme.createMany({
    data: [
      // Christopher Nolan
      { titulo: "Interstellar", ano: 2014, directorId: nolan.id },
      { titulo: "The Dark Knight", ano: 2008, directorId: nolan.id },
      { titulo: "Batman Begins", ano: 2005, directorId: nolan.id },
      { titulo: "The Dark Knight Rises", ano: 2012, directorId: nolan.id },
      { titulo: "Oppenheimer", ano: 2023, directorId: nolan.id },

      // Sylvester Stallone
      { titulo: "Rocky", ano: 1976, directorId: stallone.id },
      { titulo: "Rocky Balboa", ano: 2006, directorId: stallone.id },

      // Quentin Tarantino
      { titulo: "Pulp Fiction", ano: 1994, directorId: tarantino.id },
      { titulo: "Inglourious Basterds", ano: 2009, directorId: tarantino.id },

      // Harry Potter Complete Saga
      { titulo: "Harry Potter and the Philosopher's Stone", ano: 2001, directorId: columbus.id },
      { titulo: "Harry Potter and the Chamber of Secrets", ano: 2002, directorId: columbus.id },
      { titulo: "Harry Potter and the Prisoner of Azkaban", ano: 2004, directorId: cuaron.id },
      { titulo: "Harry Potter and the Goblet of Fire", ano: 2005, directorId: newell.id },
      { titulo: "Harry Potter and the Order of the Phoenix", ano: 2007, directorId: yates.id },
      { titulo: "Harry Potter and the Half-Blood Prince", ano: 2009, directorId: yates.id },
      { titulo: "Harry Potter and the Deathly Hallows – Part 1", ano: 2010, directorId: yates.id },
      { titulo: "Harry Potter and the Deathly Hallows – Part 2", ano: 2011, directorId: yates.id },

      // Culpables Saga
      { titulo: "Culpa Mía", ano: 2023, directorId: gonzalez.id },
      { titulo: "Culpa Tuya", ano: 2024, directorId: gonzalez.id }
    ]
  });

  console.log("👤 Seeding demo user for immediate testing...");
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  await prisma.user.create({
    data: {
      name: "Demo Admin",
      email: "demo@example.com",
      password: hashedPassword
    }
  });

  console.log("✅ Database seeded successfully with Harry Potter, Culpa Mía & Classics!");
  console.log("   Credentials: demo@example.com / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
