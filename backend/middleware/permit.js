module.exports = function permit(...rolesPermitidos) {
    return (req, res, next) => {
        try {
            const usuario = req.usuario;

            if (!usuario) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            const role = usuario.role || "cliente";

            if (!rolesPermitidos.includes(role)) {
                return res.status(403).json({
                    error: "Acesso negado.",
                    roleRequerida: rolesPermitidos,
                    roleUsuario: role
                });
            }

            next();
        } catch (err) {
            return res.status(500).json({ error: "Erro no middleware de permissão." });
        }
    };
};
