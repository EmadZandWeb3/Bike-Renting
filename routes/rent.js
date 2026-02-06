var express = require('express');
var router = express.Router();
var { bikes, rentals } = require('./data');

function generateDeliveryCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/', (req, res) => {
  const { nationalCode } = req.body;

  if (!nationalCode) {
    return res.status(400).json({ message: 'National Code is required' });
  }

  const active = rentals.find(r => r.nationalCode === nationalCode);
  if (active) {
    return res.status(400).json({ message: 'This National Code has an active rental' });
  }

  const bike = bikes.find(b => b.available);
  if (!bike) {
    return res.status(400).json({ message: 'No bikes available!' });
  }

  bike.available = false;

  const deliveryCode = generateDeliveryCode();

  rentals.push({
    nationalCode,
    bikeId: bike.id,
    deliveryCode,
    startTime: new Date()
  });

  res.json({
    message: 'Bike rented successfully',
    bikeId: bike.id,
    deliveryCode
  });
});

module.exports = router;
