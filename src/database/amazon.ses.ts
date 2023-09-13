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


export const sendAppRegistrationEmail = async(to: string, from: string, role: string, contractorId?: string) => {
    let hrefLink;
    if (role === "EMPLOYEE") {
        hrefLink = `http://localhost:4200/auth/register?email=${to}&role=${role}&contractorId=${contractorId}`
    } else {
        hrefLink = `http://localhost:4200/auth/register?email=${to}&role=${role}`
    }
    console.log(`Entered sendAppRegistrationEmail method database/authentication.ts method : - ${to} and from : - ${from} with role: - ${role}`)
    let params = {
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `${from} invites you to join SubLynk. Please use the link to register on the app <a href=${hrefLink}>SubLynk</a>`
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Register to SubLynk"
            }
        },
        Source: from,
    };
    return await new AWS.SES({
        region: 'us-east-1',
        apiVersion: "latest"
    }).sendEmail(params).promise();
}

export const emailTradesmanAgreement = async(to: string, from: string, fileUrl: string, token?: string) => {
    let hrefLink = fileUrl;
    console.log(`Entered sendAppRegistrationEmail method database/authentication.ts method : - ${to} and from : - ${from}`)
    let params = {
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `${from} has sent you a Tradesman Agreement. Please download the file, fill it out and upload. <a href=${hrefLink}>Tradesman Agreement</a>`
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Register to SubLynk"
            }
        },
        Source: from,
    };
    return await new AWS.SES({
        region: 'us-east-1',
        apiVersion: "latest"
    }).sendEmail(params).promise();
}