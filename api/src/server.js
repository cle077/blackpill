import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

if (!process.env.PORT) {
  console.log("Erro: porta não definida, tente executar 'node src/server.js'");
  process.exit(1);
}

app.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta", process.env.PORT);
});
    
