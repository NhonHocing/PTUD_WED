const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const bookRoutes = require('./bookRoutes');
const publisherRoutes = require('./publisherRoutes');
const borrowRequestRoutes = require('./borrowRequestRoutes');
const borrowSlipRoutes = require('./borrowSlipRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/publishers', publisherRoutes);
router.use('/borrow-requests', borrowRequestRoutes);
router.use('/borrow-slips', borrowSlipRoutes);
router.use('/users', userRoutes);

module.exports = router;

