import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async(req,res,next) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (err){
        console.log(err);
        return next(new AppError("Internal Server Error",500))
    }
}

export const getMessages = async(req,res,next) => {
    try {
        const { id : userToChatId } = req.params;
        const myId = req.user._id;
        const messages = Message.find({
            $or:[
                {senderId: myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        console.log(err);
        return next(new AppError("internal server error",500));
    }
}

export const sendMessage = async (req,res,next) => {
   try {
       const { text,image } = req.body;
       const {id:receiverId} = req.params;
       const senderId = req.user._id;

       let imageUrl;
       if(image){
           const uploadResponse = await cloudinary.uploader.upload(image);
           const imageUrl = uploadResponse.secure_url;
       }

       const newMessage = new Message({
           senderId,
           receiverId,
           text,
           image: imageUrl,
       });
       await newMessage.save();

       //  TODO:
       // implement real time functionality using socket.io

   }catch(err){
       console.log(err);
       return next(new AppError("internal server error",500));
   }
}