import express from 'express';
const router = express.Router();
import validateForm from '../controllers/validateForm.js';

router.post("/login", (req, res) => {
    validateForm(req, res)
});

router.post("/signup", (req, res) => {
    validateForm(req, res)
});

export default router;