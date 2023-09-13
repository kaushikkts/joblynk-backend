import express from "express";

import {uploadContractorFiles, uploadFiles} from "../controllers/upload-files";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.post('/upload/subcontractor', verifyToken, uploadFiles);
    router.post('/upload/contractor', verifyToken, uploadContractorFiles);

}