import express from 'express';
const router = express.Router();
import validateForm from '../controllers/validateForm.js';
import { attemptLogin, checkLoginStatus, attemptRegister } from '../controllers/authController.js';

router
    .route("/login")
    .get(checkLoginStatus)
    .post(validateForm, attemptLogin);

router.post("/signup", validateForm, attemptRegister);

export default router;