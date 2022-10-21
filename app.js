const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { notFound } = require('./utils/errors');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63447a7973eceb3c5159d515',
  };
  next();
});

mongoose.connect(MONGO_URL);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(notFound).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
