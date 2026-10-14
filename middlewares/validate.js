const AppError = require('../errors/AppError');

const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TYPE_VALIDATORS = {
    string: (value) => typeof value === 'string' && value.trim().length > 0,
    integer: (value) => Number.isInteger(value),
    number: (value) => typeof value === 'number' && Number.isFinite(value),
    email: (value) => typeof value === 'string' && EMAIL_PATTERN.test(value),
    datetime: (value) => typeof value === 'string' && DATETIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value)),
    integerString: (value) => /^\d+$/.test(value),
    dateString: (value) => DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))
};

const TYPE_DESCRIPTIONS = {
    string: 'un texto no vacío',
    integer: 'un número entero',
    number: 'un número',
    email: 'un correo electrónico válido',
    datetime: 'una fecha y hora con formato YYYY-MM-DDTHH:mm:ss',
    integerString: 'un número entero positivo',
    dateString: 'una fecha con formato YYYY-MM-DD'
};

function findFieldError(field, rule, value) {
    if (value === undefined || value === null) {
        return rule.required ? `El campo ${field} es obligatorio` : null;
    }
    if (!TYPE_VALIDATORS[rule.type](value)) {
        return `El campo ${field} debe ser ${TYPE_DESCRIPTIONS[rule.type]}`;
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        return `El campo ${field} no puede superar ${rule.maxLength} caracteres`;
    }
    if (rule.min !== undefined && value < rule.min) {
        return `El campo ${field} debe ser mayor o igual a ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
        return `El campo ${field} debe ser menor o igual a ${rule.max}`;
    }
    if (rule.oneOf !== undefined && !rule.oneOf.includes(value)) {
        return `El campo ${field} debe ser uno de: ${rule.oneOf.join(', ')}`;
    }
    return null;
}

function buildValidator(sourceName, rules) {
    return (req, res, next) => {
        const source = req[sourceName] || {};
        const errors = Object.entries(rules)
            .map(([field, rule]) => findFieldError(field, rule, source[field]))
            .filter(Boolean);
        if (errors.length > 0) {
            return next(new AppError(400, 'Datos de entrada inválidos', errors));
        }
        return next();
    };
}

const validateBody = (rules) => buildValidator('body', rules);
const validateQuery = (rules) => buildValidator('query', rules);

function validateId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return next(new AppError(400, 'Datos de entrada inválidos', ['El identificador debe ser un entero positivo']));
    }
    return next();
}

module.exports = { validateBody, validateQuery, validateId };
