import express from "express";
import { verifyEmail } from '../controllers/amazon.ses';

export default (router: express.Router) => {
    router.post('/verifyEmail', verifyEmail);
    router.post('/checkIfEmailVerified');
    // router.post('/auth/login', loginUser);
    // router.post('/auth/verify', verifyToken, verifyValidToken);
}