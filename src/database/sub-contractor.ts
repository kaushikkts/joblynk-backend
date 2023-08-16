import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import {SubcontractorModel} from "../models/subcontractor.model";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';
const CONTRACTOR_COLLECTION = 'contractor';

export const createSubContractor = async (contractorId: string, subcontractor: SubcontractorModel) => {
    // console.log('asa kay kartoy ha???? : - ', contractorId, subcontractor);
    let client: MongoClient;
    try {
        console.log('value of th subcontractor object being added : - ', subcontractor);
        client = await connectToDatabase();
        // console.log()
        const findSubContractor = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne(
            {_id: new ObjectId(contractorId),
                "subcontractors.primaryContactEmail": subcontractor.primaryContactEmail
        }
        );
        console.log('value of find sub: - ', findSubContractor);
        if (findSubContractor !== null) {
            throw "Subcontractor already exists with the contractor";
        }
        subcontractor._id = new ObjectId();
        return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
                $addToSet: {
                    subcontractors: subcontractor
                }
            });
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

export const updateSubContractor = async (contractorId: string, subcontractor: SubcontractorModel) => {
    console.log(subcontractor);
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId),
            "subcontractors.primaryContactEmail": subcontractor._id
        }, {
            $set: {
                name: subcontractor.name,
                primaryContactFirstName: subcontractor.primaryContactFirstName,
                primaryContactLastName: subcontractor.primaryContactLastName,
                primaryContactEmail: subcontractor.primaryContactEmail,
                primaryContactPhone: subcontractor.primaryContactPhone,
                primaryContactPhone2: subcontractor.primaryContactPhone2,
                secondaryContactFirstName: subcontractor.secondaryContactFirstName,
                secondaryContactLastName: subcontractor.secondaryContactLastName,
                secondaryContactEmail: subcontractor.secondaryContactEmail,
                secondaryContactPhone: subcontractor.secondaryContactPhone,
                address: subcontractor.address,
                documents: subcontractor.documents,
                primaryTrade: subcontractor.primaryTrade,
                otherTrades: subcontractor.otherTrades,
                qualityOfWork: subcontractor.qualityOfWork,
                areasOfImprovement: subcontractor.areasOfImprovement,
                notes: subcontractor.notes,
                status: subcontractor.status
            }
        })
    } catch (e) {
        throw e;
    }
}

export const deleteSubContractor = async (subcontractorId: string, contractorId: string) => {
    //check if subcontractor exists in subcontractor table, if yes delete it.
    //check if any contractor has the id associated, and remove the id
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        console.log('Entered delete function');
        return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId),
            "subcontractors._id": new ObjectId(subcontractorId)
        }, {
            $pull: {
                "subcontractors": {"_id": new ObjectId(subcontractorId)}
            }
        });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export const findSubContractor = async (contractorId: string, subcontractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId),
            "subcontractors._id": new ObjectId(subcontractorId)
        });
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export const findAllSubContractors = async (contractorId: string) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const contractorObject: any = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId)});
        return contractorObject?.subcontractors;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}