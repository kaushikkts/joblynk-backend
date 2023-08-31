import express from "express";
import { updateContractorWithNewSubContractorStatus } from '../controllers/amazon.ses';

export default (router: express.Router) => {
    router.post('/verifyEmail', updateContractorWithNewSubContractorStatus);
    router.post('/checkIfEmailVerified');
    // router.post('/auth/login', loginUser);
    // router.post('/auth/verify', verifyToken, verifyValidToken);
}