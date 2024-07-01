import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        

    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
        

    },
    avatar:{
        type:String, //cloud service url
        required:true,
    }
    ,coverImage:{
        type:String, //cloud service url
    }
    ,
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,'password required']

    },
    refreshToken:{
        type:String
    }

},{timestamps:true});

// password encryption before saving the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); // prevents hashing if password isnt modified !
    
    // if password is modfied saves new password with encryption
    this.password = await bcrypt.hash(this.password,10);
    next()
})


// compares password
userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
   return Jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACESS_SECRET_KEY,{expiresIn:process.env.ACESS_TOKEN_EXPIRY}
    )
}
userSchema.methods.generateRefreshToken=function(){
    return Jwt.sign({
        _id:this._id,
        
    },
    process.env.REFRSH_TOKEN_KEY,{expiresIn:process.env.REFRSH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User",userSchema)

