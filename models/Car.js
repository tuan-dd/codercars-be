const mongoose = require('mongoose');
const TransmissionType = [
   'MANUAL',
   'AUTOMATIC',
   'AUTOMATED_MANUAL',
   'DIRECT_DRIVE',
   'UNKNOWN',
];
const Vehicles = [
   '2dr Hatchback',
   '2dr SUV',
   '4dr Hatchback',
   '4dr SUV',
   'Cargo Minivan',
   'Cargo Van',
   'Convertible',
   'Convertible SUV',
   'Coupe',
   'Crew Cab Pickup',
   'Extended Cab Pickup',
   'Passenger Minivan',
   'Passenger Van',
   'Regular Cab Pickup',
   'Sedan',
   'Wagon',
];

const Size = ['Compact', 'Midsize', 'Large'];
const carSchema = new mongoose.Schema(
   {
      Model: { type: String, required: true },
      Make: { type: String, required: true },
      Year: { type: Number, min: 1900, required: true },
      'Transmission Type': {
         type: String,
         enum: TransmissionType,
         required: true,
      },
      Size: {
         type: String,
         enum: Size,
         required: true,
      },
      Vehicles: { type: String, enum: Vehicles, required: true },
      'Engine Fuel Type': { type: String },
      'Market Category': { type: String, maxLength: 50 },
      Driven_Wheels: { type: String },
      'Engine Cylinders': { type: Number },
      'Engine HP': { type: Number },
      Price: {
         price: { type: Number, required: true },
         currency: { type: String, required: true },
      },
      'Number of Doors': { type: Number },
      'highway MPG': { type: Number },
      'city mpg': { type: Number },
      Popularity: { type: Number },
      isDelete: { type: Boolean, default: false, required: true },
   },
   {
      timestamps: true,
   },
);

carSchema.statics.checKDuplicate = async function (body) {
   const { Model, Make, TransmissionType, Vehicles, Size } = body;
   this.find({ Model, Make });

   const cars = await this.find({ Model, Make });
   if (!cars.length) return false;
   const isDuplicate = cars.some((item) => {
      return (
         item['Transmission Type'] === TransmissionType &&
         item.Vehicles === Vehicles &&
         item.Size === Size
      );
   });

   return isDuplicate;
};

const Car = mongoose.model('cars', carSchema);
module.exports = { Car, Vehicles, Size, TransmissionType };
