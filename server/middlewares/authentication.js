const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
	const token = req.get('token');
	jwt.verify(token, process.env.SEED, (err, decode) => {
		if(err){
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			})
		}
		req.usuario = decode.usuario;
		next();
	})
}

const checkRoleAdmin = (req, res, next) => {
	const usuario = req.usuario;
	if(usuario.role !== 'ADMIN_ROLE'){
		return res.status(401).json({
			ok: false,
			err: {
				message: 'No tiene privilegios de administrador'
			}
		})
	}
	next();
}

const verificarTokenUrl = (req, res, next) => {
	const {qwxIDpM124rte007BVYUIswrew323NHhju90T} = req.query; 
	jwt.verify(qwxIDpM124rte007BVYUIswrew323NHhju90T, process.env.SEED, (err, decode) => {
		if(err){
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no válido'
				}
			})
		}
		next();
	})
}

module.exports = {
	verificarToken,
	checkRoleAdmin,
	verificarTokenUrl
}