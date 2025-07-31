const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboard.getSummary);
router.get('/chart', dashboard.getChart);
router.get('/activity', dashboard.getActivity);
router.get('/cold-rooms', dashboard.getColdRooms);
router.get('/dashboard', dashboardController.getDashboardData);
router.get('/', dashboardController.getDashboardData);



module.exports = router;
