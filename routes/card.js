const cardRouter = require("express").Router();
const { getCards, deleteCard, createCard } = require("../controllers/card");

cardRouter.get("/", getCards);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.post("/", createCard);

module.exports = cardRouter;