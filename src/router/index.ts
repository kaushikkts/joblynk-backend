import express from "express";


import contractorRoutes from "./contractor-routes";
import servicePartnerRoutes from "./service-partner-routes";
const router = express.Router();

export default ():express.Router => {
    contractorRoutes(router);
    servicePartnerRoutes(router);
    return router;
}