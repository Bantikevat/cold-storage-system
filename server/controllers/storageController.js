const Storage = require('../models/Storage');
const Farmer = require('../models/Farmer');



// Optional: Define capacity for each cold room
const ROOM_CAPACITY = {
  'Room-1': 5000,
  'Room-2': 8000,
  'Room-3': 10000,
};

exports.addStorage = async (req, res) => {
  try {
    const {
      farmerId,
      product,
      quantity,
      remarks,
      room,
      rate,
      outDate
    } = req.body;

    // 🔒 Validation (optional, you can expand)
    if (!farmerId || !product || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const qty = Number(quantity);
    const ratePerKg = Number(rate || 0);

    // ✅ Room Capacity Check
    if (room && ROOM_CAPACITY[room]) {
      const existingStorage = await Storage.find({
        room,
        outDate: { $exists: false } // Only currently stored items
      });

      const currentTotalQty = existingStorage.reduce((sum, entry) => sum + (entry.quantity || 0), 0);

      if ((currentTotalQty + qty) > ROOM_CAPACITY[room]) {
        return res.status(400).json({
          message: `❌ Room capacity exceeded! (Available: ${ROOM_CAPACITY[room] - currentTotalQty} kg)`
        });
      }
    }

    // ✅ Create new entry
    const newEntry = new Storage({
      farmerId,
      product,
      quantity: qty,
      remarks,
      room,
      rate: ratePerKg,
      outDate: outDate || null
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error("Storage Add Error:", err);
    res.status(500).json({ message: "❌ Failed to add storage entry" });
  }
};

exports.getAllStorage = async (req, res) => {
  try {
    const entries = await Storage.find().populate('farmerId');
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ message: "Failed to get storage entries" });
  }
};

exports.getStorageById = async (req, res) => {
  try {
    const entry = await Storage.findById(req.params.id);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch storage entry" });
  }
};

exports.updateStorage = async (req, res) => {
  try {
    const updated = await Storage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update storage" });
  }
};

exports.deleteStorage = async (req, res) => {
  try {
    await Storage.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

