import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generateToken = (userId,res) => {
    const secret = process.env.JWT_SECRET;
    const enodev = process.env.NODE_ENV || 'development';
    const token = jwt.sign({userId},
        secret,
        {expiresIn: '10d'})
    res.cookie("jwt", token, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: enodev !== 'development',
    })
    return token;
}

export default generateToken;