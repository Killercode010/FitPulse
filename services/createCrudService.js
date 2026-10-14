const findOrFail = require('../utils/findOrFail');

function createCrudService(dao, notFoundMessage) {
    return {
        getAll: (filters) => dao.findAll(filters),

        getById: (id) => findOrFail(dao, id, notFoundMessage),

        async create(data) {
            const id = await dao.create(data);
            return dao.findById(id);
        },

        async update(id, data) {
            await findOrFail(dao, id, notFoundMessage);
            await dao.update(id, data);
            return dao.findById(id);
        },

        async remove(id) {
            await findOrFail(dao, id, notFoundMessage);
            await dao.remove(id);
        }
    };
}

module.exports = createCrudService;
