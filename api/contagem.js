import mongoose from "mongoose";
import Contagem from "../models/Contagem.js";

// Conectar ao MongoDB usando a variável de ambiente.
// Em um ambiente Serverless, é crucial ter um padrão de caching para evitar 
// reconexões constantes, mas para este setup, esta sintaxe é aceitável.
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {

  //  1. TRATAMENTO DO PREFLIGHT (OPTIONS)
  if (req.method === 'OPTIONS') {
    // Como os cabeçalhos CORS já estão no vercel.json, 
    // basta retornar um status 200 OK para o navegador prosseguir.
    return res.status(200).end();
  }

  // 2. LÓGICA POST (SALVAR DADOS)
  if (req.method === "POST") {
    try {
      // O Vercel já parseia o corpo (body) para JSON.
      const dados = req.body;

      if (!Array.isArray(dados) || dados.length === 0) {
        return res.status(400).json({ error: "Dados inválidos ou vazios." });
      }

      // Validação de campos obrigatórios
      const { data, armazem } = dados[0];
      if (!data || !armazem) {
        return res.status(400).json({ error: "Data e armazém são obrigatórios." });
      }

      // Limpa dados anteriores e insere os novos
      await Contagem.deleteMany({ data, armazem });
      await Contagem.insertMany(dados);

      return res.status(200).json({ message: `Contagem de ${data} (${armazem}) salva com sucesso!` });

    } catch (err) {
      console.error("Erro ao salvar contagem:", err);
      return res.status(500).json({ error: "Erro ao salvar contagem." });
    }
  }

  // 3. LÓGICA GET (BUSCAR DADOS)
  if (req.method === "GET") {
    try {
      const filtro = {};
      if (req.query.armazem) filtro.armazem = req.query.armazem;
      if (req.query.data) filtro.data = req.query.data;

      const dados = await Contagem.find(filtro).sort({ data: -1 });

      return res.status(200).json(dados);

    } catch (err) {
      console.error("Erro ao buscar contagem:", err);
      return res.status(500).json({ error: "Erro ao buscar contagem." });
    }
  }

  // 4. TRATAMENTO DE OUTROS MÉTODOS
  // Se o método não for OPTIONS, POST, ou GET.
  return res.status(405).end();
}


