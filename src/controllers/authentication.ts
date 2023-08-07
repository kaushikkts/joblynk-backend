// import express from "express";
//
// import {createUser, getUserByEmail} from "../db/users";
// import {authentication, random} from "../helpers";
//
// export const login = async(req: express.Request, res: express.Response) => {
//     try {
//         const {email, password} = req.body;
//         if (!email || !password) {
//             console.log('Email or password not entered correctly');
//             return res.json('Wrong');
//         }
//
//         const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
//         console.log(user.authentication.salt, user.authentication.password);
//         if (!user) {
//             return res.json('No email found');
//         }
//         const expectedHash = await authentication(user.authentication.salt, password);
//         if (user.authentication.password !== expectedHash) {
//             return res.json('Wrong password');
//         }
//
//
//         const salt = random();
//         user.authentication.sessionToken = authentication(salt, user._id.toString());
//         await user.save();
//         res.cookie('KAUSHIK-COOKIE', user.authentication.sessionToken, {domain: 'localhost', path:'/'});
//
//         return res.json(user).end();
//
//     } catch (e) {
//         console.log(e);
//         res.json(e);
//     }
// }
//
// export const register = async (req: express.Request, res: express.Response) => {
//     try {
//         const {email, password, username} = req.body;
//
//         if (!email || !password || !username) {
//             return res.status(400);
//         }
//
//         const existingUser = await getUserByEmail(email);
//
//         if (existingUser) {
//             return res.json('User already exists');
//         }
//
//         const salt = random();
//         const user = await createUser({
//             email,
//             username,
//             authentication: {
//                 salt,
//                 password: authentication(salt, password)
//             }
//         });
//
//         return res.json(user).end();
//     } catch (error) {
//         console.log(error);
//         return res.status(400);
//     }
// }