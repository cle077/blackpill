import { verify } from '../services/jwtService.js';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token);
        
        req.user = decoded; 
        
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;