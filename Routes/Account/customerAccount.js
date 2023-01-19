import express from "express";
import multer from "multer";
import {
  //   getAllcustomers,
  // getcustomerPhotos,
  getCustomerProfilePhoto,
  uploadCustomerProfilePhoto,
  getCustomerProfile,
  updateCustomerProfile,
  CustomerFacebookLogin,
  CustomerFacebookRegistration,
  CustomerGoogleLogin,
  CustomerGoogleRegitration,
  CustomerLogin,
  CustomerRegistration,
} from "../../Controllers/Account/customerAccount.js";
import {customerAuthentication} from "../../Middlewares/authentication.js";
import authorization from "../../Middlewares/authorization.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.post("/account/customer/registration", CustomerRegistration);
router.post("/account/customer/login", CustomerLogin);
router.post(
  "/account/customer/google-register/:tokenId",
  CustomerGoogleRegitration
);
router.post("/account/customer/google-login", CustomerGoogleLogin);
router.post(
  "/account/customer/facebook-register",
  CustomerFacebookRegistration
);
router.post("/account/customer/facebook-login", CustomerFacebookLogin);

router.put(
  "/account/customer/update-profile/:token",
  customerAuthentication,
  authorization("customer"),
  updateCustomerProfile
);
router.get("/account/customer/get-profile/:id", getCustomerProfile);
router.put(
  "/account/customer/upload-profile-photo/:token",
  customerAuthentication,
  authorization("customer"),
  upload.single("file"),
  uploadCustomerProfilePhoto
);
router.get("/account/customer/get-profile-photo/:id", getCustomerProfilePhoto);

export default router;

//   router.get("/account/customer/get-allprofiles", getAllcustomers);
