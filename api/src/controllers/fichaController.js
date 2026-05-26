import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const criarFicha = async (req, res) => {
  const { altura, peso, sexo, data_nascimento } = req.body;
  const id_user = req.user.id;

  if (!altura || !peso || !sexo || !data_nascimento)
    return res.status(400).json({ message: 'Preencha todos os campos.' });

  if (!['M', 'F', 'O'].includes(sexo.toUpperCase()))
    return res.status(400).json({ message: 'Sexo inválido. Use M, F ou O.' });

  try {
    const [existe] = await db.query(
      'SELECT id_ficha_med FROM ficha_med WHERE id_user = ?',
      [id_user]
    );
    if (existe.length > 0)
      return res.status(409).json({ message: 'Ficha médica já cadastrada. Use PUT para atualizar.' });

    const id_ficha_med = uuidv4();

    await db.query(
      `INSERT INTO ficha_med (id_ficha_med, id_user, altura, peso, sexo, idade)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_ficha_med, id_user, altura, peso, sexo.toUpperCase(), data_nascimento]
    );

    await db.query(
      `UPDATE usuario
       SET fk_ficha_med_id_user = ?, fk_ficha_med_id_ficha_med = ?
       WHERE id_user = ?`,
      [id_user, id_ficha_med, id_user]
    );

    res.status(201).json({
      message: 'Ficha médica criada com sucesso.',
      ficha: { id_ficha_med, altura, peso, sexo: sexo.toUpperCase(), data_nascimento },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

export const buscarFicha = async (req, res) => {
  const id_user = req.user.id;
  try {
    const [rows] = await db.query(
      'SELECT id_ficha_med, altura, peso, sexo, idade AS data_nascimento FROM ficha_med WHERE id_user = ?',
      [id_user]
    );
    if (!rows[0])
      return res.status(404).json({ message: 'Ficha médica não encontrada.' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

export const atualizarFicha = async (req, res) => {
  const { altura, peso, sexo, data_nascimento } = req.body;
  const id_user = req.user.id;

  if (!altura && !peso && !sexo && !data_nascimento)
    return res.status(400).json({ message: 'Envie ao menos um campo para atualizar.' });

  if (sexo && !['M', 'F', 'O'].includes(sexo.toUpperCase()))
    return res.status(400).json({ message: 'Sexo inválido. Use M, F ou O.' });

  try {
    const campos = [];
    const valores = [];

    if (altura)          { campos.push('altura = ?');  valores.push(altura); }
    if (peso)            { campos.push('peso = ?');    valores.push(peso); }
    if (sexo)            { campos.push('sexo = ?');    valores.push(sexo.toUpperCase()); }
    if (data_nascimento) { campos.push('idade = ?');   valores.push(data_nascimento); }

    valores.push(id_user);

    const [result] = await db.query(
      `UPDATE ficha_med SET ${campos.join(', ')} WHERE id_user = ?`,
      valores
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Ficha médica não encontrada.' });

    res.json({ message: 'Ficha médica atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

export const deletarFicha = async (req, res) => {
  const id_user = req.user.id;
  try {
    const [result] = await db.query(
      'DELETE FROM ficha_med WHERE id_user = ?',
      [id_user]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Ficha médica não encontrada.' });

    res.json({ message: 'Ficha médica removida com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};