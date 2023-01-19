import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    registrationType:{
      type: String
    },
    type: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String
    },
    about: {
      type: String,
    },
    studioName: {
      type: String,
    },
    paymentTerms: {
      type: String,
    },
    additionalCost: {
      type: String,
    },
    experience: {
      type: String,
    },
    siteUrl: {
      type: String,
    },
    fbUrl: {
      type: String,
    },
    instaUrl: {
      type: String,
    },
    youtubeUrl: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    city: {
      type: Array,
    },
    state: {
      type: Array,
    },
    landmark: {
      type: String,
    },
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    vendorPictures: {
      type: Array
    },
    likedCustomers: {
      type: Array,
      default: []
    },
    customerRatings: {
      type: [Object],
      default: [{}]
    },
    services: [Object],
    packages: [Object],
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("vendor", vendorSchema);
export default Vendor;
