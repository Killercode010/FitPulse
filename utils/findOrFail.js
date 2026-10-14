const AppError = require('../errors/AppError');

async function findOrFail(dao, id, notFoundMessage) {
    const record = await dao.findById(id);
    if (!record) {
        throw new AppError(404, notFoundMessage);
    }
    return record;
}

module.exports = findOrFail;
