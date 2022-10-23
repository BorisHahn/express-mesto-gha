const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { notFound } = require('./utils/errors');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(bodyParser.json());

mongoose.connect(MONGO_URL);

// роуты, не требующие авторизации
app.post('/signin', login);
app.post('/signup', createUser);

// роуты, которым авторизация нужна
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use('*', (req, res) => {
  res.status(notFound).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
