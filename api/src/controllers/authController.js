import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.js';
import { hash, compare } from '../services/hashService.js';
import { sign } from '../services/jwtService.js';

// POST /auth/register
export const register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Preencha todos os campos: nome, email e senha.' });
        }

        const senhaRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!senhaRegex.test(senha)) {
            return res.status(400).json({ 
                message: "A senha deve ter pelo menos 8 caracteres, incluir um número e um caractere especial." 
            });
        }

        const [existing] = await db.query('SELECT id_user FROM usuario WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }

        const id_user = uuidv4();
        const passwordHash = await hash(senha);

        await db.query(
            'INSERT INTO usuario (id_user, nome, email, senha) VALUES (?, ?, ?, ?)', 
            [id_user, nome, email, passwordHash]
        );

        res.status(201).json({ 
            message: 'Usuário criado com sucesso.',
            user: { id: id_user, nome, email }
        });

    } catch (err) {
        console.error("ERRO NO REGISTRO:", err);
        res.status(500).json({ message: 'Erro interno no servidor ao realizar cadastro.' });
    }
};

// POST /auth/login
export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await compare(senha, user.senha))) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

        const token = sign({ id: user.id_user, email: user.emai });

        res.json({ 
            token, 
            user: { id: user.id_user, nome: user.nome, email: user.email } 
        });

    } catch (err) {
        console.error("ERRO NO LOGIN:", err);
        res.status(500).json({ message: 'Erro interno no servidor ao realizar login.' });
    }
};

// GET /auth/me
export const me = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id_user, nome, email FROM usuario WHERE id_user = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("ERRO NO ME:", err);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// POST/auth/logout

export const logout = async(req,res) => {
    try{
        res.status(200).json({
            message:"logout realizado com sucessor"
        });
    }
    catch (err){
        res.status(500).json({
            message:"erro interno"
        });
    }
};