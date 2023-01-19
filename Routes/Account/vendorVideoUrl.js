import express from "express";
import {
  vendorVideoUrlDelete,
  vendorVideoUrlGet,
  vendorVideoUrlUpload,
} from "../../Controllers/Account/vendorVideoUrl.js";

import { vendorAuthentication } from "../../Middlewares/authentication.js";
import authorization from "../../Middlewares/authorization.js";

const router = express.Router();

router.post(
  "/vendor/create-videos/:token",
  vendorAuthentication,
  authorization("photographer"),
  vendorVideoUrlUpload
);
router.get("/vendor/video-url-get/:id", vendorVideoUrlGet);
router.put(
  "/vendor/delete-videos/:token",
  vendorAuthentication,
  authorization("photographer"),
  vendorVideoUrlDelete
);

export default router;
