'use strict';

import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: String,
  lastName: String,
  permissions: [{
    name: String,
    permit: Boolean,
  }],
  avatarUrl: [String],
});

AdminSchema.methods.hasPermissionTo = (something) => {
  const found = this.permissions.findIndex(
    item => item.name === something && item.permit === true
  );

  return found !== -1;
};

const db = connection => connection.model('Admin', AdminSchema);

export default db;
