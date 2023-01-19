import fetch from "node-fetch";
import bcrypt from "bcryptjs";

import generateOTP from "../../Utils/sendOtp.js";
import Otp from "../../Models/Account/otp.js";
import Vendor from "../../Models/Account/vendorAccount.js";
import Customer from "../../Models/Account/customerAccount.js";
import { vendorRegistration } from "./vendorAccount.js";
import { CustomerRegistration } from "./customerAccount.js";

export const forgetPassword = async (req, res) => {
  const to = req.params.number;
  const userType = req.body.type;
  const msg = process.env.FORGET_PASSWORD_MESSAGE;
  const template_id = process.env.DLT_PASSWORD_RESET;
  const otpType = "reset";
  try {
    return await generateOTP(to, msg, template_id, userType, otpType, req, res);
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};

export const verifyOTP = async (req, res) => {
  const otp = req.params.otp;
  const mobile = req.body.mobile;
  try {
    const mobileOtps = await Otp.find({ mobile });
    let otpFind = mobileOtps.filter((otps) => otps.verified == false);
    let n = otpFind.length
    console.log(otpFind[n-1]);
    
    if (otpFind[n-1] == undefined)
      return res.json({
        success: false,
        msg: "Otp didn't sent to this number",
      });
    if (otpFind[n-1].otp == otp) {
      const verified = true;
      await Otp.findByIdAndUpdate({ _id: otpFind[n-1]._id }, { verified });
      if (otpFind[n-1].otpType == "register") {
        if (otpFind[n-1].userType == "photographer") {
          return await vendorRegistration(req, res);
        }
        if (otpFind[n-1].userType == "customer") {
          return await CustomerRegistration(req, res);
        }
      }
      return res.json({ success: true, msg: "OTP Verified" });
    }
    console.log(otpFind[n-1].otp, otp);
    if (otpFind[n-1].otp != otp)
      return res.json({ success: false, msg: "Please Enter Correct Otp" });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};

export const resetPassword = async (req, res) => {
  const mobile = req.params.number;
  let password = req.body.password;
  const userType = req.body.type;
  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    if (userType == "photographer") {
      const user = await Vendor.findOne({ mobile });
      await Vendor.findByIdAndUpdate({ _id: user._id }, { password });
      const vendor = await Vendor.findById(user._id);
      return res.json({
        success: true,
        msg: "Password Resetted Successfully",
        vendor: vendor,
      });
    }
    if (userType == "customer") {
      const user = await Customer.findOne({ mobile });
      console.log(user, "customer");
      await Customer.findByIdAndUpdate({ _id: user._id }, { password });
      const customer = await Customer.findById(user._id);
      return res.json({
        success: true,
        msg: "Password Resetted Successfully",
        customer: customer,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};
