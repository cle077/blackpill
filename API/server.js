const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Banco de dados
const dbPath = path.join(__dirname, 'avisos.db');
const db = new sqlite3.Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS avisos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT DEFAULT 'info',
    data TEXT
)`);

// Listar avisos
app.get('/avisos', (req, res) => {
    db.all("SELECT * FROM avisos ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Criar aviso
app.post('/avisos', (req, res) => {
    const { titulo, mensagem, tipo = 'info' } = req.body;
    const data = new Date().toISOString();

    db.run(
        "INSERT INTO avisos (titulo, mensagem, tipo, data) VALUES (?, ?, ?, ?)",
        [titulo, mensagem, tipo, data],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ 
                id: this.lastID, 
                titulo, 
                mensagem, 
                tipo, 
                data 
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 API EOS Avisos rodando em http://localhost:${PORT}`);
});