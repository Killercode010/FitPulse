const express = require('express');

const sessionRoutes = require('./sessionRoutes');
const userRoutes = require('./userRoutes');
const instructorRoutes = require('./instructorRoutes');
const classRoutes = require('./classRoutes');
const reviewRoutes = require('./reviewRoutes');
const purchaseRoutes = require('./purchaseRoutes');
const personalBestRoutes = require('./personalBestRoutes');

const router = express.Router();

router.use('/sessions', sessionRoutes);
router.use('/users', userRoutes);
router.use('/instructors', instructorRoutes);
router.use('/classes', classRoutes);
router.use('/reviews', reviewRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/personal-bests', personalBestRoutes);

module.exports = router;
