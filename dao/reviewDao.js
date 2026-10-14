const pool = require('../config/db');
const { buildWhereClause } = require('./queryBuilder');

const REVIEW_COLUMNS = `id, rating, tags, comment, created_at AS createdAt,
    class_id AS classId, user_id AS userId`;

const REVIEW_FILTERS = { classId: 'class_id', userId: 'user_id' };

const ReviewDao = {
    async findAll(filters = {}) {
        const { clause, params } = buildWhereClause(filters, REVIEW_FILTERS);
        const [rows] = await pool.query(
            `SELECT ${REVIEW_COLUMNS} FROM review ${clause} ORDER BY created_at DESC`,
            params
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT ${REVIEW_COLUMNS} FROM review WHERE id = ?`, [id]);
        return rows[0];
    },

    async findByUserAndClass(userId, classId) {
        const [rows] = await pool.query(
            `SELECT ${REVIEW_COLUMNS} FROM review WHERE user_id = ? AND class_id = ?`,
            [userId, classId]
        );
        return rows[0];
    },

    async countByCategoryForUser(userId) {
        const [rows] = await pool.query(
            `SELECT c.category AS category, COUNT(*) AS total
             FROM review r
             JOIN \`class\` c ON c.id = r.class_id
             WHERE r.user_id = ?
             GROUP BY c.category
             ORDER BY c.category`,
            [userId]
        );
        return rows;
    },

    async create({ rating, tags, comment, classId, userId }) {
        const [result] = await pool.query(
            'INSERT INTO review (rating, tags, comment, class_id, user_id) VALUES (?, ?, ?, ?, ?)',
            [rating, tags ?? null, comment ?? null, classId, userId]
        );
        return result.insertId;
    },

    async update(id, { rating, tags, comment }) {
        await pool.query(
            'UPDATE review SET rating = ?, tags = ?, comment = ? WHERE id = ?',
            [rating, tags ?? null, comment ?? null, id]
        );
    },

    async remove(id) {
        await pool.query('DELETE FROM review WHERE id = ?', [id]);
    }
};

module.exports = ReviewDao;
