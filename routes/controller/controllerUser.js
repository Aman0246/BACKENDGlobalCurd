
const express = require('express');
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { User } = require('../../db');
router.post('/create', globalCrudController.create(User));
router.post('/getById', globalCrudController.getById(User));
router.post('/update', globalCrudController.update(User));
router.post('/harddelete', globalCrudController.hardDelete(User));
router.post('/softDelete', globalCrudController.softDelete(User));
router.post('/getList', globalCrudController.getList(User));

module.exports = router;
