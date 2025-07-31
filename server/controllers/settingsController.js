const Settings = require('../routes/settingsRoutes');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne() || new Settings({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { section, data } = req.body;
    
    const updated = await Settings.findOneAndUpdate(
      {},
      { [section]: data },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ 
      error: "Settings update failed",
      details: error.message 
    });
  }
};

// Secure version with admin check
exports.adminUpdate = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
