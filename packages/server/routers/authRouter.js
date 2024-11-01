import express from 'express';
const router = express.Router();
import validateForm from '../controllers/validateForm.js';
import { attemptLogin, 
    checkLoginStatus, 
    attemptRegister 
} from '../controllers/authController.js';
import rateLimiter from '../controllers/rateLimiter.js';

router
    .route("/login")
    .get(checkLoginStatus)
    .post(validateForm, rateLimiter(60, 10), attemptLogin);
router.post("/signup", rateLimiter(60, 4), validateForm, attemptRegister);
export default router;