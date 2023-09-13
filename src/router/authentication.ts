import express from "express";

import {
    loginUser,
    registerUser,
    sendRegistrationEmailToContractor, verifyValidToken
} from "../controllers/authentication";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.post('/auth/register', registerUser);
    router.post('/auth/login', loginUser);
    router.post('/auth/verify', verifyValidToken);
    router.post('/auth/contractor/registerEmail', sendRegistrationEmailToContractor);
}