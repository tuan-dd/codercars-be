const { sendResponse, AppError } = require('../helpers/utils.js');

const { Car } = require('../models/Car.js');
const carController = {};

const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);

carController.createCar = async (req, res, next) => {
   const body = req.body;
   try {
      const isDuplicate = await Car.checKDuplicate(body);
      if (isDuplicate) throw new AppError(409, 'Duplicate', 'Had a car');
      let newCar = {
         Price: { price: body.price, currency: body.currency },
         'Transmission Type': body.TransmissionType,
      };
      const removeKey = ['price', 'currency', 'TransmissionType'];
      removeKey.forEach((item) => delete body[item]);

      newCar = { ...newCar, ...body };
      console.log(newCar);
      if (!newCar) throw new AppError(402, 'Bad Request', 'Create car Error');

      const created = await Car.create(newCar);
      sendResponse(
         res,
         200,
         true,
         { data: created },
         null,
         'Create Car Success',
      );
   } catch (err) {
      next(err);
   }
};
carController.getAllCars = async (req, res, next) => {
   const query = req.query;
   let { page, limit, Model, currency, Year, price } = query;
   price = parseFloat(price);
   Year = parseFloat(Year);
   limit = limit || 10;
   page = page || 1;
   const filter = {
      Make: query.Make,
      Size: query.size,
      'Transmission Type': query.TransmissionType,
      Vehicles: query.Vehicles,
   };
   try {
      Object.keys(filter).forEach((key) => {
         if (!filter[key]) delete filter[key];
      });
      if (Model) {
         let regExp = new RegExp(Model, 'i');
         filter.Model = regExp;
      }
      if (price) {
         filter['Price.price'] = { $lte: price };
      }
      if (currency) {
         filter['Price.currency'] = { $eq: currency };
      }
      if (Year) {
         filter.Year = { $lte: Year };
      }

      filter.isDelete = false;
      console.log(filter);
      const listOfFound = await Car.find(filter, { isDelete: 0 })
         .limit(limit)
         .skip((page - 1) * limit);
      count = await Car.count(filter);

      if (!listOfFound?.length) {
         throw new AppError(402, 'Bad Request', 'Not found car Error');
      }

      sendResponse(
         res,
         200,
         true,
         { cars: listOfFound, count },
         null,
         'Found list of car success',
      );
   } catch (err) {
      next(err);
   }
};

carController.updateCarById = async (req, res, next) => {
   const targetId = req.params.id;
   const body = req.body;

   const options = { new: true };
   try {
      const removeKey = ['price', 'currency', 'TransmissionType'];
      let UpdateCar = { isDelete: false };

      removeKey.forEach((key) => {
         if (body[key]) {
            if (key === 'price' || key === 'currency') {
               key === 'price'
                  ? (UpdateCar = { ...UpdateCar, 'Price.price': body.price })
                  : (UpdateCar = {
                       ...UpdateCar,
                       'Price.currency': body.currency,
                    });
            } else {
               UpdateCar['Transmission Type'] = body[key];
            }
         }
         delete body[key];
      });

      UpdateCar = { ...UpdateCar, ...body };
      // console.log('check', UpdateCar);
      const updated = await Car.findByIdAndUpdate(targetId, UpdateCar, options);

      sendResponse(
         res,
         200,
         true,
         { data: updated },
         null,
         'Update car success',
      );
   } catch (err) {
      err.message = 'not found car';
      next(err);
   }
};

carController.deleteCarById = async (req, res, next) => {
   const targetId = req.params.id;
   const options = { new: true };
   try {
      //mongoose query
      const deleteCar = await Car.findByIdAndUpdate(
         targetId,
         { isDelete: true },
         options,
      );
      console.log(deleteCar);
      sendResponse(res, 200, true, { data: 'oke' }, null, 'Delete car success');
   } catch (err) {
      err.message = 'not found car or car is delete';
      next(err);
   }
};

module.exports = carController;
