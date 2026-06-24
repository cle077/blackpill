import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// POST /tratamentos
export const criarTratamento = async (req, res) => {
    const id_user = req.user.id;
    const { nome_tratamento, data_inicio, data_fim, remedios, horarios } = req.body;

    if (!data_inicio || !remedios || !horarios || remedios.length === 0 || horarios.length === 0) {
        return res.status(400).json({ message: 'Informações obrigatórias ausentes (data_inicio, remédios ou horários).' });
    }

    const conexao = await db.getConnection();

    try {
        await conexao.beginTransaction();

        const id_tratamento = uuidv4();
        await conexao.query(
            `INSERT INTO tratamento (id_tratamento, fk_usuario_id_user, nome_tratamento, data_inicio, data_fim, status_ativo)
             VALUES (?, ?, ?, ?, ?, TRUE)`,
            [id_tratamento, id_user, nome_tratamento || 'Meu Tratamento', data_inicio, data_fim || null]
        );

        for (const remedio of remedios) {
            if (!remedio.cd_remedio || !remedio.dose) {
                throw new Error('Dados de remédio inválidos (falta cd_remedio ou dose).');
            }
            await conexao.query(
                `INSERT INTO tratamento_remedio (fk_tratamento_id, fk_remedio_cd_remedio, dose)
                 VALUES (?, ?, ?)`,
                [id_tratamento, remedio.cd_remedio, remedio.dose]
            );
        }

        for (const hora of horarios) {
            const id_horario = uuidv4();
            await conexao.query(
                `INSERT INTO horario_tratamento (id_horario, fk_id_tratamento, horario)
                 VALUES (?, ?, ?)`,
                [id_horario, id_tratamento, hora]
            );
        }

        await conexao.commit();

        res.status(201).json({
            message: 'Tratamento completo cadastrado com sucesso!',
            id_tratamento
        });

    } catch (err) {
        await conexao.rollback();
        console.error("ERRO CRÍTICO NA TRANSAÇÃO DE TRATAMENTO:", err);
        res.status(500).json({ message: 'Erro interno ao salvar tratamento. Alterações desfeitas.' });
    } finally {
        conexao.release();
    }
};

// GET /tratamentos
export const listarTratamentos = async (req, res) => {
    const id_user = req.user.id;

    try {
        const [tratamentos] = await db.query(
            `SELECT id_tratamento, nome_tratamento, data_inicio, data_fim, status_ativo 
             FROM tratamento WHERE fk_usuario_id_user = ?`,
            [id_user]
        );

        if (tratamentos.length === 0) {
            return res.json([]);
        }

        const resultadoFinal = [];

        for (const t of tratamentos) {
            const [remedios] = await db.query(
                `SELECT r.cd_remedio, r.nome, tr.dose 
                 FROM tratamento_remedio tr
                 JOIN remedio r ON tr.fk_remedio_cd_remedio = r.cd_remedio
                 WHERE tr.fk_tratamento_id = ?`,
                [t.id_tratamento]
            );

            const [horarios] = await db.query(
                `SELECT id_horario, horario FROM horario_tratamento WHERE fk_id_tratamento = ?`,
                [t.id_tratamento]
            );

            resultadoFinal.push({
                ...t,
                remedios,
                horarios: horarios.map(h => h.horario)
            });
        }

        res.json(resultadoFinal);

    } catch (err) {
        console.error("ERRO AO LISTAR TRATAMENTOS:", err);
        res.status(500).json({ message: 'Erro interno ao buscar tratamentos.' });
    }
};