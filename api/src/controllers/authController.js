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

        const token = sign({ id: id_user });

        res.status(201).json({ 
            message: 'Usuário criado com sucesso.',
            token,
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

        const token = sign({ id: user.id_user, email: user.email });

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

// PUT /auth/update
export const updateProfile = async (req, res) => {
    try {
        const id_user = req.user.id;
        const { nome, email } = req.body;

        const [currentUser] = await db.query(
            'SELECT nome, email FROM usuario WHERE id_user = ?', 
            [id_user]
        );

        if (currentUser.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const novoNome = nome || currentUser[0].nome;
        const novoEmail = email || currentUser[0].email;

        if (email && email !== currentUser[0].email) {
            const [existing] = await db.query(
                'SELECT id_user FROM usuario WHERE email = ? AND id_user != ?', 
                [email, id_user]
            );
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Este e-mail já está sendo usado por outra conta.' });
            }
        }

        await db.query(
            'UPDATE usuario SET nome = ?, email = ? WHERE id_user = ?',
            [novoNome, novoEmail, id_user]
        );

        res.json({ 
            message: 'Perfil atualizado com sucesso!',
            user: { nome: novoNome, email: novoEmail } 
        });

    } catch (err) {
        console.error("ERRO AO ATUALIZAR PERFIL:", err);
        res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
    }
};

// PUT /auth/update-password
export const updatePassword = async (req, res) => {
    try {
        const id_user = req.user.id;
        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ message: 'Ambas as senhas são obrigatórias.' });
        }

        const [user] = await db.query('SELECT senha FROM usuario WHERE id_user = ?', [id_user]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const senhaValida = await compare(senhaAtual, user[0].senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'A senha atual está incorreta.' });
        }

        const senhaRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!senhaRegex.test(novaSenha)) {
            return res.status(400).json({ 
                message: "A nova senha deve ter pelo menos 8 caracteres, incluir um número e um caractere especial." 
            });
        }

        const novoHash = await hash(novaSenha);
        await db.query('UPDATE usuario SET senha = ? WHERE id_user = ?', [novoHash, id_user]);

        res.json({ message: 'Senha alterada com sucesso!' });

    } catch (err) {
        console.error("ERRO AO ALTERAR SENHA:", err);
        res.status(500).json({ message: 'Erro interno ao alterar senha.' });
    }
};

// POST /auth/logout
export const logout = async (req, res) => {
    try {
        res.json({ message: 'Logout realizado com sucesso. Remova o token do cliente.' });
    } catch (err) {
        console.error("ERRO NO LOGOUT:", err);
        res.status(500).json({ message: 'Erro interno ao realizar logout.' });
    }
};

// DELETE /auth/delete-account
export const deletarConta = async (req, res) => {
    try {
        const id_user = req.user.id;

        const [result] = await db.query('DELETE FROM usuario WHERE id_user = ?', [id_user]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json({ message: 'Sua conta e todos os seus dados foram excluídos permanentemente.' });

    } catch (err) {
        console.error("ERRO AO DELETAR CONTA:", err);
        res.status(500).json({ message: 'Erro interno ao deletar conta.' });
    }
};

// PUT /auth/save-token
export const salvarPushToken = async (req, res) => {
    try {
        const id_user = req.user.id;
        const { push_token } = req.body;

        if (!push_token) {
            return res.status(400).json({ message: 'Push token não fornecido.' });
        }

        await db.query(
            'UPDATE usuario SET push_token = ? WHERE id_user = ?',
            [push_token, id_user]
        );

        res.json({ message: 'Token de notificação salvo com sucesso!' });
    } catch (err) {
        console.error("Erro ao salvar push token:", err);
        res.status(500).json({ message: 'Erro interno ao salvar token.' });
    }
};