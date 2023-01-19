import dotenv from "dotenv";
import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";
// import {cwebp} from "webp-converter";
// import ErrorHandler from './errorHandler.js';
import sharp from "sharp";

dotenv.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// Upload a file to S3
export const uploadfile = async (file) => {
  try {
    const result = await sharp(file.path)
      .webp({ quality: 50 })
      .toFile(`${file.filename}.webp`);
    let fileStream = fs.createReadStream(`./${file.filename}.webp`);
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return await s3.upload(uploadParams).promise();
  } catch (error) {
    console.log("error start", error, "error end");
    return res.json({
      success: false,
      msg: "something went wrong",
      err: error,
    });
  }
};

// Get a file to S3
export const downloadFile = async (fileKey) => {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return await s3.getObject(downloadParams).createReadStream();
  } catch (error) {
    return res.json({
      success: false,
      msg: "something went wrong",
      err: error,
    });
  }
};

export const uploadfiles = async (files) => {
  try {
    const picArray = [];
    for (var i = 0; i < files.length; i++) {
      const result = await sharp(files[i].path)
        .webp({ quality: 80 })
        .toFile(`${files[i].filename}.webp`);
      let fileStream = fs.createReadStream(`./${files[i].filename}.webp`);
      const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: files[i].filename,
      };
      const s = await s3.upload(uploadParams).promise();
      picArray.push(s);
    }
    return picArray;
  } catch (error) {
    return res.json({
      success: false,
      msg: "something went wrong",
      err: error,
    });
  }
};
