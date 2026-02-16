import { v2 as cloudinary } from "cloudinary"


cloudinary.config(
    {
        cloud_name: process.env.Cloudinary_CloudName,
        api_key: process.env.Cloudinary_APIKey,
        api_secret: process.env.Cloudinary_APISecret,

    }
);


export default cloudinary;
