import Vendor from "../../Models/Account/vendorAccount.js";
import VendorVideoUrl from "../../Models/Account/vendorVideoUrl.js";

export const vendorVideoUrlUpload = async (req, res) => {
  const vendorId = req.user._id;
  const videoUrls = req.body.videoUrl;
  try {
    const vendorFind = await Vendor.findById(vendorId);
    if (!vendorFind)
      return res.json({
        success: false,
        msg: "Account Not Found, Please Register",
      });
    const vendorVideosFind = await VendorVideoUrl.find({vendorId});
    console.log(vendorId, 'id')
    console.log(vendorVideosFind.length, "length");
    if (vendorVideosFind.length < 1) {
      console.log("one");
      const urls = await new VendorVideoUrl({
        vendorId: vendorId,
        vendorsVideoUrl: videoUrls,
      });
      console.log(urls, "urls");
      await urls.save();
    }
    if (vendorVideosFind.length > 0) {
      let vendorsVideoUrl = vendorVideosFind[0].vendorsVideoUrl;
      vendorsVideoUrl.push(videoUrls);
      console.log(vendorsVideoUrl);

      await VendorVideoUrl.findByIdAndUpdate(
        { _id: vendorVideosFind[0]._id },
        { vendorsVideoUrl }
      );
    }
    const venVideoUrl = await VendorVideoUrl.find({vendorId});
    return res.json({
      success: true,
      vendorVideoUrl: venVideoUrl[0].vendorsVideoUrl,
      msg: "Video Url Update Successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};

export const vendorVideoUrlGet = async (req, res) => {
  const vendorId = req.params.id;
  try {
    console.log(vendorId, 'vendodrId');
    const vendorVideosUrls = await VendorVideoUrl.find({vendorId});
    console.log(vendorVideosUrls, 'vendor');
    if (!vendorVideosUrls)
      return res.json({ success: false, msg: "Don't have an any videos" });
    return res.json({
      success: true,
      vendorVideoUrl: vendorVideosUrls,
      msg: "Video Url Sended SuccessFully",
    });
  } catch (error) {
    return res.json({
      success: false,
      msg: "Something Went Wrong",
      error: error,
    });
  }
};

export const vendorVideoUrlDelete = async (req, res) => {
  const vendorId = req.user._id;
  const removeVideoUrl = req.body.url;
  try {
    console.log(removeVideoUrl)
    const vendorVideosUrlsFind = await VendorVideoUrl.find({vendorId});
    console.log(vendorVideosUrlsFind);
    const vendorsVideoUrl = vendorVideosUrlsFind[0].vendorsVideoUrl.filter(
      (venVideo) => venVideo != removeVideoUrl
    );
    console.log(vendorsVideoUrl, 'videos');
    await VendorVideoUrl.findByIdAndUpdate(
      { _id: vendorVideosUrlsFind[0]._id },
      { vendorsVideoUrl }
    );
    const venVideoUrl = await VendorVideoUrl.find({vendorId});
    return res.json({
      success: true,
      vendorVideoUrl: venVideoUrl[0].vendorsVideoUrl,
      msg: "Video Delete Successfully",
    });
  } catch (error) {
    return res.json({ success: false, msg: "something Went Wrong" });
  }
};
