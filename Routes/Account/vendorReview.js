import express from "express";

import { createReplay, createReview, getReview } from "../../Controllers/Account/vendorReview.js";
import {customerAuthentication, vendorAuthentication} from "../../Middlewares/authentication.js";
import authorization from "../../Middlewares/authorization.js";

const router = express.Router();

router.post('/create-review/:token', customerAuthentication, authorization("customer"), createReview);
router.get('/get-review/:vendorId', getReview);
router.put('/create-replay/:token', vendorAuthentication, authorization("photographer"), createReplay);

export default router;