import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    registrationType: {
      type: String,
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
    pincode: {
      type: Number,
    },
    city: {
      type: Array,
    },
    state: {
      type: Array,
    },
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("customer", customerSchema);
export default Customer;
