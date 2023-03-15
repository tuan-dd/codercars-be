const express = require('express');
const router = express.Router();

const {
   createCar,
   getAllCars,
   updateCarById,
   deleteCarById,
} = require('../controllers/cars.controllers.js');
const validate = require('../middlewares/carMiddleware.js');
const {
   getCarsSchema,
   createCarSchema,
   updateCarsSchema,
} = require('../validations/carValidation.js');

router.get('/', validate(getCarsSchema), getAllCars);
router.post('/', validate(createCarSchema), createCar);
router.put('/:id', validate(updateCarsSchema), updateCarById);
router.delete('/:id', deleteCarById);

module.exports = router;
