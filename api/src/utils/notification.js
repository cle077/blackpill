import axios from 'axios';

export const enviarNotificacao = async (tokenDoCelular, titulo, mensagem) => {
    if (!tokenDoCelular) return;

    try {
        await axios.post('https://exp.host/--/api/v2/push/send', {
            to: tokenDoCelular,
            sound: 'default',
            title: titulo,
            body: mensagem
        });
        console.log("Notificação enviada com sucesso!");
    } catch (error) {
        console.error("Erro ao mandar a ordem para a Expo:", error.message);
    }
};