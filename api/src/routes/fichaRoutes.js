import { Router } from 'express';
import { criarFicha, buscarFicha, atualizarFicha, deletarFicha } from '../controllers/fichaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', criarFicha);
router.get('/', buscarFicha);
router.put('/', atualizarFicha);
router.delete('/', deletarFicha);

export default router;