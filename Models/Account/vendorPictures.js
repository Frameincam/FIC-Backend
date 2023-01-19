import mongoose from "mongoose";

const vendorPictureSchema = new mongoose.Schema(
    {
        vendorId: {
            type: String,
        },
        vendorsPictures: {
            type: Array,
        }
    }
);

const VendorPictures = mongoose.model("vendorPictures", vendorPictureSchema);
export default VendorPictures;