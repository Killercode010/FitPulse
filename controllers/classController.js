const ClassService = require('../services/classService');
const createCrudController = require('./createCrudController');

module.exports = {
    ...createCrudController(ClassService),

    async getReviews(req, res) {
        res.json(await ClassService.getReviews(req.params.id));
    }
};
