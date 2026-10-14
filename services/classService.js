const ClassDao = require('../dao/classDao');
const ReviewDao = require('../dao/reviewDao');
const findOrFail = require('../utils/findOrFail');
const createCrudService = require('./createCrudService');

const NOT_FOUND_MESSAGE = 'Clase no encontrada';
const crudService = createCrudService(ClassDao, NOT_FOUND_MESSAGE);

module.exports = {
    ...crudService,

    async getReviews(id) {
        await findOrFail(ClassDao, id, NOT_FOUND_MESSAGE);
        return ReviewDao.findAll({ classId: id });
    }
};
