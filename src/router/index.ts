import express from "express";


import contractorRoutes from "./contractor-routes";
import servicePartnerRoutes from "./service-partner-routes";
import materialSourcesRoutes from "./material-sources-routes";
import subcontractorRoutes from "./subcontractor.routes";
import authentication from "./authentication";
import ses from "./amazon-ses";
import uploadFilesToS3 from './upload-files';
import employeesRoutes from "./employees.routes";
const router = express.Router();

export default ():express.Router => {
    contractorRoutes(router);
    servicePartnerRoutes(router);
    materialSourcesRoutes(router);
    subcontractorRoutes(router);
    authentication(router);
    ses(router);
    uploadFilesToS3(router);
    employeesRoutes(router);

    return router;
}