import {MongoClient} from "mongodb";
import {connectToDatabase} from "./database-functions";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';
const CONTRACTOR_COLLECTION = 'contractor';
let collection;

export const updateFile = async (role: string, email: string, s3Result: any) => {
    let client: MongoClient;
    const split = s3Result?.Key?.split('/');
    const folderName = split[2];
    const fileName = split[3];
    const url = s3Result?.Location;

    const dataToBeSaved = {
        location: url,
        fileName: fileName
    }

    if (role === "CONTRACTOR") {
        collection = CONTRACTOR_COLLECTION;
    }
    if (role === "SUBCONTRACTOR") {
        collection = SUBCONTRACTOR_COLLECTION;
    }
    try {
        client = await connectToDatabase();
        switch (folderName) {
            case "certifications":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.certifications": dataToBeSaved
                    }
                });
            case "driverLicense":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.driverLicense": dataToBeSaved
                    }
                });
            case "insurance":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.insurance": dataToBeSaved
                    }
                });
            case "w9":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.w9": dataToBeSaved
                    }
                });
            case "others":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.others": dataToBeSaved
                    }
                })
            case "tradesmanAgreement":
                return await client.db(DB_NAME).collection(collection).updateOne({email: email}, {
                    $addToSet: {
                        "documents.tradesmanAgreement": dataToBeSaved
                    }
                })

            case "default":
                return;
        }

    } catch (e) {
        throw e;
    } finally {
        console.log('Update file method complete');
    }
}
