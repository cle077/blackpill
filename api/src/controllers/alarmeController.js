import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// POST /alertas
export const criarAlarme = async (req, res) => {
  const { lembretes, calend_trata } = req.body;
  const id_user = req.user.id;

  if (!lembretes || !calend_trata)
    return res.status(400).json({ message: 'Preencha todos os campos.' });

  try {
    const [ficha] = await db.query(
      'SELECT id_ficha_med FROM ficha_med WHERE id_user = ?',
      [id_user]
    );

    if (!ficha[0])
      return res.status(400).json({ message: 'Crie uma ficha médica antes de adicionar alertas.' });

    const id_sistem_med = uuidv4();

    await db.query(
      `INSERT INTO sistem_alert
        (id_sistem_med, lembretes, calend_trata, fk_usuario_id_user, fk_ficha_med_id_user, fk_ficha_med_id_ficha_med)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_sistem_med,
        lembretes,
        calend_trata,
        id_user,
        id_user,
        ficha[0].id_ficha_med,
      ]
    );

    res.status(201).json({
      message: 'Alerta criado com sucesso.',
      alerta: { id_sistem_med, lembretes, calend_trata },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// GET/alarmes
export const getAlarmes = async (req, res) => {
  const id_user = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT id_sistem_med, lembretes, calend_trata
       FROM sistem_alert
       WHERE fk_usuario_id_user = ?
       ORDER BY calend_trata ASC`,
      [id_user]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// GET /alarmes/hoje
export const getAlarmesHoje = async (req, res) => {
  const id_user = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT id_sistem_med, lembretes, calend_trata
       FROM sistem_alert
       WHERE fk_usuario_id_user = ?
         AND DATE(calend_trata) = CURDATE()
       ORDER BY calend_trata ASC`,
      [id_user]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// PUT /alarmes/:id
export const atualizarAlarme = async (req, res) => {
  const { lembretes, calend_trata } = req.body;
  const { id } = req.params;
  const id_user = req.user.id;

  if (!lembretes && !calend_trata)
    return res.status(400).json({ message: 'Envie ao menos um campo para atualizar.' });

  try {
    const campos = [];
    const valores = [];

    if (lembretes)    { campos.push('lembretes = ?');    valores.push(lembretes); }
    if (calend_trata) { campos.push('calend_trata = ?'); valores.push(calend_trata); }

    // garante que o usuário só edita os próprios alertas
    valores.push(id, id_user);

    const [result] = await db.query(
      `UPDATE sistem_alert
       SET ${campos.join(', ')}
       WHERE id_sistem_med = ? AND fk_usuario_id_user = ?`,
      valores
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Alerta não encontrado.' });

    res.json({ message: 'Alerta atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// DELETE /alertas/:id
export const deletarAlarme = async (req, res) => {
  const { id } = req.params;
  const id_user = req.user.id;

  try {
    const [result] = await db.query(
      `DELETE FROM sistem_alert
       WHERE id_sistem_med = ? AND fk_usuario_id_user = ?`,
      [id, id_user]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Alerta não encontrado.' });

    res.json({ message: 'Alerta removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};