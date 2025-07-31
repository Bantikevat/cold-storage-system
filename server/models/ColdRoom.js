// models/ColdRoom.js
const mongoose = require('mongoose');

const ColdRoomSchema = new mongoose.Schema({
  roomNumber: String,
  capacity: Number,
  isOccupied: Boolean
});

module.exports = mongoose.model('ColdRoom', ColdRoomSchema);
