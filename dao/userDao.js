const pool = require('../config/db');

const USER_COLUMNS = 'id, name, email, created_at AS createdAt';

const UserDao = {
    async findAll() {
        const [rows] = await pool.query(`SELECT ${USER_COLUMNS} FROM \`user\` ORDER BY id`);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`SELECT ${USER_COLUMNS} FROM \`user\` WHERE id = ?`, [id]);
        return rows[0];
    },

    async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT id, name, email, password, created_at AS createdAt FROM `user` WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async create({ name, email, password }) {
        const [result] = await pool.query(
            'INSERT INTO `user` (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return result.insertId;
    },

    async update(id, { name, email, password }) {
        await pool.query(
            'UPDATE `user` SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, password, id]
        );
    },

    async remove(id) {
        await pool.query('DELETE FROM `user` WHERE id = ?', [id]);
    }
};

module.exports = UserDao;
