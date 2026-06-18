import { Router } from "express";
import {criarAlarme, getAlarmes, getAlarmesHoje, atualizarAlarme, deletarAlarme,} from '../controllers/alarmeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', criarAlarme);
router.get('/', getAlarmes);
router.get('/hoje', getAlarmesHoje);
router.put('/:id', atualizarAlarme);
router.delete('/:id', deletarAlarme);

export default router;


