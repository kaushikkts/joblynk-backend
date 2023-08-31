import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import {SubcontractorModel} from "../models/subcontractor.model";
import * as AWS from "aws-sdk";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';
const CONTRACTOR_COLLECTION = 'contractor';

export const createSubContractor = async (contractorId: string, subcontractor: SubcontractorModel) => {
    let client: MongoClient;
    try {
        console.log('value of th subcontractor object being added : - ', subcontractor);
        client = await connectToDatabase();
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
        const response =  await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
                $addToSet: {
                    subcontractors: subcontractor
                }
            });
        if (response.acknowledged && response.modifiedCount === 1) {
            AWS.config.update({
                region: 'us-east-1',
                apiVersion: "latest"
            })
            console.log('Sending verification email');
            let verifyEmail = await new AWS.SES().verifyEmailIdentity({EmailAddress: subcontractor.primaryContactEmail}).promise();
            console.log(verifyEmail.$response);
            if (verifyEmail.$response.httpResponse.statusCode === 200) {
                console.log('Verification email successfully sent');
                return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId), "subcontractors.primaryContactEmail": subcontractor.primaryContactEmail}, {
                    $set: {
                        "subcontractors.$.status": "VERIFICATION_EMAIL_SENT"
                    }
                })
            }
        }
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
    console.log('Value of contractorId and sub', contractorId, subcontractor);
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({
            _id: new ObjectId(contractorId),
            "subcontractors.primaryContactEmail": subcontractor.primaryContactEmail
        }, {
            $set: {
                "subcontractors.$.name": subcontractor.name,
                "subcontractors.$.primaryContactFirstName": subcontractor.primaryContactFirstName,
                "subcontractors.$.primaryContactLastName": subcontractor.primaryContactLastName,
                "subcontractors.$.primaryContactEmail": subcontractor.primaryContactEmail,
                "subcontractors.$.primaryContactPhone": subcontractor.primaryContactPhone,
                "subcontractors.$.primaryContactPhone2": subcontractor.primaryContactPhone2,
                "subcontractors.$.secondaryContactFirstName": subcontractor.secondaryContactFirstName,
                "subcontractors.$.secondaryContactLastName": subcontractor.secondaryContactLastName,
                "subcontractors.$.secondaryContactEmail": subcontractor.secondaryContactEmail,
                "subcontractors.$.secondaryContactPhone": subcontractor.secondaryContactPhone,
                "subcontractors.$.address": subcontractor.address,
                "subcontractors.$.documents": subcontractor.documents,
                "subcontractors.$.primaryTrade": subcontractor.primaryTrade,
                "subcontractors.$.otherTrades": subcontractor.otherTrades,
                "subcontractors.$.qualityOfWork": subcontractor.qualityOfWork,
                "subcontractors.$.areasOfImprovement": subcontractor.areasOfImprovement,
                "subcontractors.$.notes": subcontractor.notes,
                "subcontractors.$.status": subcontractor.status,
                "subcontractors.$.hasSentEmail": subcontractor.hasSentEmail
            }
        });
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
        const findSubcontractorsToVerifyEmail: any = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId)});
        await findVerified(findSubcontractorsToVerifyEmail?.subcontractors, client, contractorId);
        const contractorObject: any = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId)});
        return contractorObject?.subcontractors;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

export const sendRegisterSubContractorEmail = async(contractorId: string, subcontractorEmail: string) => {
    let params = {
        Destination: {
            ToAddresses: [
                subcontractorEmail
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
                },

            },
            Subject: {
                Charset: "UTF-8",
                Data: "Register to SubLynk"
            }
        },
        Source: "kkarandikar08@gmail.com",
    };
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // find in the subcontractor collection if sub is present, if not then send the url for the registration
        const findIfSubcontractorExists = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({primaryContactEmail: subcontractorEmail});
        console.log(`find subcontractor in send register email : - ${findIfSubcontractorExists}`)
        if (!findIfSubcontractorExists) {
            let verifiedEmails = await new AWS.SES({
                region: 'us-east-1',
                apiVersion: "latest"
            }).sendEmail(params).promise();
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const findVerified = async (subcontractors: SubcontractorModel[], client: MongoClient, contractorId: string) => {
    let verifiedEmails = await new AWS.SES({
        region: 'us-east-1',
        apiVersion: "latest",
    }).listIdentities().promise();
    let status = await new AWS.SES({
        region: 'us-east-1',
        apiVersion: "latest"
    }).getIdentityVerificationAttributes({Identities: verifiedEmails.Identities}).promise();

    const statusMap: Map<any, any> = new Map();
    Object.keys(status.VerificationAttributes).map((email: any) => statusMap.set(email, status.VerificationAttributes[email]));
    statusMap.forEach((value, key, map) => console.log(key, value.VerificationStatus));

    if (subcontractors.length) {
        for (let sub of subcontractors) {
            if (statusMap.has(sub.primaryContactEmail) && statusMap.get(sub.primaryContactEmail)?.VerificationStatus === 'Success') {
                // update subcontractor objects' status to VERIFIED
                console.log(`Setting status to verified of : - ${sub.primaryContactEmail}`);
                await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({
                    _id: new ObjectId(contractorId),
                    "subcontractors.primaryContactEmail": sub.primaryContactEmail
                }, {
                    $set: {
                        "subcontractors.$.status": "VERIFIED"
                    }
                })
            }
        }
    }
}

