require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

// 1. Criar o adaptador com o URL da base de dados
const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db"
});

// 2. Passar o adaptador para o PrismaClient (Era isto que faltava!)
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("A limpar a base de dados...");
    await prisma.filme.deleteMany();
    await prisma.director.deleteMany();

    console.log("A criar realizadores...");
    const director1 = await prisma.director.create({
        data: { nome: "Christopher Nolan" },
    });
    
    const director2 = await prisma.director.create({
        data: { nome: "Sylvester Stallone" },
    });

    console.log("A adicionar filmes...");
    await prisma.filme.createMany({
        data: [
            { titulo: "Interstellar", ano: 2014, directorId: director1.id },
            { titulo: "The Dark Knight", ano: 2008, directorId: director1.id },
            { titulo: "Batman Begins", ano: 2005, directorId: director1.id },
            { titulo: "The Dark Knight Rises", ano: 2012, directorId: director1.id },
            { titulo: "Rocky Balboa", ano: 2006, directorId: director2.id },
            { titulo: "Rocky II", ano: 1979, directorId: director2.id },
            { titulo: "Rocky III", ano: 1982, directorId: director2.id },
            { titulo: "Rocky IV", ano: 1985, directorId: director2.id },
        ],
    });
    
    console.log("✅ Seed executado com sucesso! Ufa!");
}

main()
    .catch((e) => {
        console.error("Erro na execução do seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });