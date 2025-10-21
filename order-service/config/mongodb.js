import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  await mongoose.connect(`${process.env.MONGO_CLUSTER_URI}/orders`)
}

export default connectDB;