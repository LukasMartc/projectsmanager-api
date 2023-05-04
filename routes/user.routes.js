import express from "express";
import { 
  registerUser,
  confirmed,
  forgotPassword,
  checkToken,
  newPassword,
  login,
  rememberMe,
  profile,
  logout
} from "../controllers/user.controllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/', registerUser);
router.get('/confirmed/:token', confirmed);
router.post('/forgot-password', forgotPassword);

router.route('/forgot-password/:token')
  .get(checkToken)
  .post(newPassword);

router.post('/login', login);
router.post('/login/remember-me', rememberMe);
router.get('/profile', checkAuth, profile);
router.get('/profile/logout', checkAuth, logout);

export default router;
