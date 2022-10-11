const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, editUser,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', editUser);
userRouter.patch('/me/avatar', editUser);

module.exports = userRouter;
