const AppError = require('../errors/AppError');

const MYSQL_ERRORS = {
    ER_DUP_ENTRY: { status: 409, message: 'Ya existe un registro con esos datos' },
    ER_NO_REFERENCED_ROW_2: { status: 400, message: 'Uno de los recursos referenciados no existe' },
    ER_ROW_IS_REFERENCED_2: { status: 409, message: 'El recurso está referenciado por otros registros y no puede eliminarse' }
};

function notFound(req, res) {
    res.status(404).json({ error: 'Ruta no encontrada' });
}

function errorHandler(err, req, res, next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido' });
    }
    const mysqlError = MYSQL_ERRORS[err.code];
    if (mysqlError) {
        return res.status(mysqlError.status).json({ error: mysqlError.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
