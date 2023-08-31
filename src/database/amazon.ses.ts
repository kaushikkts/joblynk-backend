import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import * as AWS from "aws-sdk";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';
export const updateSubcontractorObject = async (contractorId: string, subContractorEmail: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        AWS.config.update({
            region: 'us-east-1',
            apiVersion: "latest"
        })
        let verifyEmail = await new AWS.SES().verifyEmailIdentity({EmailAddress: subContractorEmail}).promise();
        console.log(verifyEmail.$response);
        if (verifyEmail.$response.httpResponse.statusCode === 200) {
            return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId), "subcontractors.primaryContactEmail": subContractorEmail}, {
                $set: {
                    "subcontractors.status": "VERIFICATION_EMAIL_SENT"
                }
            })
        }

    } catch (e) {
        console.log(`Error in updateSubcontractorObject database/amazon.ses.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}
