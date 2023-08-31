import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import {ContractorModel} from "../models/contractor.model";
import {UserModel} from "../models/user.model";

const DB_NAME = 'joblynk';
const COLLECTION_USERS = 'users';
const COLLECTION_CONTRACTOR = 'contractor';
const COLLECTION_SUBCONTRACTOR = 'subcontractor';

export const register = async (userDetails: any) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        if (!userDetails.email) {
            throw "Email not specified";
        }
        if (!userDetails.password) {
            throw "Password not specified";
        }
        const user = await client.db(DB_NAME).collection(COLLECTION_USERS).findOne({"email": userDetails.email.trim().toLowerCase()});
        if (user) {
            throw `User with email ${userDetails.email} already registered`;
        }
        const contractor = await client.db(DB_NAME).collection(COLLECTION_CONTRACTOR).findOne({"email": userDetails.email.trim().toLowerCase()});
        if (contractor) {
            throw `User with email ${userDetails.email} already registered as a CONTRACTOR`;
        }
        const subContractor = await client.db(DB_NAME).collection(COLLECTION_SUBCONTRACTOR).findOne({"email": userDetails.email.trim().toLowerCase()});
        if (subContractor) {
            throw `User with email ${userDetails.email} already registered as a Sub Contractor`;
        }

        const encryptedPassword = await bcrypt.hash(userDetails.password, 12);
        console.log('generating token');
        const token = jwt.sign({email: userDetails.email}, 'secret', {expiresIn: '72h'})
        console.log(token);
        const generatedId = new ObjectId();
        // create new user in users table

        if (userDetails.role === 'CONTRACTOR') {
            await client.db(DB_NAME).collection(COLLECTION_USERS).insertOne({
                _id: generatedId,
                email: userDetails.email,
                password: encryptedPassword,
                role: "CONTRACTOR",
                token: token
            });
            return await client.db(DB_NAME).collection(COLLECTION_CONTRACTOR).insertOne({
                _id: generatedId,
                name: userDetails.name,
                email: userDetails.email,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                address: userDetails.address
            })
        }

        if (userDetails.role === 'SUBCONTRACTOR') {
            await client.db(DB_NAME).collection(COLLECTION_USERS).insertOne({
                _id: generatedId,
                email: userDetails.email,
                password: encryptedPassword,
                role: "SUBCONTRACTOR",
                token: token
            });
            return await client.db(DB_NAME).collection(COLLECTION_SUBCONTRACTOR).insertOne({
                _id: generatedId,
                companyName: userDetails.companyName,
                email: userDetails.email
            })
        }

        // create new user in contractor table

    } catch (e) {
        console.log('entered here', e);
        throw e;
    }
}

export const login = async (email: string, password: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        if (!email) {
            throw "Email not specified";
        }
        if (!password) {
            throw "Password not specified";
        }
        const user = await client.db(DB_NAME).collection(COLLECTION_USERS).findOne({"email": email.trim().toLowerCase()});
        console.log('value of user', user);
        if (user === null) {
            throw "User does not exist";
        }
        let token;
        const isPasswordSame = await bcrypt.compare(password, user.password);
        console.log(isPasswordSame);
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('entered here');
            token = jwt.sign({email: email}, 'secret', {expiresIn: '12h'});
            await client.db(DB_NAME).collection(COLLECTION_USERS).updateOne({email: email }, {
                $set:  {
                    token: token
                }
            })
        } else {
            throw {
                doesPasswordMatch: false,
                message: "Login credentials are wrong"
            };
        }
        return user;


    } catch (e) {
        throw e;
    }
}

export const verifyUser = async () => {
    return true;
}