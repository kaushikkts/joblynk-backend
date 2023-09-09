import {MongoClient} from "mongodb";
import {connectToDatabase} from "./database-functions";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';

export const updateFile = async (subcontractorEmail: string, s3Result: any) => {
    let client: MongoClient;
    const split = s3Result?.Key?.split('/');
    const folderName = split[2];
    const fileName = split[3];
    const url = s3Result?.Location;

    const dataToBeSaved = {
        location: url,
        fileName: fileName
    }
    try {
        client = await connectToDatabase();
        switch (folderName) {
            case "certifications":
                return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
                    $addToSet: {
                        "documents.certifications": dataToBeSaved
                    }
                });
            case "driverLicense":
                return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
                    $addToSet: {
                        "documents.driverLicense": dataToBeSaved
                    }
                });
            case "insurance":
                return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
                    $addToSet: {
                        "documents.insurance": dataToBeSaved
                    }
                });
            case "w9":
                return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
                    $addToSet: {
                        "documents.w9": dataToBeSaved
                    }
                });
            case "others":
                return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
                    $addToSet: {
                        "documents.others": dataToBeSaved
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
