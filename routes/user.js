const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  editUser,
  editAvatar,
  getProfileInfo,
} = require('../controllers/user');
const {
  validGetByIdData,
  validEditUserData,
  validEditAvatarData,
} = require('../utils/validation/validUserData');

userRouter.get('/', validGetByIdData, getUsers);
userRouter.get('/me', getProfileInfo);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', validEditUserData, editUser);
userRouter.patch('/me/avatar', validEditAvatarData, editAvatar);

module.exports = userRouter;
