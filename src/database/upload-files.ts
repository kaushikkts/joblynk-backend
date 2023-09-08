import {MongoClient} from "mongodb";
import {connectToDatabase} from "./database-functions";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';

export const updateFile = async (subcontractorEmail: string, fileName: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({email: subcontractorEmail}, {
            $addToSet: {
                "documents": fileName
            }
        })
    } catch (e) {
        throw e;
    } finally {
        console.log('Update file method complete');
    }
}
