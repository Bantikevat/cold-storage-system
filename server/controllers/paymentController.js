// MultipleFiles/controllers/paymentController.js
const Payment = require('../models/Payment'); // Adjust path
const Farmer = require('../models/Farmer'); // Adjust path

// Add a new payment
exports.addPayment = async (req, res) => {
  try {
    const { farmerId, amount, date, remarks } = req.body;

    if (!farmerId || !amount) {
      return res.status(400).json({ message: 'Farmer ID and Amount are required.' });
    }

    const farmerExists = await Farmer.findById(farmerId);
    if (!farmerExists) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }

    const newPayment = new Payment({
      farmerId,
      amount,
      date: date || Date.now(), // Use provided date or current date
      remarks,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment added successfully!', payment: newPayment });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Server error while adding payment.' });
  }
};

// Get all payments (optional, for a general payment list)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('farmerId', 'name phone'); // Populate farmer details
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments.' });
  }
};

// Get payments for a specific farmer (will be used by FarmerLedger)
exports.getPaymentsByFarmerId = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const payments = await Payment.find({ farmerId }).sort({ date: 1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments for farmer:', error);
    res.status(500).json({ message: 'Server error while fetching payments for farmer.' });
  }
};

// Delete a payment (optional)
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }
    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Server error while deleting payment.' });
  }
};
