
import express from "express";
import {login, register, verifyUser} from "../database/authentication";
import {UserModel} from "../models/user.model";

export const registerUser = async (req: express.Request, res: express.Response) => {
    const { userDetails, password } = req.body;
    try {
        const result = await register(userDetails, password);
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
            token: result?.token

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