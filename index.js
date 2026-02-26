import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import contagemHandler from './api/contagem.js';
import datasHandler from './api/datas.js';
import armazensHandler from './api/armazens.js';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Importa rotas simulando Vercel
app.use('/api/contagem', contagemHandler);
app.use('/api/datas', datasHandler);
app.use('/api/armazens', armazensHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor local rodando na porta ${PORT}`);
});
