const PurchaseDao = require('../dao/purchaseDao');
const createCrudService = require('./createCrudService');

const { getAll, getById, create } = createCrudService(PurchaseDao, 'Compra no encontrada');

const roundCurrency = (amount) => Number(amount.toFixed(2));

async function getDailySummary({ date }) {
    const summaryDate = date || new Date().toLocaleDateString('en-CA');
    const packages = await PurchaseDao.summarizeByDate(summaryDate);
    return {
        date: summaryDate,
        totalSales: packages.reduce((total, item) => total + item.totalSales, 0),
        totalRevenue: roundCurrency(packages.reduce((total, item) => total + item.revenue, 0)),
        packages
    };
}

module.exports = { getAll, getById, create, getDailySummary };
