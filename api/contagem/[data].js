import mongoose from "mongoose";
import Contagem from "../../models/Contagem.js";

mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  const { data } = req.query;

  // 🛠️ 1. TRATAMENTO DO PREFLIGHT (OPTIONS) 🛠️
  // Essencial para permitir DELETE/POST/PUT de outras origens (CORS).
  if (req.method === 'OPTIONS') {
    // Retorna 200 OK, permitindo que o navegador prossiga com a requisição real.
    return res.status(200).end(); 
  }

  // 📝 2. LÓGICA GET (BUSCAR DADOS)
  if (req.method === "GET") {
    if (!data) {
        return res.status(400).json({ error: "Parâmetro 'data' é obrigatório para busca." });
    }
    try {
      const dados = await Contagem.find({ data });
      return res.status(200).json(dados);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar contagem por data." });
    }
  }

  // 🗑️ 3. LÓGICA DELETE (APAGAR DADOS)
  if (req.method === "DELETE") {
    if (!data) {
        return res.status(400).json({ error: "Parâmetro 'data' é obrigatório para exclusão." });
    }
    try {
      await Contagem.deleteMany({ data });
      return res.status(200).json({ message: `Contagens de ${data} apagadas.` });
    } catch (err) {
      return res.status(500).json({ error: "Erro ao apagar contagem." });
    }
  }

  // 🚫 4. TRATAMENTO DE OUTROS MÉTODOS
  return res.status(405).end();
}
