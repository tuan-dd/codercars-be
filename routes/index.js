const express = require('express');
const router = express.Router();
const { sendResponse, AppError } = require('../helpers/utils.js');
/* GET home page. */
router.get('/', async function (req, res, next) {
   //  console.log('run');
   const { test } = req.params;
   try {
      //turn on to test error handling
      if (test === 'error') {
         throw new AppError(401, 'Access denied', 'Authentication Error');
      } else {
         sendResponse(res, 200, true, null, null, 'Successful');
      }
   } catch (err) {
      next(err);
   }
});

const carRouter = require('./cars.api.js');

router.use('/car', carRouter);

module.exports = router;
