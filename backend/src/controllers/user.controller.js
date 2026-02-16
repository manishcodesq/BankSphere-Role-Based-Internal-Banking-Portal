import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {ApiResponse} from '../utils/apiResponse.js';

const accessTokens= async(userId) => {
    try{
        const user = await User.findById(userId);
            if(!user)
            {
                throw new ApiError('User not found', 404);
            }
            const accessToken = user.generateAccessToken();
            return accessToken;
        }
    
    catch(error){
         throw new ApiError('Failed to generate access token', 500);
    }
}

const registerUser=asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    console.log("email: ", email);

    if ([name, email, password].some(
    (field) => !field || field.trim() === ""
)) {
    throw new ApiError(400, "All fields are required");
}

   const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() }, { name: name.toLowerCase() }
    ]
   })

   if(existingUser)
   {
    throw new ApiError('User with the same email or name already exists', 409);
   }
console.log(req.body);
   const user = await User.create({name, email, password})

   const createdUser = await User
    .findById(user._id)
    .select("-password");

   if(!createdUser)
   {
    throw new ApiError('User registration failed, please try again', 500);
   }

   return res.status(201).json(
    new ApiResponse(201, 'User registered successfully', createdUser)
   )

        
});

const loginUser=asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if ( !email || !password) {
    throw new ApiError(400, "Email and password are required");
}

const user = await User.findOne({
    $or: [{email: email.toLowerCase()}, {password}]
});

if(!user)
{
    throw new ApiError('Invalid email or password', 401);
}   
const isMatch = await user.isPasswordMatch(password);

if(!isMatch)
{
    throw new ApiError('Invalid email or password', 401);
}

const accessToken = await accessTokens(user._id);
const loggedInUser = await User.findById(user._id).select("-password");

const options = {
    httpOnly: true,
    secure: true 
};
return res.status(200).cookie('accessToken', accessToken, options).json(
    new ApiResponse(200,
        {
            user: loggedInUser,
            accessToken
        },
         'User logged in successfully')
);

const logoutUser = asyncHandler(async (req, res) => {
    
})

});

export {registerUser, loginUser};