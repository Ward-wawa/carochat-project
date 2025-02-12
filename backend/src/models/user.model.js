import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: [6,"password must be at least 6 characters"],
    },
    profilePic:{
        type: String,
        default: "",
    },
    passwordResetToken:String,
    passwordResetTokenExpire:Date
}, { timestamps: true });

userSchema.methods.correctToken = async function (candidateToken, userToken) {
    return await bcrypt.compare(candidateToken, userToken);
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = await bcrypt.hash(resetToken, 10);
    this.passwordResetTokenExpire = Date.now() + 600000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;