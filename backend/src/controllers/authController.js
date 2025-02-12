import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";
//import sendEmail from "../utils/sendEmail.js";

export const signUp = async (req, res, next) => {
    const { email, password , fullName} = req.body;
    if (!email || !password || !fullName) {
        return next(new AppError("all fields are required!",400));
    }
    try {
        if(password.length < 6) {
            return next(new AppError("password must be at least 6 characters",400))
        }
        const user = await User.findOne({email});
        if(user){
            return next(new AppError("Email already exists",400))
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });
        if(newUser)
        {
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                email: newUser.email,
                fullName: newUser.fullName,
                id: newUser._id,
            });
        }
        else{
            return next(new AppError("invalid user data",400))
        }
        await newUser.save();
    }catch (err)
    {
        console.log("error in creating user", err);
        return next(new AppError("internal server error",500));
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user){
            return next(new AppError("invalid user data",400));
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            res.status(400).json({message:"invalid user data"});
        }
        generateToken(user._id,res);

        res.status(200).json({
            id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    }catch (err){
        console.log("error in creating user", err);
        return next(new AppError("internal server error",500));
    }
}

export const logout = async (req, res, next) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({message:"logged out successfully"});
    }catch(err){
        console.log(err);
        return next(new AppError("internal server error",500));
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        console.log(profilePic)
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req,res,next) =>{
    try {
        const user = req.user;
        res.status(200).json({message:"logged in successfully",user});
    }
    catch(err){
        console.log(err);
        return next(new AppError("internal server error",500));
    }
}

export const updateFullName = async (req,res)=>{
    try {
        const userId = req.user._id;
        const newFullName = req.body.fullName;
        const user = await User.findByIdAndUpdate(userId, {fullName: newFullName},{
            new: true,
            runValidators: true
        });
        if(!user){
            res.status(400).json({message:`user with the id of ${userId} does not exist`});
        }
        res.status(200).json(user);
    }catch(err){
        console.log("error updating fullName")
    }
}
/* unused
export const forgotPassword = async (req, res, next) => {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError("No user with this email was found", 404));
    }
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send the reset URL
    const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password?token=${resetToken}&email=${req.body.email}`;

    const message = `Forgot your password? No Worries!.. send your new Password to the provided reset link with your new password to confirm. 
  if you didn't forget your password please ignore this mail..
  reset link: ${resetURL} `;
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token is valid for only 10 minutes! ",
            message,
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to your Email",
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
    }
};

export const resetPassword = async (req, res, next) => {
    const user = await User.findOne({
        email: req.query.email,
        passwordResetTokenExpire: { $gt: Date.now() },
    });

    const candidateToken = req.query.token;

    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400));
    }
    const match = await user.correctToken(
        candidateToken,
        user.passwordResetToken
    );
    if (!match) {
        return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save();

    generateToken(user._id,res);
    res.status(200).json({
        message:"password is reset!",
        user,
    })
};*/