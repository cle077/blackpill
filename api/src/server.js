import express from 'express';
import cors from 'cors'; 
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import authRoutes from './routes/authRoutes.js';
import fichaRoutes from './routes/fichaRoutes.js';
import tratamentoRoutes from './routes/tratamentoRoutes.js';
import remedioRoutes from './routes/remedioRoutes.js';
import lembreteRoutes from './routes/lembreteRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/ficha', fichaRoutes);
app.use('/api/tratamentos', tratamentoRoutes);
app.use('/api/remedios', remedioRoutes);
app.use('/api/lembretes', lembreteRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});