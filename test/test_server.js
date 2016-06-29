import app from '../server';
import http from 'http';

export function makeServer() {
	return http.createServer(app).listen(3000);
}