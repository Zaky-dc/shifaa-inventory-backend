import mongoose from "mongoose";
import Contagem from "../../models/Contagem.js";

// Evita reconexões múltiplas em ambiente serverless
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  // O Next.js pega o [data] da URL e joga no query, 
  // mas também precisamos do 'armazem' que virá via ?armazem=...
  const { data, armazem } = req.query;

  // 🛠️ 1. TRATAMENTO DO PREFLIGHT (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 📝 2. GET (BUSCAR DADOS)
  if (req.method === "GET") {
    if (!data) return res.status(400).json({ error: "Data obrigatória." });
    
    try {
      // Se vier armazem na busca, filtra também, senão traz tudo do dia
      const filtro = armazem ? { data, armazem } : { data };
      const dados = await Contagem.find(filtro);
      return res.status(200).json(dados);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar contagem." });
    }
  }

  // 🗑️ 3. DELETE (APAGAR DADOS ESPECÍFICOS)
  if (req.method === "DELETE") {
    // AGORA EXIGIMOS DATA E ARMAZEM PARA NÃO APAGAR O DIA TODO SEM QUERER
    if (!data || !armazem) {
        return res.status(400).json({ error: "Necessário informar Data e Armazém para apagar." });
    }

    try {
      const resultado = await Contagem.deleteMany({ data, armazem });
      
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ message: "Nenhum registo encontrado para apagar." });
      }

      return res.status(200).json({ 
          message: `Sucesso! Registos de '${armazem}' em ${data} foram apagados.` 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao apagar contagem." });
    }
  }

  return res.status(405).end();
}
