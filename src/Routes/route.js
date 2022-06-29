const express = require('express');
const router = express.Router();

const collegeControllerr = require('../Controllers/collegeController');
const internControllerr = require('../Controllers/InternController');

router.post('/functionup/colleges', collegeControllerr.createCollege)

router.post('/functionup/interns', internControllerr.createIntern)

router.get('/functionup/collegeDetails', collegeControllerr.getCollegeDetails);






module.exports = router;