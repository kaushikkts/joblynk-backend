import express, {response} from "express";
import formidable from 'formidable';
import { S3 } from "aws-sdk";
import * as fs from "fs";
import {updateFile} from "../database/upload-files";

const bucket = new S3(
    {
        credentials: {
            accessKeyId: "AKIAVA5O6P5STZGQMGNW",
            secretAccessKey: "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"
        },
        apiVersion: "latest",
        region: "us-east-1"
    }
);

export const uploadFiles = async (req: express.Request, res: express.Response) => {

    try {
        const form = await formidable({allowEmptyFiles: false});
        const [files, fields] = await form.parse(req);

        console.log(Object.keys(fields)[0]);
        const fileName = Object.keys(fields)[0];
        const filePath = fields[fileName][0].filepath;
        const readFile = await fs.readFileSync(filePath);
        // console.log(readFile);
        const result = await bucket.upload({Body: readFile, Key: fileName, Bucket: 'sublynk-subcontractor-documents', ACL: "public-read"}).promise();
        console.log('Response from S3 after updating the file: - ', result);
        // if successful, save the S3 location bucket in DB
        let split = result.Key.split('/');
        const email = split[0];
        const responseFromUpdateFile = await updateFile("SUBCONTRACTOR", email, result);

        res.json(JSON.stringify(responseFromUpdateFile));
    } catch (e) {
        console.log('entered', e);
        res.status(400).json(JSON.stringify(e));
    }
}

export const uploadContractorFiles = async (req: express.Request, res: express.Response) => {

    try {
        const form = await formidable({allowEmptyFiles: false});
        const [files, fields] = await form.parse(req);

        console.log(Object.keys(fields)[0]);
        const fileName = Object.keys(fields)[0];
        const filePath = fields[fileName][0].filepath;
        const readFile = await fs.readFileSync(filePath);
        // console.log(readFile);
        const result = await bucket.upload({Body: readFile, Key: fileName, Bucket: 'sublynk-contractor-documents', ACL: "public-read"}).promise();
        console.log('Response from S3 after updating the file: - ', result);
        // if successful, save the S3 location bucket in DB
        let split = result.Key.split('/');
        const email = split[0];
        const responseFromUpdateFile = await updateFile("CONTRACTOR", email, result);

        res.json(JSON.stringify(responseFromUpdateFile));
    } catch (e) {
        console.log('entered', e);
        res.status(400).json(JSON.stringify(e));
    }
}