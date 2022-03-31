const express = require('express');
const router = express.Router();
const ChefController = require('../app/controllers/ChefControllers');


// router.get('/getOrder', ChefController.getOrder);
// router.post('/addOrder', ChefController.addOrder);

router.get('/deleteOrder', ChefController.deleteOrder);
router.get('/ConfirmOrder', ChefController.ConfirmOrder);
router.get('/homeChef', ChefController.homeChef);

module.exports = router;
