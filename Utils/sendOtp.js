// import res from "express/lib/response";
import fetch from "node-fetch";
import Customer from "../Models/Account/customerAccount.js";
import Otp from "../Models/Account/otp.js";
import Vendor from "../Models/Account/vendorAccount.js";

const generateOTP = async (to, msg, template_id, userType, otpType, req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const key = process.env.API_KEY;
  const sender = process.env.SENDER;
  const message = otp + " " + msg;
  const mobile = to;
  const email = req.body.email;
  // console.log(email, 'email');
  try {
    console.log(otp);
    if (otpType === "reset") {
      let findUser;
      if (userType == "photographer") {
        findUser = await Vendor.findOne({ mobile });
      }
      if (userType == "customer") {
        findUser = await Customer.findOne({ mobile });
      }
      if (!findUser) {
        return res.json({
          success: false,
          msg: "Account doesn't exist please register",
        });
      }
    }
    if (otpType === "register") {
      let findUserByMobile;
      let findUserByEmail;
      if (userType == "photographer") {
        findUserByMobile = await Vendor.findOne({ mobile });
        findUserByEmail = await Vendor.findOne({ email });
        // console.log(findUserByEmail);
      }
      if (userType == "customer") {
        findUserByMobile = await Customer.findOne({ mobile });
        findUserByEmail = await Customer.findOne({ email });
      }
      if (findUserByMobile) {
        return res.json({
          success: false,
          msg: "Mobile Already Exist",
        });
      }
      if (findUserByEmail) {
        return res.json({
          success: false,
          msg: "Email Already Exist",
        });
      }
    }
    // return;
    const sendOtp =
      "http://thesmsbuddy.com/api/v1/sms/send?key=" +
      key +
      "&type=1&to=" +
      to +
      "&sender=" +
      sender +
      "&message=" +
      message +
      "&flash=0&template_id=" +
      template_id;
    fetch(sendOtp, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((response) => {
        otpResponse(response, otp, mobile, userType, otpType, res);
      });
    const otpResponse = async (
      response,
      otp,
      mobile,
      userType,
      otpType,
      res
    ) => {
      if (response.status == "200") {
        console.log(otp);
        const newOtp = await new Otp({
          otp,
          mobile,
          otpType,
          userType,
        });
        console.log(newOtp);
        await newOtp.save();
        return res.json({ success: true, msg: "Otp Sent Successfully" });
      } else {
        return res.json({ success: false, msg: response });
      }
    };
  } catch (error) {
    return console.log("errorPrint", error);
  }
};

export default generateOTP;
