import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  temperatureThreshold: { type: Number, default: 35 }, // Default value
  weatherCondition: { type: String, default: 'Rain' } // Default value
});

// Prevent OverwriteModelError by checking if the model already exists
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
