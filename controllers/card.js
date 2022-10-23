const Card = require('../models/card');
const {
  created, badRequest, notFound, internalServerError, forbiddenError,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(internalServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(notFound)
          .send({ message: 'Карточка с указанным id не найдена.' });
        return;
      }
      if (card.owner._id !== req.user._id) {
        res
          .status(forbiddenError)
          .send({ message: 'Чужие карточки удалению не подлежат.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для удаления карточки',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Передан несуществующий id карточки' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }
      res.status(internalServerError).send({ message: 'Произошла ошибка' });
    });
};
