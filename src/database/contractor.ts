import {connectToDatabase} from "./database-functions";
import {MongoClient, ObjectId} from "mongodb";
import {ContractorModel} from "../models/contractor.model";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';
export const getAllContractors = async () => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).find().toArray();
    } catch (e) {
        console.log(`Error in getAllContractors database/contractor.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const getAContractor = async (id: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(id)});
    } catch (e) {
        console.log(`Error in getAContractor database/contractor.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const createContractor = async (contractor: ContractorModel) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).insertOne(contractor, {ignoreUndefined: true});
    } catch (e) {
        console.log(`Error in createContractor database/contractor.ts file : - ${e}`);
        if (typeof e === "object" && e.code === 11000) {
            throw {status: 11000, message: "Data with same email is already registered in the database"}
        } else {
            throw e;
        }
    } finally {
        await client.close();
    }
}

export const updateContractor = async (contractor: ContractorModel) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractor.id)}, {"$set": contractor});
    } catch (e) {
        console.log(`Error in updateContractor database/contractor.ts file : - ${e}`);
       throw e;
    } finally {
        await client.close();
    }
}

export const deleteContractor = async (id: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).deleteOne({_id: new ObjectId(id)});
    } catch (e) {
        console.log(`Error in updateContractor database/contractor.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}