const { CLASS_CATEGORIES, MIN_RATING, MAX_RATING } = require('../config/constants');

const userRules = {
    name: { type: 'string', required: true, maxLength: 100 },
    email: { type: 'email', required: true, maxLength: 100 },
    password: { type: 'string', required: true, maxLength: 100 }
};

const sessionRules = {
    email: { type: 'email', required: true },
    password: { type: 'string', required: true }
};

const instructorRules = {
    name: { type: 'string', required: true, maxLength: 100 },
    specialty: { type: 'string', maxLength: 45 }
};

const classRules = {
    name: { type: 'string', required: true, maxLength: 100 },
    schedule: { type: 'datetime', required: true },
    price: { type: 'number', required: true, min: 0 },
    description: { type: 'string', maxLength: 500 },
    category: { type: 'string', required: true, oneOf: CLASS_CATEGORIES },
    maximumLimit: { type: 'integer', required: true, min: 1 },
    instructorId: { type: 'integer', required: true, min: 1 }
};

const reviewUpdateRules = {
    rating: { type: 'integer', required: true, min: MIN_RATING, max: MAX_RATING },
    tags: { type: 'string', maxLength: 100 },
    comment: { type: 'string', maxLength: 500 }
};

const reviewRules = {
    ...reviewUpdateRules,
    classId: { type: 'integer', required: true, min: 1 },
    userId: { type: 'integer', required: true, min: 1 }
};

const purchaseRules = {
    packageName: { type: 'string', required: true, maxLength: 100 },
    amountPaid: { type: 'number', required: true, min: 0.01 },
    userId: { type: 'integer', required: true, min: 1 }
};

const personalBestUpdateRules = {
    exercise: { type: 'string', required: true, maxLength: 45 },
    value: { type: 'number', required: true, min: 0.01 },
    unit: { type: 'string', required: true, maxLength: 10 }
};

const personalBestRules = {
    ...personalBestUpdateRules,
    userId: { type: 'integer', required: true, min: 1 }
};

const dateQueryRules = { date: { type: 'dateString' } };

const reviewQueryRules = {
    classId: { type: 'integerString' },
    userId: { type: 'integerString' }
};

const userIdQueryRules = { userId: { type: 'integerString' } };

module.exports = {
    userRules,
    sessionRules,
    instructorRules,
    classRules,
    reviewRules,
    reviewUpdateRules,
    purchaseRules,
    personalBestRules,
    personalBestUpdateRules,
    dateQueryRules,
    reviewQueryRules,
    userIdQueryRules
};
