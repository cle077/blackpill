const API_URL = 'http://localhost:3000/avisos';

async function carregarAvisos() {
    try {
        const res = await fetch(API_URL);
        const avisos = await res.json();

        const lista = document.getElementById('avisos-list');
        lista.innerHTML = '';

        if (avisos.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color:#6e7089;">Nenhum aviso no momento.</p>';
            return;
        }

        avisos.forEach(aviso => {
            const div = document.createElement('div');
            div.className = `aviso ${aviso.tipo}`;
            div.innerHTML = `
                <div class="titulo">${aviso.titulo}</div>
                <p>${aviso.mensagem}</p>
                <div class="data">${new Date(aviso.data).toLocaleString('pt-BR')}</div>
            `;
            lista.appendChild(div);
        });
    } catch (e) {
        document.getElementById('avisos-list').innerHTML = 
            '<p style="color:#f38ba8; text-align:center;">⚠️ Erro ao conectar com a API</p>';
    }
}

// Atualiza automaticamente a cada 8 segundos
setInterval(carregarAvisos, 8000);
window.onload = carregarAvisos;