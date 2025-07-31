const express = require('express');
const router = express.Router();
const {
  addStorage,
  getAllStorage,
    getStorageById,
    updateStorage,
    deleteStorage
} = require('../controllers/storageController');

router.post('/add', addStorage);
router.get('/all', getAllStorage);

router.get('/:id', getStorageById);              // for Edit
router.put('/update/:id', updateStorage);        // for Edit
router.delete('/:id', deleteStorage);            // for Delete


module.exports = router;
