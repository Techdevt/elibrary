// server/router/index.js
import signup from './routes/signup';
import books from './routes/books';

export default (app, upload) => {
    app.use('/signup', signup);
    app.use('/books', books);

    if(process.env.NODE_ENV !== "production") {
    	_loadTestRoutes(app, upload);
    }
};

function _loadTestRoutes(app, upload) {
	app.use('/test', require('../../test/routes').default(upload));
}