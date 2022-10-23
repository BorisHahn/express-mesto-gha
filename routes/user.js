const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  editUser,
  editAvatar,
  getProfileInfo,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/me', getProfileInfo);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', editUser);
userRouter.patch('/me/avatar', editAvatar);

module.exports = userRouter;
