const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
    
    if (!process.env.MONGODB_URI) {
      console.warn('Warning: MONGODB_URI not found in .env, using default localhost connection');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Message: ${error.message}`);
    
    if (error.message.includes('bad auth')) {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check username and password in .env file');
      console.error('   2. Verify database user exists in MongoDB Atlas');
      console.error('   3. Ensure IP address is whitelisted in Network Access');
      console.error('   4. Try resetting the database user password in MongoDB Atlas');
    } else if (error.message.includes('whitelist')) {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Add your IP address to MongoDB Atlas Network Access');
      console.error('   2. Or add 0.0.0.0/0 to allow all IPs (development only)');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

