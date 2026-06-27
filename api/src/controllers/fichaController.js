import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// POST /ficha
export const criarFicha = async (req, res) => {
    try {
        const { altura, peso, sexo, data_nascimento } = req.body;
        const id_user = req.user.id;

        if (!altura || !peso || !sexo || !data_nascimento) {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
        }

        if (altura <= 0 || altura > 3.00 || peso <= 0 || peso > 500) {
            return res.status(400).json({ message: 'Por favor, insira valores válidos para peso e altura.' });
        }

        if (!['M', 'F', 'O'].includes(sexo.toUpperCase())) {
            return res.status(400).json({ message: 'Sexo inválido. Use M, F ou O.' });
        }

        const [existe] = await db.query(
            'SELECT id_ficha_med FROM ficha_med WHERE id_user = ?',
            [id_user]
        );
        if (existe.length > 0) {
            return res.status(409).json({ message: 'Ficha médica já cadastrada para este usuário. Use PUT para atualizar.' });
        }

        const id_ficha_med = uuidv4();

        await db.query(
            `INSERT INTO ficha_med (id_ficha_med, id_user, altura, peso, sexo, data_nascimento)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_ficha_med, id_user, altura, peso, sexo.toUpperCase(), data_nascimento]
        );

        res.status(201).json({
            message: 'Ficha médica criada com sucesso.',
            ficha: { id_ficha_med, altura, peso, sexo: sexo.toUpperCase(), data_nascimento }
        });

    } catch (err) {
        console.error("ERRO AO CRIAR FICHA MÉDICA:", err);
        res.status(500).json({ message: 'Erro interno ao criar ficha médica.' });
    }
};

// GET /ficha
export const buscarFicha = async (req, res) => {
    try {
        const id_user = req.user.id;

        const [rows] = await db.query(
            'SELECT id_ficha_med, altura, peso, sexo, data_nascimento FROM ficha_med WHERE id_user = ?',
            [id_user]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ficha médica não encontrada.' });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error("ERRO AO BUSCAR FICHA MÉDICA:", err);
        res.status(500).json({ message: 'Erro interno ao buscar ficha médica.' });
    }
};

// PUT /ficha
export const atualizarFicha = async (req, res) => {
    try {
        const { altura, peso, sexo, data_nascimento } = req.body;
        const id_user = req.user.id;

        if (!altura && !peso && !sexo && !data_nascimento) {
            return res.status(400).json({ message: 'Envie ao menos um campo para atualizar.' });
        }

        if (sexo && !['M', 'F', 'O'].includes(sexo.toUpperCase())) {
            return res.status(400).json({ message: 'Sexo inválido. Use M, F ou O.' });
        }

        if ((altura && (altura <= 0 || altura > 3.00)) || (peso && (peso <= 0 || peso > 500))) {
            return res.status(400).json({ message: 'Valores de peso ou altura inválidos.' });
        }

        const campos = [];
        const valores = [];

        if (altura)          { campos.push('altura = ?');          valores.push(altura); }
        if (peso)            { campos.push('peso = ?');            valores.push(peso); }
        if (sexo)            { campos.push('sexo = ?');            valores.push(sexo.toUpperCase()); }
        if (data_nascimento) { campos.push('data_nascimento = ?'); valores.push(data_nascimento); }

        valores.push(id_user);

        const [result] = await db.query(
            `UPDATE ficha_med SET ${campos.join(', ')} WHERE id_user = ?`,
            valores
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ficha médica não encontrada.' });
        }

        res.json({ message: 'Ficha médica atualizada com sucesso.' });

    } catch (err) {
        console.error("ERRO AO ATUALIZAR FICHA MÉDICA:", err);
        res.status(500).json({ message: 'Erro interno ao atualizar ficha médica.' });
    }
};

// DELETE /ficha
export const deletarFicha = async (req, res) => {
    try {
        const id_user = req.user.id;

        const [result] = await db.query(
            'DELETE FROM ficha_med WHERE id_user = ?',
            [id_user]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ficha médica não encontrada.' });
        }

        res.json({ message: 'Ficha médica removida com sucesso.' });

    } catch (err) {
        console.error("ERRO AO DELETAR FICHA MÉDICA:", err);
        res.status(500).json({ message: 'Erro interno ao deletar ficha médica.' });
    }
};