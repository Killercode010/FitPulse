const ReviewDao = require('../dao/reviewDao');
const ClassDao = require('../dao/classDao');
const UserDao = require('../dao/userDao');
const AppError = require('../errors/AppError');
const findOrFail = require('../utils/findOrFail');
const createCrudService = require('./createCrudService');

const crudService = createCrudService(ReviewDao, 'Reseña no encontrada');

async function assertReviewAllowed({ classId, userId }) {
    const classItem = await findOrFail(ClassDao, classId, 'Clase no encontrada');
    await findOrFail(UserDao, userId, 'Usuario no encontrado');
    if (new Date(classItem.schedule) > new Date()) {
        throw new AppError(400, 'Solo se pueden reseñar clases que ya fueron dictadas');
    }
    if (await ReviewDao.findByUserAndClass(userId, classId)) {
        throw new AppError(409, 'El usuario ya reseñó esta clase');
    }
}

module.exports = {
    ...crudService,

    async create(data) {
        await assertReviewAllowed(data);
        return crudService.create(data);
    }
};
