import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 

dotenv.config();
const app = express();

app.use(express.json());

// Suas rotas
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});