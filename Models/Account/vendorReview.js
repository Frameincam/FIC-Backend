import mongoose from "mongoose";

const opts = {
  // Make Mongoose use Unix time (seconds since Jan 1, 1970)
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const vendorReviewSchema = new mongoose.Schema({
  vendorId: {
    type: String,
  },
  customerId: {
    type: String,
  },
  customerName: {
    type: String,
  },
  customerEmail: {
    type: String,
  },
  customerProfilePic: {
    type: String,
  },
  customerReview: {
    type: String,
  },
  customerRating: {
    type: String,
  },
  reply: {
    type: String,
  },
},
{
  timestamps: true,
});

const VendorReviews = mongoose.model("vendorReviews", vendorReviewSchema);
export default VendorReviews;

// import mongoose from "mongoose";

// const vendorReviewSchema = new mongoose.Schema({
//   vendorId: {
//     type: String,
//   },
//   review: {
//     customer: [
//       {
//         customerId: {
//           type: String,
//         },
//         customerName: {
//           type: String,
//         },
//         customerEmail: {
//           type: String,
//         },
//         customerProfilePic: {
//           type: String,
//         },
//         msg: {
//           type: String,
//         },
//       },
//       {
//         timestamps: true,
//       },
//     ],
//     vendor: [
//       {
//         replay: {
//           type: String,
//         },
//       },
//       {
//         timestamps: true,
//       },
//     ],
//   },
// });

// const VendorReviews = mongoose.model("vendorReviews", vendorReviewSchema);
// export default VendorReviews;
