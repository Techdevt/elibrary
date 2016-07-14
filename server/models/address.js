import mongoose from 'mongoose';

const AddressSchema = mongoose.Schema({
  fullName: String,
  addressLine1: String,
  addressLine2: String,
  postCode: String,
  zip: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  country: String,
  city: String,
  state: String,
  phone: String,
  geoLocation: {},
});


const db = connection => connection.model('Address', AddressSchema);

export default db;
