const pool = require('../config/db');

const INSTRUCTOR_COLUMNS = 'id, name, specialty';

const InstructorDao = {
    async findAll() {
        const [rows] = await pool.query(`SELECT ${INSTRUCTOR_COLUMNS} FROM instructor ORDER BY id`);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT ${INSTRUCTOR_COLUMNS} FROM instructor WHERE id = ?`, [id]);
        return rows[0];
    },

    async create({ name, specialty }) {
        const [result] = await pool.query(
            'INSERT INTO instructor (name, specialty) VALUES (?, ?)',
            [name, specialty ?? null]
        );
        return result.insertId;
    },

    async update(id, { name, specialty }) {
        await pool.query(
            'UPDATE instructor SET name = ?, specialty = ? WHERE id = ?',
            [name, specialty ?? null, id]
        );
    },

    async remove(id) {
        await pool.query('DELETE FROM instructor WHERE id = ?', [id]);
    }
};

module.exports = InstructorDao;
