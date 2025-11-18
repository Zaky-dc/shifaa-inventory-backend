import mongoose from "mongoose";
import Contagem from "../../models/Contagem.js";

mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  const { data } = req.query;

  if (req.method === "GET") {
    try {
      const dados = await Contagem.find({ data });
      return res.status(200).json(dados);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar contagem por data." });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Contagem.deleteMany({ data });
      return res.status(200).json({ message: `Contagens de ${data} apagadas.` });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao apagar contagem." });
    }
  }

  return res.status(405).end();
}
