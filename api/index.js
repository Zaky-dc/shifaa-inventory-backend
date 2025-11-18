require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Importa rotas simulando Vercel
app.use('/api/contagem', require('./contagem'));
app.use('/api/datas', require('./datas'));
app.use('/api/armazens', require('./armazens'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Servidor local rodando na porta ${PORT}`);
});
