import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { asyncHandler } from './asyncHandler.js';



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
    });
    
    // Upload an image
    const uploadOnCloud=async (filePath) =>{
        try {
           if(!filePath)  return null;

           const uploadResponse=await cloudinary.uploader.upload(filePath,{resource_type:'auto'})


        //    if file uploaded sucessfully!

        // upload details ;

        const uploadDetails={
            FileName:uploadResponse.original_filename,
            public_id:uploadResponse.public_id,
            url:uploadResponse.url
        }
        console.log(" file uploaded sucessfully! ",uploadDetails);
        fs.unlinkSync(filePath);
        
        // returns user with upload url
        return uploadDetails.url;


        } catch (error) {
            fs.unlinkSync(filePath) //remove local file from our server to enable reupload!
            return null


            
        }
    }
    const uploadVideo=async (filePath) =>{
        try {
           if(!filePath)  return null;

           const uploadResponse=await cloudinary.uploader.upload(filePath,{resource_type:'video'})


        //    if file uploaded sucessfully!

        // upload details ;

        const uploadDetails={
            FileName:uploadResponse.original_filename,
            public_id:uploadResponse.public_id,
            url:uploadResponse.url,
            duration:uploadResponse.duration,

        }
        console.log(" file uploaded sucessfully! ",uploadDetails);
        fs.unlinkSync(filePath);
        
        // returns user with upload url
        return uploadDetails;


        } catch (error) {
            fs.unlinkSync(filePath) //remove local file from our server to enable reupload!
            return null


            
        }
    }

    const deleteOldUploadOnUpdate=asyncHandler(async(fileurloncloud)=>{
        try {
            const publicId = fileurloncloud.split('/').slice(-1)[0].split('.')[0];
            const result = await cloudinary.uploader.destroy(publicId);

            return result;
        } catch (error) {

            return error;
            
        }

       
    });


export {uploadOnCloud,deleteOldUploadOnUpdate,uploadVideo};