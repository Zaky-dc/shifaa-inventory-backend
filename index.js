require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas'))
  .catch((err) => {
    console.error('🔴 Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Encerra o servidor se não conectar
  });

// Schema e modelo
const ContagemSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  sistema: Number,
  real: Number,
  diferenca: Number,
  data: String,
});


const Contagem = mongoose.model('Contagem', ContagemSchema);

// Rotas
app.post('/contagem', async (req, res) => {
  try {
    await Contagem.insertMany(req.body);
    res.status(200).json({ message: 'Contagem salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao salvar contagem.' });
  }
});

app.get('/contagem', async (req, res) => {
  try {
    const dados = await Contagem.find().sort({ data: -1 });
    res.status(200).json(dados);
  } catch (err) {
    console.error('Erro ao buscar contagem:', err.message);
    res.status(500).json({ error: 'Erro ao buscar contagem.' });
  }
});
const PORT = process.env.PORT || 4000;
// Porta dinâmica para Render
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

server.keepAliveTimeout = 120000; // 120 segundos
server.headersTimeout = 120000;

