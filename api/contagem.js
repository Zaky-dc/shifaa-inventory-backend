import mongoose from "mongoose";
import Contagem from "../models/Contagem.js";



export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const dados = req.body;
      if (!Array.isArray(dados) || dados.length === 0) {
        return res.status(400).json({ error: "Dados inválidos ou vazios." });
      }
      const { data, armazem } = dados[0];
      if (!data || !armazem) {
        return res.status(400).json({ error: "Data e armazém são obrigatórios." });
      }
      await Contagem.deleteMany({ data, armazem });
      await Contagem.insertMany(dados);
      return res.status(200).json({ message: `Contagem de ${data} (${armazem}) salva com sucesso!` });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao salvar contagem." });
    }
  }

  if (req.method === "GET") {
    try {
      const filtro = {};
      if (req.query.armazem) filtro.armazem = req.query.armazem;
      const dados = await Contagem.find(filtro).sort({ data: -1 });
      return res.status(200).json(dados);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar contagem." });
    }
  }

  return res.status(405).end();
}

