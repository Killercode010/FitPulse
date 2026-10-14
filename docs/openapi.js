const { CLASS_CATEGORIES, MIN_RATING, MAX_RATING } = require('../config/constants');

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const jsonContent = (schema) => ({ 'application/json': { schema } });
const arrayOf = (name) => ({ type: 'array', items: ref(name) });

const integer = (example) => ({ type: 'integer', example });
const text = (example) => ({ type: 'string', example });
const decimal = (example) => ({ type: 'number', example });
const dateTime = (example) => ({ type: 'string', format: 'date-time', example });

const objectOf = (properties, required = []) => ({ type: 'object', properties, required });

const STATUS_BY_ERROR = {
    BadRequest: '400',
    Unauthorized: '401',
    NotFound: '404',
    Conflict: '409',
    ServerError: '500'
};

const failures = (...names) => Object.fromEntries(
    [...names, 'ServerError'].map((name) => [STATUS_BY_ERROR[name], { $ref: `#/components/responses/${name}` }])
);

const idParameter = {
    name: 'id',
    in: 'path',
    required: true,
    description: 'Identificador numérico del recurso',
    schema: { type: 'integer', minimum: 1 },
    example: 1
};

const queryParameter = (name, description, schema) => ({ name, in: 'query', required: false, description, schema });

const success = (status, description, schema) => ({
    [status]: schema ? { description, content: jsonContent(schema) } : { description }
});

const operation = ({ tag, summary, parameters, body, responses, errors }) => ({
    tags: [tag],
    summary,
    ...(parameters && { parameters }),
    ...(body && { requestBody: { required: true, content: jsonContent(ref(body)) } }),
    responses: { ...responses, ...failures(...errors) }
});

const withId = [idParameter];

const errorResponse = (description, example) => ({
    description,
    content: jsonContent({
        allOf: [ref('Error')],
        example
    })
});

const components = {
    schemas: {
        Error: objectOf({
            error: text('Mensaje descriptivo del error'),
            details: { type: 'array', items: { type: 'string' }, description: 'Lista de errores de validación, si aplica' }
        }, ['error']),
        User: objectOf({
            id: integer(1),
            name: text('Laura Gómez'),
            email: text('laura@correo.com'),
            createdAt: dateTime('2026-10-12T10:30:00.000Z'),
            role: { type: 'string', enum: ['admin', 'client'], example: 'client' }
        }),
        UserInput: objectOf({
            name: text('Laura Gómez'),
            email: text('laura@correo.com'),
            password: text('clave123')
        }, ['name', 'email', 'password']),
        SessionInput: objectOf({
            email: text('laura@correo.com'),
            password: text('clave123')
        }, ['email', 'password']),
        UserStatistics: objectOf({
            userId: integer(1),
            totalClasses: integer(5),
            classesByCategory: {
                type: 'array',
                items: objectOf({ category: text('spinning'), total: integer(3) })
            }
        }),
        Instructor: objectOf({ id: integer(1), name: text('José Bernal Moreno'), specialty: text('spinning') }),
        InstructorInput: objectOf({ name: text('José Bernal Moreno'), specialty: text('spinning') }, ['name']),
        Class: objectOf({
            id: integer(1),
            name: text('Spinning'),
            schedule: dateTime('2026-09-01T07:00:00.000Z'),
            price: decimal(65000),
            description: text('Clase de alta energía al ritmo de la música'),
            category: { type: 'string', enum: CLASS_CATEGORIES, example: 'spinning' },
            maximumLimit: integer(15),
            instructorId: integer(1)
        }),
        ClassInput: objectOf({
            name: text('Spinning'),
            schedule: text('2026-09-01T07:00:00'),
            price: decimal(65000),
            description: text('Clase de alta energía al ritmo de la música'),
            category: { type: 'string', enum: CLASS_CATEGORIES, example: 'spinning' },
            maximumLimit: integer(15),
            instructorId: integer(1)
        }, ['name', 'schedule', 'price', 'category', 'maximumLimit', 'instructorId']),
        Review: objectOf({
            id: integer(1),
            rating: { type: 'integer', minimum: MIN_RATING, maximum: MAX_RATING, example: 5 },
            tags: text('motivadora,recomendada'),
            comment: text('Excelente clase'),
            createdAt: dateTime('2026-10-12T10:30:00.000Z'),
            classId: integer(1),
            userId: integer(1)
        }),
        ReviewInput: objectOf({
            rating: { type: 'integer', minimum: MIN_RATING, maximum: MAX_RATING, example: 5 },
            tags: text('motivadora,recomendada'),
            comment: text('Excelente clase'),
            classId: integer(1),
            userId: integer(1)
        }, ['rating', 'classId', 'userId']),
        ReviewUpdate: objectOf({
            rating: { type: 'integer', minimum: MIN_RATING, maximum: MAX_RATING, example: 4 },
            tags: text('motivadora'),
            comment: text('Muy buena clase')
        }, ['rating']),
        Purchase: objectOf({
            id: integer(1),
            packageName: text('Paquete 10 clases'),
            amountPaid: decimal(250000),
            purchasedAt: dateTime('2026-10-12T10:30:00.000Z'),
            userId: integer(1)
        }),
        PurchaseInput: objectOf({
            packageName: text('Paquete 10 clases'),
            amountPaid: decimal(250000),
            userId: integer(1)
        }, ['packageName', 'amountPaid', 'userId']),
        SalesSummary: objectOf({
            date: text('2026-10-12'),
            totalSales: integer(3),
            totalRevenue: decimal(550000),
            packages: {
                type: 'array',
                items: objectOf({ packageName: text('Paquete 10 clases'), totalSales: integer(2), revenue: decimal(500000) })
            }
        }),
        PersonalBest: objectOf({
            id: integer(1),
            exercise: text('Press de banca'),
            value: decimal(80),
            unit: text('kg'),
            recordedAt: dateTime('2026-10-12T10:30:00.000Z'),
            userId: integer(1)
        }),
        PersonalBestInput: objectOf({
            exercise: text('Press de banca'),
            value: decimal(80),
            unit: text('kg'),
            userId: integer(1)
        }, ['exercise', 'value', 'unit', 'userId']),
        PersonalBestUpdate: objectOf({
            exercise: text('Press de banca'),
            value: decimal(85),
            unit: text('kg')
        }, ['exercise', 'value', 'unit'])
    },
    responses: {
        BadRequest: errorResponse(
            'Datos de entrada inválidos o referencia a un recurso inexistente',
            { error: 'Datos de entrada inválidos', details: ['El campo name es obligatorio'] }
        ),
        Unauthorized: errorResponse('Credenciales inválidas', { error: 'Credenciales inválidas' }),
        NotFound: errorResponse('El recurso solicitado no existe', { error: 'Recurso no encontrado' }),
        Conflict: errorResponse('El recurso ya existe o está referenciado por otros registros', {
            error: 'El correo electrónico ya está registrado'
        }),
        ServerError: errorResponse('Error interno del servidor', { error: 'Error interno del servidor' })
    }
};

const DEFAULT_ERRORS = {
    create: ['BadRequest'],
    update: ['BadRequest', 'NotFound'],
    remove: ['BadRequest', 'NotFound']
};

const crudPaths = ({ path, tag, singular, schema, input, updateInput, listQuery = [], hasUpdate = true, errors = {} }) => ({
    [path]: {
        get: operation({
            tag,
            summary: `Listar ${tag.toLowerCase()}`,
            parameters: listQuery,
            responses: success('200', `Listado de ${tag.toLowerCase()}`, arrayOf(schema)),
            errors: listQuery.length > 0 ? ['BadRequest'] : []
        }),
        post: operation({
            tag,
            summary: `Crear ${singular}`,
            body: input,
            responses: success('201', `${singular} creado`, ref(schema)),
            errors: errors.create || DEFAULT_ERRORS.create
        })
    },
    [`${path}/{id}`]: {
        get: operation({
            tag,
            summary: `Consultar ${singular} por identificador`,
            parameters: withId,
            responses: success('200', `${singular} encontrado`, ref(schema)),
            errors: ['BadRequest', 'NotFound']
        }),
        ...(hasUpdate && {
            put: operation({
                tag,
                summary: `Reemplazar ${singular}`,
                parameters: withId,
                body: updateInput || input,
                responses: success('200', `${singular} actualizado`, ref(schema)),
                errors: errors.update || DEFAULT_ERRORS.update
            }),
            delete: operation({
                tag,
                summary: `Eliminar ${singular}`,
                parameters: withId,
                responses: success('204', `${singular} eliminado`),
                errors: errors.remove || DEFAULT_ERRORS.remove
            })
        })
    }
});

const userIdFilter = queryParameter('userId', 'Filtra por identificador de usuario', { type: 'integer', minimum: 1 });

const paths = {
    '/api/sessions': {
        post: operation({
            tag: 'Sesiones',
            summary: 'Iniciar sesión verificando las credenciales',
            body: 'SessionInput',
            responses: success('200', 'Credenciales válidas; devuelve el usuario sin contraseña', ref('User')),
            errors: ['BadRequest', 'Unauthorized']
        })
    },
    ...crudPaths({
        path: '/api/users',
        tag: 'Usuarios',
        singular: 'usuario',
        schema: 'User',
        input: 'UserInput',
        errors: {
            create: ['BadRequest', 'Conflict'],
            update: ['BadRequest', 'NotFound', 'Conflict'],
            remove: ['BadRequest', 'NotFound', 'Conflict']
        }
    }),
    '/api/users/{id}/statistics': {
        get: operation({
            tag: 'Usuarios',
            summary: 'Consultar clases tomadas por el usuario, total y por categoría',
            parameters: withId,
            responses: success('200', 'Estadísticas acumuladas del usuario', ref('UserStatistics')),
            errors: ['BadRequest', 'NotFound']
        })
    },
    ...crudPaths({
        path: '/api/instructors',
        tag: 'Instructores',
        singular: 'instructor',
        schema: 'Instructor',
        input: 'InstructorInput',
        errors: { remove: ['BadRequest', 'NotFound', 'Conflict'] }
    }),
    ...crudPaths({
        path: '/api/classes',
        tag: 'Clases',
        singular: 'clase',
        schema: 'Class',
        input: 'ClassInput',
        listQuery: [queryParameter('date', 'Filtra las clases de un día con formato YYYY-MM-DD', { type: 'string', format: 'date' })]
    }),
    '/api/classes/{id}/reviews': {
        get: operation({
            tag: 'Clases',
            summary: 'Listar las reseñas de una clase',
            parameters: withId,
            responses: success('200', 'Reseñas de la clase', arrayOf('Review')),
            errors: ['BadRequest', 'NotFound']
        })
    },
    ...crudPaths({
        path: '/api/reviews',
        tag: 'Reseñas',
        singular: 'reseña',
        schema: 'Review',
        input: 'ReviewInput',
        updateInput: 'ReviewUpdate',
        errors: { create: ['BadRequest', 'NotFound', 'Conflict'] },
        listQuery: [
            queryParameter('classId', 'Filtra por clase', { type: 'integer', minimum: 1 }),
            userIdFilter
        ]
    }),
    ...crudPaths({
        path: '/api/purchases',
        tag: 'Compras',
        singular: 'compra',
        schema: 'Purchase',
        input: 'PurchaseInput',
        listQuery: [userIdFilter],
        hasUpdate: false
    }),
    '/api/purchases/summary': {
        get: operation({
            tag: 'Compras',
            summary: 'Consultar las ventas de un día agrupadas por paquete',
            parameters: [queryParameter('date', 'Día a consultar (YYYY-MM-DD); por defecto, el día actual', { type: 'string', format: 'date' })],
            responses: success('200', 'Resumen de ventas del día', ref('SalesSummary')),
            errors: ['BadRequest']
        })
    },
    ...crudPaths({
        path: '/api/personal-bests',
        tag: 'Marcas personales',
        singular: 'marca personal',
        schema: 'PersonalBest',
        input: 'PersonalBestInput',
        updateInput: 'PersonalBestUpdate',
        listQuery: [userIdFilter]
    })
};

module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'API REST de FitPulse',
        version: '1.0.0',
        description: 'Backend de la plataforma de gimnasio FitPulse. La contraseña se almacena en texto plano en este corte.'
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: ['Sesiones', 'Usuarios', 'Instructores', 'Clases', 'Reseñas', 'Compras', 'Marcas personales'].map((name) => ({ name })),
    paths,
    components
};
