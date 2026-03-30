require("dotenv").config();

const express = require("express"); const cors = require("cors"); const morgan = require("morgan");

const app = express();

app.use(cors()); app.use(express.json()); app.use(morgan("dev"));

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor a correr em http://localhost:${PORT}`);
});