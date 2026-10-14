const InstructorDao = require('../dao/instructorDao');
const createCrudService = require('./createCrudService');

module.exports = createCrudService(InstructorDao, 'Instructor no encontrado');
