const express = require('express');
const router = express.Router();
const ShipperController = require('../app/controllers/ShipperController');



// router.post('/changeQuantityWarehouse', ShipperController.changeQuantityWarehouse);
// router.get('/getOneWarehouse', ShipperController.getOneWarehouse);
router.post('/editBookShip', ShipperController.editBookShip);
router.get('/getBookShipEdit', ShipperController.getBookShipEdit);
router.get('/deleteBookShip', ShipperController.deleteBookShip);
router.get('/confirmBookShip', ShipperController.confirmBookShip);
router.get('/getBookShip', ShipperController.getBookShip);
router.get('/homeShipper', ShipperController.homeShipper);

module.exports = router;
