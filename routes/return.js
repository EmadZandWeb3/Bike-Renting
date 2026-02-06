var express = require('express');
var router = express.Router();
var { bikes, rentals, pricePerHourse } = require('./data');

router.post('/', (req, res) => {
  const { deliveryCode } = req.body;

  if (!deliveryCode) {
    return res.status(400).json({ message: 'Delivery Code is required' });
  }

  const rentalIndex = rentals.findIndex(
    r => r.deliveryCode === deliveryCode
  );

  if (rentalIndex === -1) {
    return res.status(404).json({ message: 'Invalid Delivery Code!' });
  }

  const rental = rentals[rentalIndex];

  const hours = Math.ceil(
    (Date.now() - rental.startTime) / (1000 * 60 * 60)
  );

  const totalCost = hours * pricePerHourse;

  const bike = bikes.find(b => b.id === rental.bikeId);
  bike.available = true;

  rentals.splice(rentalIndex, 1);

  res.json({
    message: 'The Bike was successfully returned',
    durationHours: hours,
    totalCost
  });
});

module.exports = router;
