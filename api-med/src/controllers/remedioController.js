import db from '../config/database.js';

// GET /remedios?q=termo&page=1&limit=20
export const buscarRemedios = async (req, res) => {
  const { q = '', page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const termo = `%${q}%`;

    const [rows] = await db.query(
      `SELECT cd_remedio, nome, marca, fabricante, concentracao, tarja
       FROM remedio
       WHERE nome LIKE ? OR marca LIKE ? OR dcb LIKE ?
       LIMIT ? OFFSET ?`,
      [termo, termo, termo, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM remedio
       WHERE nome LIKE ? OR marca LIKE ? OR dcb LIKE ?`,
      [termo, termo, termo]
    );

    res.json({
      data: rows,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};

// GET /remedios/:id
export const getRemedioPorId = async (req, res) => {
  const { id } = req.params;
  const { include } = req.query;

  try {
    const [rows] = await db.query(
      'SELECT * FROM remedio WHERE cd_remedio = ?',
      [id]
    );

    if (!rows[0])
      return res.status(404).json({ message: 'Remédio não encontrado.' });

    const remedio = rows[0];

    if (include === 'bula' && remedio.fk_bula_id_bula) {
      const [bula] = await db.query(
        'SELECT * FROM bula WHERE id_bula = ?',
        [remedio.fk_bula_id_bula]
      );
      remedio.bula = bula[0] || null;
    }

    res.json(remedio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno.' });
  }
};