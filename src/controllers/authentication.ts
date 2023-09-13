import express from "express";
import { login, register } from "../database/authentication";
import { verifyToken } from "../middleware/auth-verify";
import {sendAppRegistrationEmail} from "../database/amazon.ses";

const adminEmail = 'admin@ktechsolutions.org';

export const registerUser = async (req: express.Request, res: express.Response) => {
    console.log(`body parameters in registerUser method in controllers/authentication.ts file : - ${JSON.stringify(req.body)}`);
    const userDetails = req?.body;
    try {
        const result = await register(userDetails);
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const loginUser = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    try {
        const result = await login(email, password);
        console.log(`controllers/authentication.ts method Login response : - ${JSON.stringify(result)}`);
        if (result?.contractorId) {
            res.status(200).json({
                id: result?.contractorId,
                email: result?.email,
                token: result?.token,
                role: result?.role
            })
        } else {
            res.status(200).json({
                id: result?._id,
                email: result?.email,
                token: result?.token,
                role: result?.role
            })
        }
    } catch (e) {
        if (!e?.doesPasswordMatch) {
            res.status(401).json(e?.message);
        } else {
            res.status(400).json(e);
        }

    }
}

export const sendRegistrationEmailToContractor = async (req: express.Request, res: express.Response) => {
    try {
        const { adminEmail, contractorEmail } = req?.body;
        const result = await sendAppRegistrationEmail(contractorEmail, adminEmail, "CONTRACTOR");
        res.status(201).json({
            message: result
        })
    } catch (e) {
        res.status(400).json(e);
    }
}

export const verifyValidToken = async (req: express.Request, res: express.Response, next) => {
    const response = await verifyToken(req, res, next);
    res.json(response);
}