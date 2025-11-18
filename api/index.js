//import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

//dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Importa rotas simulando Vercel
import contagemRouter from "./api/contagem.js";
import datasRouter from "./api/datas.js";
import armazensRouter from "./api/armazens.js";

app.use("/api/contagem", contagemRouter);
app.use("/api/datas", datasRouter);
app.use("/api/armazens", armazensRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor local rodando na porta ${PORT}`);
});
