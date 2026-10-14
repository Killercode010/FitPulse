const UserDao = require('../dao/userDao');
const ReviewDao = require('../dao/reviewDao');
const AppError = require('../errors/AppError');
const findOrFail = require('../utils/findOrFail');

const NOT_FOUND_MESSAGE = 'Usuario no encontrado';
const ROLES = { ADMIN: 'admin', CLIENT: 'client' };

function resolveRole(email) {
    const adminDomain = process.env.ADMIN_EMAIL_DOMAIN;
    const isAdmin = adminDomain && email.toLowerCase().endsWith(`@${adminDomain.toLowerCase()}`);
    return isAdmin ? ROLES.ADMIN : ROLES.CLIENT;
}

function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: resolveRole(user.email)
    };
}

async function assertEmailAvailable(email, currentUserId) {
    const existingUser = await UserDao.findByEmail(email);
    if (existingUser && existingUser.id !== currentUserId) {
        throw new AppError(409, 'El correo electrónico ya está registrado');
    }
}

const UserService = {
    async getAll() {
        const users = await UserDao.findAll();
        return users.map(toPublicUser);
    },

    async getById(id) {
        return toPublicUser(await findOrFail(UserDao, id, NOT_FOUND_MESSAGE));
    },

    async create(data) {
        await assertEmailAvailable(data.email);
        const id = await UserDao.create(data);
        return toPublicUser(await UserDao.findById(id));
    },

    async update(id, data) {
        await findOrFail(UserDao, id, NOT_FOUND_MESSAGE);
        await assertEmailAvailable(data.email, Number(id));
        await UserDao.update(id, data);
        return toPublicUser(await UserDao.findById(id));
    },

    async remove(id) {
        await findOrFail(UserDao, id, NOT_FOUND_MESSAGE);
        await UserDao.remove(id);
    },

    async login(email, password) {
        const user = await UserDao.findByEmail(email);
        if (!user || user.password !== password) {
            throw new AppError(401, 'Credenciales inválidas');
        }
        return toPublicUser(user);
    },

    async getStatistics(id) {
        await findOrFail(UserDao, id, NOT_FOUND_MESSAGE);
        const classesByCategory = await ReviewDao.countByCategoryForUser(id);
        const totalClasses = classesByCategory.reduce((total, row) => total + row.total, 0);
        return { userId: Number(id), totalClasses, classesByCategory };
    }
};

module.exports = UserService;
