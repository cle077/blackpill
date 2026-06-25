import { Router } from 'express';
import { buscarRemedios, getRemedioPorId } from '../controllers/remedioController.js';
import { getBula, getBulaResumo } from '../controllers/bulaController.js';

const router = Router();

router.get('/', buscarRemedios);
router.get('/:id', getRemedioPorId);
router.get('/:id/bula', getBula);
router.get('/:id/bula/resumo', getBulaResumo);

export default router;