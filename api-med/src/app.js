import express from 'express'
import remedioRoutes from './routes/remedioRoutes.js';

const app = express();
app.use(express.json());

//rotas
app.use('/remedios', remedioRoutes);


export default app;