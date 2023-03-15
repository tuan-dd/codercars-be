const yup = require('yup');
const { Size, Vehicles, TransmissionType } = require('../models/Car');

const getCarsSchema = yup.object().shape({
   Make: yup.string().notRequired(),
   Model: yup.string().notRequired(),
   Size: yup.string().oneOf(Size).notRequired(),
   TransmissionType: yup.string().oneOf(TransmissionType).notRequired(),
   Vehicles: yup.string().oneOf(Vehicles).notRequired(),
   price: yup.number().notRequired(),
   currency: yup.string().oneOf(['USD', 'EUR', 'BTC', 'JPY']).notRequired(),
   Year: yup.number().min(1900).max(new Date().getFullYear()).notRequired(),
   page: yup.number().min(1).integer('the number is integer').notRequired(),
   limit: yup
      .number()
      .min(1)
      .max(30)
      .integer('the number is integer')
      .notRequired(),
});

const createCarSchema = yup.object().shape({
   _id: yup.string().max(0, 'not have Id'),
   Make: yup.string().required(),
   Model: yup.string().required(),
   Size: yup.string().oneOf(Size).required(),
   TransmissionType: yup.string().oneOf(TransmissionType).required(),
   Vehicles: yup.string().oneOf(Vehicles).required(),
   price: yup.number().required(),
   currency: yup.string().oneOf(['USD', 'EUR', 'BTC', 'JPY']).required(),
   Year: yup.number().min(1900).max(new Date().getFullYear()).required(),
});

const updateCarsSchema = yup.object().shape({
   _id: yup.string().max(0, 'not have Id'),
   Make: yup.string().max(0, 'not change make'),
});
//  Model: yup.string().max(0).required('not change name'),
module.exports = { updateCarsSchema, createCarSchema, getCarsSchema };
