const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const NotFoundError = require('./errors/notFoundError');
const { login, createUser } = require('./controllers/user');
const { validRegData, validLoginData } = require('./utils/validation/validUserData');
const auth = require('./middlewares/auth');
const errorSetter = require('./middlewares/errorSetter');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect(MONGO_URL);

// роуты, не требующие авторизации
app.post('/signin', validLoginData, login);
app.post('/signup', validRegData, createUser);

// роуты, которым авторизация нужна
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса'));
});

app.use(errors());
app.use(errorSetter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
