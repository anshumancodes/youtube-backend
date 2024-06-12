const asyncHandler =(func)=>{
    // Higher order function->

    
    async(req,res,next)=>{
        try {
            await func((req,res,next));
            // executes the function!
        } catch (error) {
            // throws error and false success flag to client side
            res.status(error.code || 500).json({
                success :false,
                message:error.message
            
            }
            )
            
        }
    }
}