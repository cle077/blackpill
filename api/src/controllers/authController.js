import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';

export const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const [existingUsers] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Este e-mail já está cadastrado." });
        }

        const id_user = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(senha, salt);

        const insertQuery = 'INSERT INTO usuario (id_user, nome, email, senha) VALUES (?, ?, ?, ?)';
        await db.query(insertQuery, [id_user, nome, email, passwordHash]);

        const token = jwt.sign(
            { id: id_user }, 
            process.env.JWT_SECRET || 'chave_segura_provisoria', 
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            token,
            user: { id: id_user, nome, email }
        });

    } catch (error) {
        console.error("ERRO NO CADASTRO:", error);
        return res.status(500).json({ 
            error: "Erro interno no servidor.", 
            detalhes: error.message 
        });
    }
};