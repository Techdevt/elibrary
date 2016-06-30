// server/router/index.js
import signup from './routes/signup';
import books from './routes/books';

export default (app) => {
    app.use('/signup', signup);
    app.use('/books', books);

    if(process.env.NODE_ENV !== "production") {
    	_loadTestRoutes(app);
    }
};

function _loadTestRoutes(app) {
	app.use('/test', require('../../test/routes').default);
}