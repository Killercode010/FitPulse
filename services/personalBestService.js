const PersonalBestDao = require('../dao/personalBestDao');
const createCrudService = require('./createCrudService');

module.exports = createCrudService(PersonalBestDao, 'Marca personal no encontrada');
