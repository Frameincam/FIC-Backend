import VendorReviews from "../../Models/Account/vendorReview.js";

export const createReview = async (req, res) => {
  const customerId = req.user._id;
  const customerName = req.user.name;
  const customerEmail = req.user.email;
  const customerProfilePic = req.user.profilePicture;
  const { vendorId, customerReview, customerRating } = req.body;
  try {
    console.log(vendorId);
    const rev = await new VendorReviews({
      vendorId,
      customerId,
      customerName,
      customerEmail,
      customerProfilePic,
      customerReview,
      customerRating
    });
    await rev.save();
    const venReview = await VendorReviews.find({vendorId}); 
    return res.json({
      success: true,
      review: venReview,
      msg: "Review Posted Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};

export const getReview = async (req, res) => {
  const vendorId = req.params.vendorId;
  try {
    const review = await VendorReviews.find({ vendorId });
    return res.json({ success: true, review: review });
  } catch (error) {
    res.json({ success: false, msg: "Something Went Wrong", error: error });
  }
};

export const createReplay = async (req, res) => {
  const vendorId = req.user.id;
  const id = req.body.id;
  const reply = req.body.reply;
  try {
    const review = await VendorReviews.findById(id);
    if (review.vendorId != vendorId)
      return res.json({
        success: false,
        msg: "you don't have permission to replay this review",
      });
      console.log(reply)
    await VendorReviews.findByIdAndUpdate({ _id: id }, { reply });
    const rev = await VendorReviews.find({ vendorId });
    return res.json({success: true, msg: "Reply Success", reviews: rev})
  } catch (error) {
    return res.json({
      success: false,
      msg: "something went wrong",
      error: error,
    });
  }
};


// Vendor Rating Start
// export const vendorRating = async (req, res) => {
//   const customerId = req.user._id;
//   const id = req.body.vendorId;
//   const rating = req.body.rating;
//   try {
//     const vendorFind = await Vendor.findById(id);
//     if (!vendorFind)
//       return res.json({ success: false, msg: "Account Not Found" });
//     const ratings = vendorFind.customerRatings;
//     const vendorRatings = ratings.filter(
//       (rate) => rate.customerId != customerId
//     );
//     vendorRatings.push({ customerId, rating });
//     await Vendor.findByIdAndUpdate({ _id: id }, { vendorRatings });
//     return res.json({
//       success: true,
//       msg: " Successfully",
//       vendorRating: vendorRatings,
//     });
//   } catch (error) {
//     return res.json({
//       success: false,
//       msg: "something went wrong",
//       err: error,
//     });
//   }
// };
// Vendor Rating End