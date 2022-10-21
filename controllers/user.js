const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const User = require('../models/user');

const {
  created, badRequest, notFound, internalServerError,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(notFound)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при получении пользователя',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(created).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(notFound)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(notFound)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUser({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
