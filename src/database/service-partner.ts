import {connectToDatabase} from "./database-functions";
import {MongoClient, ObjectId} from "mongodb";
import {ServicePartnersModel} from "../models/service-partners.model";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';

export const getAllServicePartners = async (contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // find the contractor, and then pull the Service Partner array
        const contractor = await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(contractorId)});
        console.log('Fetching the contractor object: - ', contractor);
        return contractor?.servicePartners ? contractor.servicePartners : null;
    } catch (e) {
        console.log(`Error in getAllServicePartners database/service-partner.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

// export const getAServicePartner = async (id: string) => {
//     let client: MongoClient;
//     try {
//         client = await connectToDatabase();
//         return await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(id)});
//     } catch (e) {
//         console.log(`Error in getAContractor database/contractor.ts file : - ${e}`);
//         throw e;
//     } finally {
//         await client.close();
//     }
// }
//
export const createServicePartner = async (servicePartner: ServicePartnersModel) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const existingServicePartner = await client.db(DB_NAME).collection(COLLECTION).findOne({"servicePartners.primaryContactEmail": servicePartner.primaryContactEmail})
        if (!existingServicePartner) {
            return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(servicePartner.contractorId)}, {$addToSet: {
                "servicePartners": servicePartner
                }});
        }
        return  {
            alreadyExists: 1,
            message: "Service Partner Already exists"
        };
    } catch (e) {
        console.log(`Error in createServicePartner database/service-partner.ts file : - ${e}`);
        if (typeof e === "object" && e.code === 11000) {
            throw {status: 11000, message: "Data with same email is already registered in the database"}
        } else {
            throw e;
        }
    } finally {
        await client.close();
    }
}

export const updatePartner = async (servicePartner: ServicePartnersModel) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne(
            {_id: new ObjectId(servicePartner.contractorId),  "servicePartners.primaryContactEmail": servicePartner.primaryContactEmail}, {

                $set: {
                    "servicePartners.$.name": servicePartner.name,
                    "servicePartners.$.primaryContactFirstName": servicePartner.primaryContactFirstName,
                    "servicePartners.$.primaryContactLastName": servicePartner.primaryContactLastName,
                    "servicePartners.$.primaryContactPhone": servicePartner.primaryContactPhone,
                    "servicePartners.$.primaryContactEmail": servicePartner.primaryContactEmail,
                    "servicePartners.$.secondaryContactFirstName": servicePartner.secondaryContactFirstName,
                    "servicePartners.$.secondaryContactLastName": servicePartner.secondaryContactLastName,
                    "servicePartners.$.secondaryContactPhone": servicePartner.secondaryContactPhone,
                    "servicePartners.$.secondaryContactEmail": servicePartner.secondaryContactEmail,
                    "servicePartners.$.services": servicePartner.services,
                    "servicePartners.$.qualityOfWork": servicePartner.qualityOfWork,
                    "servicePartners.$.notes": servicePartner.notes
                }
            });
    } catch (e) {
        console.log(`Error in updateServicePartner database/service-partner.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const deleteServicePartner = async (servicePartner: ServicePartnersModel) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(servicePartner.contractorId)}, {
            $pull: {
                "servicePartners": {
                        "primaryContactEmail" : servicePartner.primaryContactEmail,
                }
            }
        }, {
            upsert: false
        });
    } catch (e) {
        console.log(`Error in deleting service partner database/service-partner.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}