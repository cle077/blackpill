import express from 'express';
import { criarTratamento, listarTratamentos, atualizarTratamento, deletarTratamento, atualizarStatusTratamento,} from '../controllers/tratamentoController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', criarTratamento);
router.get('/', listarTratamentos);
router.put('/:id', atualizarTratamento);
router.delete('/:id', deletarTratamento);
router.patch('/:id/status', atualizarStatusTratamento);

export default router;