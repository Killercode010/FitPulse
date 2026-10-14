const InstructorService = require('../services/instructorService');
const createCrudController = require('./createCrudController');

module.exports = createCrudController(InstructorService);
