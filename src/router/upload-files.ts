import express from "express";

import {uploadFiles} from "../controllers/upload-files";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.post('/upload', verifyToken, uploadFiles);

}