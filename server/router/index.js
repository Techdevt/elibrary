// server/router/index.js
import signup from './routes/signup';
import books from './routes/books';
import testRoutes from '../../test/routes';

function loadTestRoutes(app, upload) {
  app.use('/test', testRoutes(upload));
}

export default (app, upload) => {
  app.use('/signup', signup);
  app.use('/books', books);

  if (process.env.NODE_ENV !== 'production') {
    loadTestRoutes(app, upload);
  }
};
