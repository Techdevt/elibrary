// server/router/index.js
import signup from './routes/signup';

export default (app) => {
    app.use('/signup', signup);
};