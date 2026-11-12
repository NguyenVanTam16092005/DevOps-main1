const mongoose = require('mongoose');
const dns = require('dns');

const configureDns = () => {
  const configuredServers = String(process.env.DNS_SERVERS || '').split(',').map((server) => server.trim()).filter(Boolean);
  const fallbackServers = ['1.1.1.1', '8.8.8.8'];
  const nextServers = configuredServers.length > 0 ? configuredServers : fallbackServers;

  try {
    dns.setServers(nextServers);
    console.log(`DNS servers configured for MongoDB lookup: ${nextServers.join(', ')}`);
  } catch (error) {
    console.warn(`Failed to set custom DNS servers: ${error.message}`);
  }
};

const connectDb = async () => {
  configureDns();

  const configuredUrl = process.env.MONGODB_URL || process.env.MONGO_URL;
  if (!configuredUrl) {
    throw new Error('Missing MongoDB connection string. Set MONGODB_URL or MONGO_URL.');
  }

  try {
    await mongoose.connect(configuredUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connection success.');
    return true;
  } catch (error) {
    const safeMessage = error.message.split(configuredUrl).join('[REDACTED_MONGODB_URI]');
    console.error('MongoDB connection failed:', safeMessage);
    throw error;
  }
};

module.exports = connectDb;