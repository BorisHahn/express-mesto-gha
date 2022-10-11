const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
          err,
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка", err });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: "Карточка с указанным id не найдена." });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => res.status(500).send({ message: "Произошла ошибка", err }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Передан несуществующий id карточки" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
          err,
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка", err });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Передан несуществующий id карточки" });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для снятия лайка",
          err,
        });
        return;
      }
      res.status(500).send({ message: "Произошла ошибка", err });
    });
};
