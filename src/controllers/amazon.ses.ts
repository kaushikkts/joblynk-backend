import express from "express";
import * as AWS from 'aws-sdk';
export const verifyEmail = async (req: express.Request, res: express.Response) => {

    try {
        let params = {
            Destination: { /* required */
                CcAddresses: [],
                ToAddresses: [
                    'admin@ktechsolutions.org',
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    Html: {
                        Charset: "UTF-8",
                        Data: "HTML_FORMAT_BODY"
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: "TEXT_FORMAT_BODY"
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'http://localhost:4200/subcontractor-questionnaire'
                }
            },
            Source: 'kkarandikar08@gmail.com', /* required */

        };
        AWS.config.update({
            region: 'us-east-1',
            apiVersion: "latest"
        })
        let verifyEmail = await new AWS.SES({credentials: {
            accessKeyId: 'AKIAVA5O6P5STZGQMGNW',
                secretAccessKey: '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'
            }}).sendEmail(params).promise();
        console.log(verifyEmail.$response);
        return res.json(JSON.stringify(verifyEmail.$response.data));
    } catch (e) {
        console.log('entered error : - ', e);
        if (e.code === "MessageRejected") {
            return res.status(400).json('User has not been verified')
        }
        res.status(400).json(e);
    }
}