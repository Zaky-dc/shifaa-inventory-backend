const { resolve } = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const ContagemSchema = new mongoose.Schema({
  nome: String,
  lote: String,
  esperado: Number,
  real: Number,
  data: String,
});

const Contagem = mongoose.model('Contagem', ContagemSchema);

app.post('/contagem', async (req, res) => {
  try {
    await Contagem.insertMany(req.body);
    res.status(200).json({ message: 'Contagem salva com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar contagem.' });
  }
});

app.get('/contagem', async (req, res) => {
  try {
    const dados = await Contagem.find().sort({ data: -1 });
    res.status(200).json(dados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar contagem.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


