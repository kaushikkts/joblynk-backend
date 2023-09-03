import express from "express";
import { S3Client }  from '@aws-sdk/client-s3';
import formidable, {IncomingForm} from 'formidable';

import multer from 'multer';
import multerS3 from 'multer-s3';
import {S3} from "aws-sdk";
import * as fs from "fs";

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

    // const form = new IncomingForm();
    console.log(req.body);
    try {
        const form = await formidable({allowEmptyFiles: false});
        const [files, fields] = await form.parse(req);

        console.log(Object.keys(fields)[0]);
        const fileName = Object.keys(fields)[0];
        const filePath = fields[fileName][0].filepath;
        const readFile = await fs.readFileSync(filePath);
        // console.log(readFile);
        const result = await bucket.upload({Body: readFile, Key: fileName, Bucket: 'joblynk-subcontractor-documents'}).promise();
        console.log(result)
        // if successful, save the S3 location bucket in DB
        res.json('testing');
    } catch (e) {
        console.log('entered', e);
        res.status(400).json(JSON.stringify(e));
    }

    // upload(req, res, () => {
    //     res.json('uploaded')
    // })
}