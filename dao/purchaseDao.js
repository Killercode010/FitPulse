const pool = require('../config/db');
const { buildWhereClause } = require('./queryBuilder');

const PURCHASE_COLUMNS = `id, package_name AS packageName, amount_paid AS amountPaid,
    purchased_at AS purchasedAt, user_id AS userId`;

const PURCHASE_FILTERS = { userId: 'user_id' };

const PurchaseDao = {
    async findAll(filters = {}) {
        const { clause, params } = buildWhereClause(filters, PURCHASE_FILTERS);
        const [rows] = await pool.query(
            `SELECT ${PURCHASE_COLUMNS} FROM purchase ${clause} ORDER BY purchased_at DESC`,
            params
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT ${PURCHASE_COLUMNS} FROM purchase WHERE id = ?`, [id]);
        return rows[0];
    },

    async summarizeByDate(date) {
        const [rows] = await pool.query(
            `SELECT package_name AS packageName, COUNT(*) AS totalSales, SUM(amount_paid) AS revenue
             FROM purchase
             WHERE DATE(purchased_at) = ?
             GROUP BY package_name
             ORDER BY package_name`,
            [date]
        );
        return rows;
    },

    async create({ packageName, amountPaid, userId }) {
        const [result] = await pool.query(
            'INSERT INTO purchase (package_name, amount_paid, user_id) VALUES (?, ?, ?)',
            [packageName, amountPaid, userId]
        );
        return result.insertId;
    }
};

module.exports = PurchaseDao;
