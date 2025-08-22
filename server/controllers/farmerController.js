// MultipleFiles/controllers/farmerController.js
const Farmer = require('../models/Farmer'); // Adjust path

const Purchase = require('../models/Purchase'); // Adjust path - ASSUMPTION: You have a Purchase model


// Add a new farmer (existing code)
exports.addFarmer = async (req, res) => {
  try {
    const { name, phone, address, aadhaar, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone are required fields.' });
    }

    const query = { $or: [{ phone }] };
    if (aadhaar) query.$or.push({ aadhaar });
    if (email) query.$or.push({ email });

    const existingFarmer = await Farmer.findOne(query);

    if (existingFarmer) {
      if (existingFarmer.phone === phone) {
        return res.status(409).json({ message: 'Farmer with this phone number already exists.' });
      }
      if (aadhaar && existingFarmer.aadhaar === aadhaar) {
        return res.status(409).json({ message: 'Farmer with this Aadhaar number already exists.' });
      }
      if (email && existingFarmer.email === email) {
        return res.status(409).json({ message: 'Farmer with this email already exists.' });
      }
    }

    const newFarmer = new Farmer({
      name,
      phone,
      address,
      aadhaar,
      email,
    });

    await newFarmer.save();
    res.status(201).json({ message: 'Farmer added successfully!', farmer: newFarmer });
  } catch (error) {
    console.error('Error adding farmer:', error);
    res.status(500).json({ message: 'Server error while adding farmer.' });
  }
};

// Get all farmers with pagination, sorting, and searching (existing code)
exports.getAllFarmers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const search = req.query.search || '';

    const skip = (page - 1) * limit;

    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { aadhaar: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const farmers = await Farmer.find(searchQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalFarmers = await Farmer.countDocuments(searchQuery);

    res.status(200).json({
      farmers,
      totalFarmers,
      currentPage: page,
      totalPages: Math.ceil(totalFarmers / limit),
    });
  } catch (error) {
    console.error('Error fetching farmers:', error);
    res.status(500).json({ message: 'Server error while fetching farmers.' });
  }
};

// Get a single farmer by ID (existing code)
exports.getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }
    res.status(200).json(farmer);
  } catch (error) {
    console.error('Error fetching farmer by ID:', error);
    res.status(500).json({ message: 'Server error while fetching farmer.' });
  }
};

// Update a farmer by ID (existing code)
exports.updateFarmer = async (req, res) => {
  try {
    const { name, phone, address, aadhaar, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone are required fields.' });
    }

    const existingFarmer = await Farmer.findOne({
      _id: { $ne: req.params.id },
      $or: [{ phone }, { aadhaar }, { email }]
    });

    if (existingFarmer) {
      if (existingFarmer.phone === phone) {
        return res.status(409).json({ message: 'Farmer with this phone number already exists.' });
      }
      if (aadhaar && existingFarmer.aadhaar === aadhaar) {
        return res.status(409).json({ message: 'Farmer with this Aadhaar number already exists.' });
      }
      if (email && existingFarmer.email === email) {
        return res.status(409).json({ message: 'Farmer with this email already exists.' });
      }
    }

    const updatedFarmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, aadhaar, email, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedFarmer) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }

    res.status(200).json({ message: 'Farmer updated successfully!', farmer: updatedFarmer });
  } catch (error) {
    console.error('Error updating farmer:', error);
    res.status(500).json({ message: 'Server error while updating farmer.' });
  }
};

// Delete a farmer by ID (existing code)
exports.deleteFarmer = async (req, res) => {
  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);

    if (!deletedFarmer) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }

    res.status(200).json({ message: 'Farmer deleted successfully!' });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    res.status(500).json({ message: 'Server error while deleting farmer.' });
  }
};

// Get Farmer Ledger
exports.getFarmerLedger = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { from, to } = req.query; // Date range filters

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }

    let dateFilter = {};
    if (from) {
      dateFilter.$gte = new Date(from);
    }
    if (to) {
      dateFilter.$lte = new Date(new Date(to).setHours(23, 59, 59, 999)); // End of day
    }

    // Fetch Payments
    const payments = await Payment.find({
      farmerId,
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
    }).sort({ date: 1 });

    // Fetch Purchases (assuming a 'purchaseDate' field)
    const purchases = await Purchase.find({
      farmerId,
      ...(Object.keys(dateFilter).length > 0 && { purchaseDate: dateFilter }),
    }).sort({ purchaseDate: 1 });

    // Fetch Storage Entries (assuming 'storageDate' and 'outDate' fields)
    // This is more complex as storage rent accrues over time.
    // For simplicity, we'll just fetch entries. Actual rent calculation might be done on frontend or a separate service.
    const storageEntries = await Storage.find({
      farmerId,
      $or: [ // Check if storageDate or outDate falls within the range
        ...(Object.keys(dateFilter).length > 0 ? [{ storageDate: dateFilter }] : []),
        ...(Object.keys(dateFilter).length > 0 ? [{ outDate: dateFilter }] : []),
        // If no date filter, include all
        ...(Object.keys(dateFilter).length === 0 ? [{}] : [])
      ]
    }).sort({ storageDate: 1 });

    // Calculate summary
    let totalPaid = 0;
    payments.forEach(p => { totalPaid += p.amount; });

    let totalPurchase = 0;
    purchases.forEach(p => { totalPurchase += p.amount; });

    // Simple storage rent calculation for summary (can be more complex)
    let totalStorageRent = 0;
    storageEntries.forEach(entry => {
      const startDate = new Date(entry.storageDate);
      const endDate = entry.outDate ? new Date(entry.outDate) : new Date(); // If not out, assume current date
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalStorageRent += (entry.quantity || 0) * (entry.rate || 0) * diffDays;
    });

    // Outstanding calculation (simplified: total owed - total paid)
    // You might need a more sophisticated ledger balance calculation based on your business logic
    const outstanding = (totalPurchase + totalStorageRent) - totalPaid;

    res.status(200).json({
      farmer,
      payments,
      purchases,
      storageEntries,
      summary: {
        totalPaid,
        totalPurchase,
        totalStorageRent: parseFloat(totalStorageRent.toFixed(2)), // Format to 2 decimal places
        outstanding: parseFloat(outstanding.toFixed(2)), // Format to 2 decimal places
      },
    });

  } catch (error) {
    console.error('Error fetching farmer ledger:', error);
    res.status(500).json({ message: 'Server error while fetching farmer ledger.' });
  }
};
