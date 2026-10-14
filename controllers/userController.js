const UserService = require('../services/userService');
const createCrudController = require('./createCrudController');

module.exports = {
    ...createCrudController(UserService),

    async getStatistics(req, res) {
        res.json(await UserService.getStatistics(req.params.id));
    }
};
