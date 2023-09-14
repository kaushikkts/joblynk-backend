import {MongoClient, ObjectId} from "mongodb";
import {connectToDatabase} from "./database-functions";
import {SubcontractorModel} from "../models/subcontractor.model";
import * as AWS from "aws-sdk";
import {emailTradesmanAgreement} from "./amazon.ses";

const DB_NAME = 'joblynk';
const SUBCONTRACTOR_COLLECTION = 'subcontractor';
const CONTRACTOR_COLLECTION = 'contractor';

export const createSubContractor = async (contractorId: string, subcontractor: SubcontractorModel) => {
    let client: MongoClient;
    try {

        console.log('value of th subcontractor object being added : - ', subcontractor);
        client = await connectToDatabase();
        subcontractor._id = new ObjectId();
        // await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).createIndex({"subcontractors.primaryContactEmail": 1}, {unique: true});
        const findSubContractor = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne(
            {_id: new ObjectId(contractorId),
                "subcontractors.primaryContactEmail": subcontractor.primaryContactEmail
        }
        );
        console.log('value of find sub: - ', findSubContractor);
        if (findSubContractor !== null) {
            throw "Subcontractor already exists with the contractor";
        }
        // subcontractor._id = new ObjectId();
        const response =  await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
                $addToSet: {
                    subcontractors: subcontractor
                }
            });
        if (response.acknowledged && response.modifiedCount === 1) {
            // console.log('Sending verification email');
            // let verifyEmail = await new AWS.SES().verifyEmailIdentity({EmailAddress: subcontractor.primaryContactEmail}).promise();
            // console.log(verifyEmail.$response);
            // if (verifyEmail.$response.httpResponse.statusCode === 200) {
            //     console.log('Verification email successfully sent');
            //     return await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({_id: new ObjectId(contractorId), "subcontractors.primaryContactEmail": subcontractor.primaryContactEmail}, {
            //         $set: {
            //             "subcontractors.$.status": "VERIFICATION_EMAIL_SENT"
            //         }
            //     })
            // }
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
                "subcontractors.$.name": subcontractor?.name,
                "subcontractors.$.primaryContactFirstName": subcontractor?.primaryContactFirstName,
                "subcontractors.$.primaryContactLastName": subcontractor?.primaryContactLastName,
                "subcontractors.$.primaryContactEmail": subcontractor?.primaryContactEmail,
                "subcontractors.$.primaryContactPhone": subcontractor?.primaryContactPhone,
                "subcontractors.$.primaryContactPhone2": subcontractor?.primaryContactPhone2,
                "subcontractors.$.secondaryContactFirstName": subcontractor?.secondaryContactFirstName,
                "subcontractors.$.secondaryContactLastName": subcontractor?.secondaryContactLastName,
                "subcontractors.$.secondaryContactEmail": subcontractor?.secondaryContactEmail,
                "subcontractors.$.secondaryContactPhone": subcontractor?.secondaryContactPhone,
                "subcontractors.$.primaryContactAddress": subcontractor?.primaryContactAddress,
                "subcontractors.$.documents": subcontractor?.documents,
                "subcontractors.$.primaryTrade": subcontractor?.primaryTrade,
                "subcontractors.$.secondaryTrade": subcontractor?.secondaryTrade,
                "subcontractors.$.otherTrade1": subcontractor?.otherTrade1,
                "subcontractors.$.otherTrade2": subcontractor?.otherTrade2,
                "subcontractors.$.qualityOfWork": subcontractor?.qualityOfWork,
                "subcontractors.$.areasOfImprovement": subcontractor?.areasOfImprovement,
                "subcontractors.$.notes": subcontractor?.notes,
                "subcontractors.$.status": subcontractor?.status,
                "subcontractors.$.profileGorillaStatus": subcontractor?.profileGorillaStatus,
                "subcontractors.$.hasSentEmail": subcontractor?.hasSentEmail
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

        const contractorObject: any = await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).find({_id: new ObjectId(contractorId)}).project({subcontractors: 1}).toArray();
        console.log('Find all contractors database/subcontractor.ts ',contractorObject);
        return contractorObject[0]?.subcontractors ? contractorObject[0]?.subcontractors : null;
    } catch (e) {
        throw e;
    } finally {
        await client.close();
    }
}

// export const sendRegisterSubContractorEmail = async(contractorEmail: string, subcontractorEmail: string) => {
//     console.log(`Entered sendRegisterSubContractorEmail database/subcontractor.ts method : - ${contractorEmail} and subEmail : - ${subcontractorEmail}`)
//     let params = {
//         Destination: {
//             ToAddresses: [
//                 subcontractorEmail
//             ]
//         },
//         Message: {
//             Body: {
//                 Html: {
//                     Charset: "UTF-8",
//                     Data: `${contractorEmail} invites you to join SubLynk. Please use the link to register on the app <a href="http://localhost:4200/auth/register?email=${subcontractorEmail}&role=SUBCONTRACTOR">SubLynk</a>`
//                 },
//
//             },
//             Subject: {
//                 Charset: "UTF-8",
//                 Data: "Register to SubLynk"
//             }
//         },
//         Source: contractorEmail,
//     };
//     let client: MongoClient;
//     try {
//         client = await connectToDatabase();
//         // find in the subcontractor collection if sub is present, if not then send the url for the registration
//         const findIfSubcontractorExists = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({email: subcontractorEmail});
//         console.log(`find subcontractor in send register email : - ${findIfSubcontractorExists}`)
//         if (!findIfSubcontractorExists) {
//             return await new AWS.SES({
//                 region: 'us-east-1',
//                 apiVersion: "latest"
//             }).sendEmail(params).promise();
//         }
//     } catch (e) {
//         console.log(e);
//         throw e;
//     }
// }

// export const findVerified = async (subcontractors: SubcontractorModel[], client: MongoClient, contractorId: string) => {
//
//     try {
//         let verifiedEmails = await new AWS.SES({
//             region: 'us-east-1',
//             apiVersion: "latest",
//         }).listIdentities().promise();
//         let status = await new AWS.SES({
//             region: 'us-east-1',
//             apiVersion: "latest"
//         }).getIdentityVerificationAttributes({Identities: verifiedEmails.Identities}).promise();
//
//         const statusMap: Map<any, any> = new Map();
//         Object.keys(status.VerificationAttributes).map((email: any) => statusMap.set(email, status.VerificationAttributes[email]));
//         statusMap.forEach((value, key, map) => console.log(key, value.VerificationStatus));
//
//         if (subcontractors.length) {
//             for (let sub of subcontractors) {
//                 if (statusMap.has(sub.primaryContactEmail) && statusMap.get(sub.primaryContactEmail)?.VerificationStatus === 'Success') {
//                     // update subcontractor objects' status to VERIFIED
//                     console.log(`Setting status to verified of : - ${sub.primaryContactEmail}`);
//                     await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).updateOne({
//                         _id: new ObjectId(contractorId),
//                         "subcontractors.primaryContactEmail": sub.primaryContactEmail
//                     }, {
//                         $set: {
//                             "subcontractors.$.status": "VERIFIED"
//                         }
//                     })
//                 }
//             }
//         }
//     } catch (e) {
//         throw e;
//     }
// }

export const findDocumentsForSubcontractor = async (email: string) => {
    console.log('database/subcontractor findDocuments method: - ', email);
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const subcontractor: any = await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({"email": email});
        console.log('findDocumentsForSubcontractor method response : - ', subcontractor);
        return subcontractor?.documents;
    } catch (e) {
        console.log('Entered error: - ', e)
        throw e;}
}

export const uploadTradesmanQuestionnaire = async (questionnaireForm: any, subcontractorEmail: string) => {
    let client: MongoClient;
    try {
     client = await connectToDatabase();
     return await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).updateOne({"email": subcontractorEmail}, {
         $set: {
             tradesmanQuestionnaire: questionnaireForm
         }
     })
    } catch (e) {
        throw e;
    }
}

export const getTradesmanQuestionnaire = async (subcontractorEmail: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const subcontractor =  await client.db(DB_NAME).collection(SUBCONTRACTOR_COLLECTION).findOne({"email": subcontractorEmail});
        return subcontractor?.tradesmanQuestionnaire;
    } catch (e) {
        throw e;
    }
}

export const sendAgreementEmailToContractor = async (subcontractorEmail: string, contractorId: string, contractorEmail: string) => {
    // find contractor object, get documents, get the S3 location. call the sendEmail method with that
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        const contractor =  await client.db(DB_NAME).collection(CONTRACTOR_COLLECTION).findOne({_id: new ObjectId(contractorId)});
        const agreement = contractor?.documents?.tradesmanAgreement[0];
        console.log('database/subcontractor.ts sendAgreementEmail: - ', agreement?.location);
        if (!agreement?.location) {
            return "Tradesman agreement has not been added yet. Please upload it and then try to resend.";
        }

        return await emailTradesmanAgreement(subcontractorEmail, contractorEmail, agreement?.location);
    } catch (e) {
        throw e;
    }
}

