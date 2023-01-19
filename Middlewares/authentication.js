import jwt from 'jsonwebtoken';
import Customer from '../Models/Account/customerAccount.js';
import Vendor from "../Models/Account/vendorAccount.js";

export const vendorAuthentication = async (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) {
          return res.json({success: false, msg:"Please login for access this resource"})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Vendor.findById(decode.id);
        next();
    } catch (err) {
        return res.json({success: false, msg:"Authentication Failed", err: err});
    }  
}

export const customerAuthentication = async (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) {
          return res.json({success: false, msg:"Please login for access this resource"})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Customer.findById(decode.id);
        // console.log(req.user);
        next();
    } catch (err) {
        return res.json({success: false, msg:"Authentication Failed", err: err});
    }  
}