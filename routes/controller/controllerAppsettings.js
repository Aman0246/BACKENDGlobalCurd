
const express = require('express');
const router = express.Router();
const globalCrudController = require('./globalCrudController');
const { AppSetting } = require('../../db');
router.post('/create', globalCrudController.create(AppSetting));
router.post('/getById', globalCrudController.getById(AppSetting));
router.post('/update', globalCrudController.update(AppSetting));
router.post('/harddelete', globalCrudController.hardDelete(AppSetting));
router.post('/softDelete', globalCrudController.softDelete(AppSetting));
router.post('/getList', globalCrudController.getList(AppSetting));

module.exports = router;
