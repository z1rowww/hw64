import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import http from 'http';
import morgan from 'morgan';
import path from 'path';

import configPassport from './config/passport';
import { connectDB } from './config/database';
import indexRouter from './api/index';
import { statusCheck } from './middlewares/status.middleware';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

configPassport(passport);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.use(session({
  secret: 'my_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/pug' }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/status', statusCheck);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
