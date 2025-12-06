const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers.authorization || "";

    // Corrige startsWith
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Token ausente!" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Coloca os dados do usuário no req
        req.usuario = {
            sub: payload.sub,
            id: payload.sub,
            email: payload.email,
            nome: payload.nome || payload.name,  
            role: payload.role || "cliente"
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

module.exports = auth;
