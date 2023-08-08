import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import {SubcontractorModel} from "../models/subcontractor.model";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';
const CONTRACTOR_COLLECTION = 'contractor';

export const createSubContractor = async (contractorId: string, subcontractor: SubcontractorModel) => {
    console.log(contractorId, subcontractor);
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const findSubContractor = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({"primaryContactEmail": subcontractor.primaryContactEmail});
        if (findSubContractor !== null) {
            // find if contractor already has a reference to it
            const contractor = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId), "subcontractors": findSubContractor._id});
            if (contractor !== null) {
                throw "Subcontractor already exists with the contractor";
            }
            return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
                $addToSet: {
                    subcontractors: findSubContractor._id
                }
            });
        }

        const subContractorResult = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).insertOne(subcontractor, {ignoreUndefined: true});
        const subContractorId = subContractorResult.insertedId;
        const contractorResult = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
            $addToSet: {
                "subcontractors": subContractorId
            }
        });
        return {
            contractor: contractorResult,
            subcontractor: subContractorResult
        };
    } catch (e) {
        console.log(`Error in createSubContractor database/subcontractor.ts file : - ${e}`);
        if (typeof e === "object" && e.code === 11000) {
            throw {status: 11000, message: "Data with same email is already registered in the database"}
        } else {
            throw e;
        }
    } finally {
        await client.close();
    }
}

export const deleteSubContractor = async (subcontractorId: string) => {
    //check if subcontractor exists in subcontractor table, if yes delete it.
    //check if any contractor has the id associated, and remove the id
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        console.log('Entered delete function');
        const subcontractorObject = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({_id: new ObjectId(subcontractorId)});
        if (subcontractorObject !== null) {
            console.log('Found Sub');
            // find if reference in contractor collection, and delete the element from array
            return await client.db(DB_NAME).collection<{}>(CONTRACTOR_COLLECTION).updateMany({}, {
                $pull: {
                    "subcontractors": new ObjectId(subcontractorId)
                }
            })
        }
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export const findSubContractor = async (subcontractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({_id: new ObjectId(subcontractorId)});
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export const findAllSubContractors = async () => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).find().toArray();
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}