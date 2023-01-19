import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import bcrypt from "bcryptjs";

import Customer from "../../Models/Account/customerAccount.js";
import { generateToken } from "../../Utils/jwtToken.js";
import { downloadFile, uploadfile, uploadfiles } from "../../Utils/s3Bucket.js";

const client = new OAuth2Client(
  "1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com"
);

// Registration Start
export const CustomerRegistration = async (req, res) => {
  try {
    let { name, password, mobile, email } = req.body;
    let findEmail = await Customer.findOne({ email });
    let findMobile = await Customer.findOne({ mobile });
    if (findEmail || findMobile) {
      if (findEmail && findMobile)
        return res.json({
          success: false,
          msg: "Email And Mobile Number Already Exist",
        });
      if (findEmail)
        return res.json({ success: false, msg: "Email Already Exist" });
      if (findMobile)
        return res.json({ success: false, msg: "Mobile Number Already Exist" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const registrationType = "manual";
    const type = "customer";
    let user = await new Customer({
      name,
      password,
      mobile,
      email,
      type,
      registrationType,
    });
    await user.save();
    // user = user.toObject();
    // delete user.password;
    const logintoken = { id: user._id };
    const token = await generateToken(logintoken);
    console.log(token);
    return res.json({
      success: true,
      user: user,
      token: token,
      msg: "Regtration Success",
    });
  } catch (err) {
    return res.json({ success: false, msg: "Something Went Wrong", err: err });
  }
};
//Registration End

//Login Start
export const CustomerLogin = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const user = await Customer.findOne({ mobile });
    if (!user)
      return res.json({
        success: false,
        msg: "Mobile Not Found, Please Register",
      });
    if (user.registrationType !== "manual")
      return res.json({
        success: false,
        msg:
          "you are registered on " +
          user.registrationType +
          " so please login with " +
          user.registrationType,
      });
    const passwordcrct = await bcrypt.compare(password, user.password);
    console.log(passwordcrct, "passwordMatch");
    if (!passwordcrct)
      return res.json({ success: false, msg: "Incorrect Password" });
    const logintoken = { id: user._id };
    const token = await generateToken(logintoken);
    // user = user.toObject();
    // delete user.password;
    return res.json({
      success: true,
      msg: "Login Success",
      token: token,
      user: user,
    });
  } catch (err) {
    return res.json({ success: false, msg: "Something Went Wrong", err: err });
  }
};
// Login End

// Google Registration Start
export const CustomerGoogleRegitration = async (req, res, next) => {
  const { tokenId } = req.params;
  try {
    const { payload } = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com",
    });
    if (!payload.email_verified) return res.json({ success: false, msg: "Email verification failed" });
    const email = payload.email;
    const name = payload.name;
    const findEmail = await Customer.findOne({ email });
    if (findEmail) return res.json({ success: false, msg: "Account Already Exist" });
    const registrationType = "google";
    const type = "customer";
    let user = await new Customer({ name, email, type, registrationType });
    await user.save();
    const logintoken = { id: user._id };
    const token = await generateToken(logintoken);
    return res.json({
      success: true,
      user: user,
      token: token,
      msg: "Google Registration Success",
    });
  } catch (err) {
    return res.json({ success: false, msg: "Something Went Wrong", err: err });
  }
};
// Google Registration End

// Google Login Start
export const CustomerGoogleLogin = async (req, res, next) => {
  const { tokenId } = req.body;
  try {
    const { payload } = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "1044646467235-3qsh4khsql66k1v9p6nuh6h5476gd09j.apps.googleusercontent.com",
    });
    if (!payload.email_verified) return res.json({ success: false, msg: "Email Verification Failed" });
    const email = payload.email;
    const user = await Customer.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        msg: "Account Not Found, Please Register",
      });
    if (user.registrationType !== "google")
      return res.json({
        success: false,
        msg:
          "you are registered on " +
          user.registrationType +
          " so please login with " +
          user.registrationType,
      });
    const logintoken = { id: user._id };
    const token = await generateToken(logintoken);
    return res.json({
      success: true,
      user: user,
      token: token,
      msg: "Google Login Success",
    });
  } catch (error) {
    return res.json({ success: false, msg: "something went wrong", err: error });
  }
};
// Google Login End

// Facebook Registration Start
export const CustomerFacebookRegistration = async (req, res, next) => {
  const { accessToken, userId } = req.body;
  try {
    const urlGraphFb = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
    fetch(urlGraphFb, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => { fb(response); });
    const fb = async (response) => {
      const { email, mobile, name } = response;
      console.log(email, name, mobile);
      const findEmail = Customer.findOne({ email });
      const findMobile = Customer.findOne({ mobile });
      if (findEmail)
        return res.json({ success: false, msg: "Account Already Exist", findEmail });
      const type = "customer";
      const registrationType = "facebook";
      let user = await new Customer({ name, email, mobile, type, registrationType });
      await user.save();
      const logintoken = { id: user._id };
      const token = await generateToken(logintoken);
      console.log(token);
      return res.json({
        success: true,
        msg: "Facebook Registration Success",
        user: user,
        token: token,
      });
    }
  } catch (error) {
    return res.json({ suceess: false, msg: "something went wrong", err });
  }
};

// Facebook Registration End

// Facebook Login Start
export const CustomerFacebookLogin = async (req, res, next) => {
  const { accessToken, userId } = req.body;
  try {
    const urlGraphFb = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,email&access_token=${accessToken}`;
    fetch(urlGraphFb, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        fb(response);
      });
    const fb = async (response) => {
      const { email, mobile, name } = response;
      let findEmail = await Customer.findOne({ email });
      console.log(findEmail);
      const findMobile = Customer.findOne({ mobile });
      const userEmail = await Customer.findOne({ email });
      const userMobile = await Customer.findOne({ mobile });
      if (!userEmail)
        return res.json({
          success: false,
          msg: "Account Not Found Plaese Register",
        });
      let loginToken;
      if (userEmail) loginToken = { id: userEmail._id };
      if (userMobile) loginToken = { id: userMobile._id };
      console.log(userEmail);
      const token = await generateToken(loginToken);
      if (userEmail.registrationType !== "facebook")
        return res.json({
          success: false,
          msg:
            "you are registered on " +
            userEmail.registrationType +
            " so please login with " +
            userEmail.registrationType,
        });
      if (userEmail)
        return res.json({
          success: true,
          msg: "Facebook Login Success",
          token: token,
          user: userEmail,
        });
      if (userMobile)
        return res.json({
          success: true,
          msg: "Facebook Login Success",
          token: token,
          user: userMobile,
        });
    };
  } catch (error) {
    return res.json({ success: false, msg: "something went wrong", err });
  }
};
// Facebook Login End

// Get Specific Customer Profile by Id Start
export const getCustomerProfile = async (req, res, next) => {
  const id = req.params.id;
  console.log(id, 'id');
  try {
    let customer = await Customer.findById(id);
    if (!customer) return res.json({ success: false, msg: "Customer Not Found" });
    // Customer = Customer.toObject();
    // Customer = delete Customer.password;
    // Customer = delete Customer.type;
    // Customer = delete Customer.registrationType;
    return res.json({ success: true, customer: customer });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something went worng",
      err: error,
    });
  }
};
// Get Specific Customer Profile By Id End

// update Customer Profile Start
export const updateCustomerProfile = async (req, res, next) => {
  const id = req.user.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer)
      return res.json({ success: false, msg: "Customer Profile Not Found" });
    await Customer.findByIdAndUpdate({ _id: id }, { $set: req.body });
    const cus = await Customer.findById(id);
    return res.json({ success: true, customer: cus, msg: "Profile Updated" });
  } catch (error) {
    return res.json({
      success: false,
      msg: "something went wrong",
      err: error,
    });
  }
};
// update Customer Profile End

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    // let allCustomers = [];
    // for (var i = 0; i < allCustomers.length; i++) {
    //   let ven = Customers[i].toObject;
    //   delete ven.password;
    //   delete ven.type;
    //   delete ven.registrationType;
    //   allCustomers.push(ven);
    // }
    // console.log(users);
    return res.json({ success: true, customers: customers });
  } catch (error) {
    return res.json({ success: false, msg: "something went wrong", err: error });
  }
};

export const uploadCustomerProfilePhoto = async (req, res, next) => {
  const file = req.file;
  const id = req.user._id;
  console.log('file start', file, 'file end');
  try {
    const result = await uploadfile(file);
    const profilePicture = result.Key;
    console.log(profilePicture);
    await Customer.findByIdAndUpdate({ _id: id }, { profilePicture });
    const cus = await Customer.findById(id);
    return res.json({
      success: true,
      msg: "Profile Photo Uploaded Successfully",
      customer: cus
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: "something went wrong",
      error: error,
    });
  }
};

export const getCustomerProfilePhoto = async (req, res, next) => {
  try {
    const key = req.params.id;
    console.log(key, "key");
    if (key != "undefined") {
      const readStream = await downloadFile(key);
      return await readStream.pipe(res);
    } else {
      return console.log(key);
    }
  } catch (error) {
    return req.json({
      success: false,
      msg: "Something went wrong",
      error: error,
    });
  }
};