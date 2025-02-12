import express from 'express';
import {
    checkAuth, forgotPassword,
    login,
    logout,
    resetPassword,
    signUp,
    updateFullName,
    updateProfile
} from "../controllers/authController.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();
router.post('/signup', signUp);

router.post('/login',login);

router.post('/logout',logout);

router.put('/update-profile',protectRoute,updateProfile)

router.patch('/update-full-name',protectRoute,updateFullName);

router.get('/check',protectRoute,checkAuth);
/*
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
*/
export default router;