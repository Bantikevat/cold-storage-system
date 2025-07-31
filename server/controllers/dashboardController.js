const Stock = require('../models/Stock');
const ColdRoom = require('../models/ColdRoom');
const Storage = require('../models/Storage'); // ADD THIS LINE!


// 👇 1. Dashboard Summary
exports.getSummary = async (req, res) => {
  try {
    const storageData = await Storage.find();
    const coldRooms = await ColdRoom.find();

    const totalBagsStored = storageData
      .filter(item => !item.outDate)
      .reduce((acc, curr) => acc + (curr.quantity || 0), 0);

    const activeCustomers = new Set(storageData.map(i => i.farmerId?.toString())).size;

    const totalSales = storageData
      .filter(i => i.outDate)
      .reduce((acc, item) => {
        const inDate = new Date(item.storageDate);
        const outDate = new Date(item.outDate);
        const days = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
        return acc + ((item.quantity || 0) * (item.rate || 0) * days);
      }, 0);

    res.json({
      totalBagsStored,
      activeCustomers,
      coldRoomsInUse: {
        used: coldRooms.filter(r => r.isOccupied).length,
        total: coldRooms.length
      },
      totalSales
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Dashboard summary fetch error' });
  }
};


// 👇 2. Chart Data
exports.getChart = async (req, res) => {
  const Storage = require('../models/Storage');

  const range = req.query.range || 'week';
  const days = range === 'month' ? 30 : range === 'year' ? 365 : 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const storageData = await Storage.find({ storageDate: { $gte: fromDate } });

  const map = {};

  storageData.forEach((s) => {
    const key = new Date(s.storageDate).toLocaleDateString();
    map[key] = (map[key] || 0) + (s.quantity || 0);
  });

  const labels = Object.keys(map);
  const purchaseSeries = Object.values(map);
  const saleSeries = new Array(labels.length).fill(0); // add real sale data if needed

  res.json({ labels, purchaseSeries, saleSeries });
};


// 👇 3. Recent Activity
exports.getActivity = async (req, res) => {
  res.json([
    { type: "in", who: "Farmer A", item: "Potato", qty: 500, date: new Date() },
    { type: "out", who: "Vendor B", item: "Onion", qty: 300, date: new Date() }
  ]);
};

// 👇 4. Cold Room Occupancy
exports.getColdRooms = async (req, res) => {
  const rooms = await ColdRoom.find();
  const used = rooms.filter(room => room.isOccupied).length;
  res.json({ used, available: rooms.length - used });
};
exports.getDashboardData = async (req, res) => {
  try {
    // Dummy sample data
    res.status(200).json({
      totalCustomers: 10,
      totalSales: 50000,
      totalProducts: 25
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

