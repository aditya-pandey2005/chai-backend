import { asynchandler } from "../utils/asynchandlers";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler( async(req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload that on cloudinary, check for avatar
    // create user object - create entry in db
    // remove password and refresh token field from response - coz we don't want ki mongodb se password directly user ke paas jaaye as a response
    // check for user creation - response aaya ya nhi
    // return response

    const {fullname, email, username, password} = req.body
    console.log("email: ", email);

    if( [fullname, email, username, password].some((field) => field?.trim() === "") ){ // or we can check one by one by usinf "if" for many times
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({ // finds the first data existong in db
        $or: [{username}, {email}] // these are the data to be find
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; //on server not on cloudinary- uploaded on multer
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // upload that on cloudinary, check for avatar
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // create user object - create entry in db - "User" baat kr rha hai db se
    const user = await User.create({ // await as - db is in another continent - takes time
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // remove password and refresh token field from response - coz we don't want ki mongodb se password directly user ke paas jaaye as a response
    const createdUser = await User.findById(user._id).select( // db mein _id khud bnta hai agar koi user stored hai toh-so we are checking weather "user" bana ya nhi
        "-password -refreshToken" // kya-kya nhi chaiye
    )

    // check for user creation - response aaya ya nhi
    if (!createdUser) { // galati hamari/server ki hai coz woh register nhi krwa paya
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}