import { config } from '../../config';
import mongoose from 'mongoose';

let connection;

export function initDb(dbName) {
	connection = mongoose.createConnection(`${config.dbBase}/${dbName || config.dbName}`);
	return connection;
}

export function getDb() {
	return connection;
}