import express from 'express'
import authRoutes from './routes/authRoutes.js';
import fichaRoutes from './routes/fichaRoutes.js';
import alarmeRoutes from './routes/alarmeRoutes.js';

const app = express();
app.use(express.json());

//rotas

app.use('/auth', authRoutes);
app.use('/ficha', fichaRoutes);
app.use('/alarmes', alarmeRoutes);

export default app;