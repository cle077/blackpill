import db from '../config/database.js';
import { hash, compare } from '../services/hashService.js';
import { sign } from '../services/jwtService.js';


// POST /auth/register
export const register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ message: 'Preencha todos os campos.' });

  try {
    const [rows] = await db.query('SELECT id_user FROM usuario WHERE email = ?', [email]);
    if (rows.length > 0)
      return res.status(409).json({ message: 'E-mail já cadastrado.' });

    const hashed = await hash(senha);
    await db.query('INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', [
      nome, email, hashed,
    ]);

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};


// POST /auth/login
export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ message: 'Preencha todos os campos.' });

  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await compare(senha, user.senha)))
      return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = sign({ id: user.id_user, email: user.email });

    res.json({ token, user: { id: user.id_user, name: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// GET /auth/me  (protegida)
export const me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_user, nome, email, criado_em FROM usuario WHERE id_user = ?',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};
