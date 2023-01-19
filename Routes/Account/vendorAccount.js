import express from "express";
import multer from "multer";
import {
  customerLikeOrUnlike,
  deleteVendorPhotos,
  getAllVendors,
  getPhoto,
  getVendorProfile,
  updateVendorProfile,
  uploadVendorCover,
  uploadVendorPhotos,
  uploadVendorProfile,
  vendorFacebookLogin,
  vendorFacebookRegistration,
  vendorGoogleLogin,
  vendorGoogleRegitration,
  vendorLogin,
  vendorRegistration,
  registerOtpSend
} from "../../Controllers/Account/vendorAccount.js";
import {customerAuthentication, vendorAuthentication} from "../../Middlewares/authentication.js";
import authorization from "../../Middlewares/authorization.js";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post("/account/vendor/send-register-otp/:number", registerOtpSend);
router.post("/account/vendor/registration", vendorRegistration);
router.post("/account/vendor/login", vendorLogin);
router.post(
  "/account/vendor/google-register/:tokenId",
  vendorGoogleRegitration
);
router.post("/account/vendor/google-login", vendorGoogleLogin);
router.post("/account/vendor/facebook-register", vendorFacebookRegistration);
router.post("/account/vendor/facebook-login", vendorFacebookLogin);
router.put(
  "/account/vendor/update-profile/:token",
  vendorAuthentication,
  authorization("photographer"),
  updateVendorProfile
);
router.get("/account/vendor/get-allprofiles", getAllVendors);
router.get("/account/vendor/get-profile/:id", getVendorProfile);
router.put(
  "/account/vendor/upload-profile-photo/:token",
  vendorAuthentication,
  authorization("photographer"),
  upload.single("file"),
  uploadVendorProfile
);
router.get("/account/vendor/get-profile-photo/:id", getPhoto);
router.put(
  "/account/vendor/upload-cover-photo/:token",
  vendorAuthentication,
  authorization("photographer"),
  upload.single("file"),
  uploadVendorCover
);
router.put(
  "/account/vendor/upload-pictures/:token",
  vendorAuthentication,
  authorization("photographer"),
  upload.array("files", 100),
  uploadVendorPhotos
);
router.put(
  "/account/vendor/delete-picture/:token",
  vendorAuthentication,
  authorization("photographer"),
  deleteVendorPhotos
);
router.put("/account/vendor/like-unlike/:token", customerAuthentication, authorization("customer"), customerLikeOrUnlike);
export default router;