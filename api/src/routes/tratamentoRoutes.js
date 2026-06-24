import express from 'express';
import { criarTratamento, listarTratamentos } from '../controllers/tratamentoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarTratamento);
router.get('/', authMiddleware, listarTratamentos);

export default router;