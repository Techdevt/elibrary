// server/router/index.js
import signup from './routes/signup';
import books from './routes/books';

export default (app) => {
    app.use('/signup', signup);
    app.use('/books', books);
};