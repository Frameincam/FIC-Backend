import mongoose from "mongoose";

const vendorVideoUrlSchema = new mongoose.Schema(
    {
        vendorId: {
            type: String,
        },
        vendorsVideoUrl: {
            type: Array,
            default: []
        }
    }
);

const VendorVideoUrl = mongoose.model("vendorVideoUrl", vendorVideoUrlSchema);
export default VendorVideoUrl;