
import express from "express";
import {login, register, verifyUser} from "../database/authentication";

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
        return res.json({
            id: result?._id,
            email: result?.email,
            token: result?.token,
            role: result?.role

        });
    } catch (e) {
        if (!e?.doesPasswordMatch) {
            res.status(401).json(e?.message);
        } else {
            res.status(400).json(e);
        }

    }
}

export const verifyValidToken = async (req: express.Request, res: express.Response) => {
    try {
        await verifyUser();
        res.json(true);
    } catch (e) {
        res.status(400).json(e);
    }
}