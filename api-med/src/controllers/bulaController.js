import db from '../config/database.js';

// GET /remedios/:id/bula
export const getBula = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT b.* FROM bula b
       JOIN remedio r ON r.fk_bula_id_bula = b.id_bula
       WHERE r.cd_remedio = ?`,
      [id]
    );

    if (!rows[0])
      return res.status(404).json({ message: 'Bula não encontrada para esse remédio.' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// GET /remedios/:id/bula/resumo
export const getBulaResumo = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT b.* FROM bula b
       JOIN remedio r ON r.fk_bula_id_bula = b.id_bula
       WHERE r.cd_remedio = ?`,
      [id]
    );

    const bula = rows[0];
    if (!bula)
      return res.status(404).json({ message: 'Bula não encontrada para esse remédio.' });

    // já tem resumo salvo? retorna do cache, sem chamar a IA de novo
    if (bula.bula_resumida) {
      return res.json({ resumo: bula.bula_resumida, cache: true });
    }

    res.json({ resumo, cache: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};