import { v2 as cloudinary } from 'cloudinary';
import fs from fs;



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
        
        // returns user with upload url
        return uploadDetails.url;


        } catch (error) {
            fs.unlinkSync(filePath) //remove local file from our server to enable reupload!
            return null


            
        }
    }

export {uploadOnCloud}