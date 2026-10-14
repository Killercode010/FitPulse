const PurchaseService = require('../services/purchaseService');
const createCrudController = require('./createCrudController');

const { getAll, getById, create } = createCrudController(PurchaseService);

module.exports = {
    getAll,
    getById,
    create,

    async getDailySummary(req, res) {
        res.json(await PurchaseService.getDailySummary(req.query));
    }
};
