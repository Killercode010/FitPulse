const UserService = require('../services/userService');

module.exports = {
    async create(req, res) {
        const { email, password } = req.body;
        res.status(200).json(await UserService.login(email, password));
    }
};
