require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas'))
  .catch((err) => {
    console.error('🔴 Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

// 🧠 Schema e modelo
const ContagemSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  sistema: Number,
  real: Number,
  diferenca: Number,
  data: String,
  armazem: { type: String, required: true },
  status: { type: String, default: "finalizado" }, // opcional para rascunhos futuros
});

const Contagem = mongoose.model('Contagem', ContagemSchema);

// Schema de Armazém
const ArmazemSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

const Armazem = mongoose.model('Armazem', ArmazemSchema);

// Criar novo armazém
app.post('/armazens', async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome do armazém é obrigatório." });

    const novo = new Armazem({ nome });
    await novo.save();
    res.status(201).json({ message: "Armazém criado com sucesso!", armazem: novo });
  } catch (err) {
    console.error("Erro ao criar armazém:", err.message);
    res.status(500).json({ error: "Erro ao criar armazém." });
  }
});

// Listar armazéns
app.get('/armazens', async (req, res) => {
  try {
    const armazens = await Armazem.find().sort({ nome: 1 });
    res.status(200).json(armazens.map(a => a.nome));
  } catch (err) {
    console.error("Erro ao buscar armazéns:", err.message);
    res.status(500).json({ error: "Erro ao buscar armazéns." });
  }
});


// 📥 Salvar contagem
app.post('/contagem', async (req, res) => {
  try {
    const dados = req.body;

    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(400).json({ error: "Dados inválidos ou vazios." });
    }

    const { data, armazem } = dados[0];
    if (!data || !armazem) {
      return res.status(400).json({ error: "Data e armazém são obrigatórios." });
    }

    // Remove contagens anteriores para mesma data e armazém
    await Contagem.deleteMany({ data, armazem });

    // Insere nova contagem
    await Contagem.insertMany(dados);

    res.status(200).json({ message: `Contagem de ${data} (${armazem}) salva com sucesso!` });
  } catch (err) {
    console.error('Erro ao salvar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao salvar contagem.' });
  }
});

// 📤 Buscar todas as contagens
app.get('/contagem', async (req, res) => {
  try {
    const dados = await Contagem.find().sort({ data: -1 });
    res.status(200).json(dados);
  } catch (err) {
    console.error('Erro ao buscar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao buscar contagem.' });
  }
});

// 📅 Buscar datas disponíveis
app.get('/datas', async (req, res) => {
  try {
    const registros = await Contagem.aggregate([
      {
        $group: {
          _id: { data: "$data", armazem: "$armazem" },
        }
      },
      {
        $project: {
          _id: 0,
          data: "$_id.data",
          armazem: "$_id.armazem"
        }
      },
      { $sort: { data: -1 } }
    ]);

    res.status(200).json(registros);
  } catch (err) {
    console.error('Erro ao buscar datas:', err.message);
    res.status(500).json({ error: 'Erro ao buscar datas.' });
  }
});

// 📆 Buscar contagem por data
app.get('/contagem/:data', async (req, res) => {
  try {
    const dados = await Contagem.find({ data: req.params.data });
    res.status(200).json(dados);
  } catch (err) {
    console.error('Erro ao buscar contagem por data:', err.message);
    res.status(500).json({ error: 'Erro ao buscar contagem por data.' });
  }
});

// 🏬 Buscar armazéns distintos
app.get('/armazens', async (req, res) => {
  try {
    const armazens = await Contagem.distinct('armazem');
    res.status(200).json(armazens.sort());
  } catch (err) {
    console.error('Erro ao buscar armazéns:', err.message);
    res.status(500).json({ error: 'Erro ao buscar armazéns.' });
  }
});
app.get('/contagem', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.armazem) filtro.armazem = req.query.armazem;
    const dados = await Contagem.find(filtro).sort({ data: -1 });
    res.status(200).json(dados);
  } catch (err) {
    console.error('Erro ao buscar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao buscar contagem.' });
  }
});
app.delete('/contagem/:data', async (req, res) => {
  try {
    const resultado = await Contagem.deleteMany({ data: req.params.data });
    res.status(200).json({ message: `Contagens de ${req.params.data} apagadas.` });
  } catch (err) {
    console.error('Erro ao apagar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao apagar contagem.' });
  }
});


// 🚀 Inicialização do servidor
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;


