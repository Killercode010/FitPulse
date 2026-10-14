const pool = require('../config/db');
const { buildWhereClause } = require('./queryBuilder');

const CLASS_COLUMNS = `id, name, schedule, price, description, category,
    maximum_limit AS maximumLimit, instructor_id AS instructorId`;

const CLASS_FILTERS = { date: 'DATE(schedule)' };

const ClassDao = {
    async findAll(filters = {}) {
        const { clause, params } = buildWhereClause(filters, CLASS_FILTERS);
        const [rows] = await pool.query(
            `SELECT ${CLASS_COLUMNS} FROM \`class\` ${clause} ORDER BY schedule`,
            params
        );
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT ${CLASS_COLUMNS} FROM \`class\` WHERE id = ?`, [id]);
        return rows[0];
    },

    async create({ name, schedule, price, description, category, maximumLimit, instructorId }) {
        const [result] = await pool.query(
            `INSERT INTO \`class\` (name, schedule, price, description, category, maximum_limit, instructor_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, schedule, price, description ?? null, category, maximumLimit, instructorId]
        );
        return result.insertId;
    },

    async update(id, { name, schedule, price, description, category, maximumLimit, instructorId }) {
        await pool.query(
            `UPDATE \`class\` SET name = ?, schedule = ?, price = ?, description = ?, category = ?,
             maximum_limit = ?, instructor_id = ? WHERE id = ?`,
            [name, schedule, price, description ?? null, category, maximumLimit, instructorId, id]
        );
    },

    async remove(id) {
        await pool.query('DELETE FROM `class` WHERE id = ?', [id]);
    }
};

module.exports = ClassDao;
