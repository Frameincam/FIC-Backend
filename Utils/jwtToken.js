import jwt from "jsonwebtoken";

export const generateToken = (logintoken) =>{
    return jwt.sign(logintoken, process.env.JWT_SECRET ,{
        expiresIn: process.env.JWT_TOKEN_EXPIRES_TIME,
    });
}
