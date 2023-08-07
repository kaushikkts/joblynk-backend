import express from "express";
import {
    createNewSource, deleteSource,
    findAllMaterialAndSources, updateSource
} from "../controllers/material-sources";

export default (router: express.Router) => {
    router.get('/material-sources/getAllMaterialSources/:contractorId', findAllMaterialAndSources);
    router.post('/material-sources/createNewSource', createNewSource);
    router.put('/material-sources/update', updateSource);
    router.delete('/material-sources/delete', deleteSource);

}