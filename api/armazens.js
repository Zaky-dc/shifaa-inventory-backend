import mongoose from "mongoose";
import Armazem from "../models/Armazem.js";

mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: "Nome do armazém é obrigatório." });
      const novo = new Armazem({ nome });
      await novo.save();
      return res.status(201).json({ message: "Armazém criado com sucesso!", armazem: novo });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao criar armazém." });
    }
  }

  if (req.method === "GET") {
    try {
      const armazens = await Armazem.find().sort({ nome: 1 });
      return res.status(200).json(armazens.map(a => a.nome));
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar armazéns." });
    }
  }

  return res.status(405).end();
}
