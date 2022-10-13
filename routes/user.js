const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, editUser, editAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', editUser);
userRouter.patch('/me/avatar', editAvatar);

module.exports = userRouter;
