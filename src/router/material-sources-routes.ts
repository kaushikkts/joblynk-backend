import express from "express";
import {
    createNewSource, deleteSource,
    findAllMaterialAndSources, updateSource
} from "../controllers/material-sources";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.get('/material-sources/getAllMaterialSources/:contractorId',verifyToken, findAllMaterialAndSources);
    router.post('/material-sources/createNewSource', createNewSource);
    router.put('/material-sources/update',verifyToken, updateSource);
    router.delete('/material-sources/delete',verifyToken, deleteSource);

}