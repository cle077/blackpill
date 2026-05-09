import { verify } from'../services/jwtService.js'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];

  try {
    req.user = verify(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authMiddleware;