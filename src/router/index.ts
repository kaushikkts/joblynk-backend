import express from "express";


import contractorRoutes from "./contractor-routes";
import servicePartnerRoutes from "./service-partner-routes";
import materialSourcesRoutes from "./material-sources-routes";
import subcontractorRoutes from "./subcontractor.routes";
import authentication from "./authentication";
const router = express.Router();

export default ():express.Router => {
    contractorRoutes(router);
    servicePartnerRoutes(router);
    materialSourcesRoutes(router);
    subcontractorRoutes(router);
    authentication(router);
    return router;
}