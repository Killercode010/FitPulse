const pool = require('../config/db');
const { buildWhereClause } = require('./queryBuilder');

const PERSONAL_BEST_COLUMNS = `id, exercise, value, unit, recorded_at AS recordedAt, user_id AS userId`;

const PERSONAL_BEST_FILTERS = { userId: 'user_id' };

const PersonalBestDao = {
    async findAll(filters = {}) {
        const { clause, params } = buildWhereClause(filters, PERSONAL_BEST_FILTERS);
        const [rows] = await pool.query(
            `SELECT ${PERSONAL_BEST_COLUMNS} FROM personal_best ${clause} ORDER BY recorded_at DESC`,
            params
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(
            `SELECT ${PERSONAL_BEST_COLUMNS} FROM personal_best WHERE id = ?`,
            [id]
        );
        return rows[0];
    },

    async create({ exercise, value, unit, userId }) {
        const [result] = await pool.query(
            'INSERT INTO personal_best (exercise, value, unit, user_id) VALUES (?, ?, ?, ?)',
            [exercise, value, unit, userId]
        );
        return result.insertId;
    },

    async update(id, { exercise, value, unit }) {
        await pool.query(
            'UPDATE personal_best SET exercise = ?, value = ?, unit = ? WHERE id = ?',
            [exercise, value, unit, id]
        );
    },

    async remove(id) {
        await pool.query('DELETE FROM personal_best WHERE id = ?', [id]);
    }
};

module.exports = PersonalBestDao;
