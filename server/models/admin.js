'use strict';

import mongoose from 'mongoose';

let AdminSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	firstName: String,
	lastName: String,
	permissions: [{
      name: String,
      permit: Boolean
    }],
    avatarUrl: [String]
});

AdminSchema.methods.hasPermissionTo = function(something) {
	const found = this.permissions.findIndex((item) => {
		return item.name === something && item.permit === true;
	});
	
	return found !== -1;
};

const db = connection => connection.model('Admin', AdminSchema);

export default db;