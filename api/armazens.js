import mongoose from "mongoose";
import Armazem from "../models/Armazem.js";

mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
    
    // 🛠️ 1. TRATAMENTO DO PREFLIGHT (OPTIONS) 🛠️
    // Necessário para permitir POST/PUT/DELETE de outras origens (CORS).
    if (req.method === 'OPTIONS') {
        // Retorna 200 OK, confiando que o vercel.json já adicionou os cabeçalhos CORS.
        return res.status(200).end(); 
    }

    // 📝 2. LÓGICA POST (CRIAR ARMÁZEM)
    if (req.method === "POST") {
        try {
            const { nome } = req.body;
            if (!nome) return res.status(400).json({ error: "Nome do armazém é obrigatório." });
            
            const novo = new Armazem({ nome });
            await novo.save();
            
            // Retorna status 201 Created
            return res.status(201).json({ message: "Armazém criado com sucesso!", armazem: novo });
        } catch (err) {
            // Pode ser erro 500 ou 409 (conflito) se usar validação de unicidade.
            return res.status(500).json({ error: "Erro ao criar armazém." });
        }
    }

    // 📊 3. LÓGICA GET (BUSCAR ARMÁZENS)
    if (req.method === "GET") {
        try {
            const armazens = await Armazem.find().sort({ nome: 1 });
            // Retorna apenas o array de nomes
            return res.status(200).json(armazens.map(a => a.nome)); 
        } catch (err) {
            return res.status(500).json({ error: "Erro ao buscar armazéns." });
        }
    }

    // 🚫 4. TRATAMENTO DE OUTROS MÉTODOS
    // Se o método não for OPTIONS, POST, ou GET.
    return res.status(405).end();
}
