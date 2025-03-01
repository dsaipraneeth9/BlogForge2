import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import { send } from '../utils/send.js';

export const register = asyncHandler(async (req, res, next) => {
    let { username, email, password, confirmPassword, role } = req.body;
    
    let newUser = await User.create({
        username,
        email,
        role: role || 'user', // Use provided role or default to 'user'
        password,
        confirmPassword,
        photo: req.file?.path
    });
    let token = await generateToken(newUser._id);
    res.status(201).json({ newUser, token });
});


export const updateProfile = asyncHandler(async (req, res, next) => {
    let { id } = req.params;
    await User.findByIdAndUpdate(id, { photo: req.file?.path }, { new: true });
    res.sendStatus(201);
});

export const forgortPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new Error("User doesn't exist");
    }
    let resetPasswordToken = crypto.randomBytes(32).toString('hex');
    let resetPasswordTokenExpiresAt = Date.now() + 60 * 60 * 1000;
    existingUser.resetPasswordToken = resetPasswordToken;
    existingUser.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await existingUser.save({ validateBeforeSave: false });
    
    let resetPasswordLink = `${req.protocol}://localhost:5173/reset-password/${resetPasswordToken}`;
    let options = {
        subject: "Reset your password",
        to: existingUser.email,
        text: `This is the reset password link, this expires in 1 hour ${resetPasswordLink} click here to reset the password`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { background-color: #007bff; color: #ffffff; padding: 10px 0; text-align: center; }
        .content { margin: 20px 0; text-align: center; }
        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; color: #777777; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Reset Your Password</h1></div>
        <div class="content">
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer"><p>© 2023 Your Company. All rights reserved.</p></div>
    </div>
</body>
</html>`
    };
    await send(options);
    res.status(200).json("Reset password link sent");
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: { $gt: Date.now() }
    });
    
    if (!user) {
        throw new Error("Token Expired");
    }
    
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).send("Reset Password Is Successful");
});

export const logout = asyncHandler(async (req, res) => {
    console.log('Logout request - userId:', req.userId, 'Token:', req.headers.authorization);
    if (!req.userId) {
        console.warn('No userId found in logout request');
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    req.userId = null;
    res.sendStatus(200);
});

// export const login = asyncHandler(async (req, res, next) => {
//     let { email, password } = req.body;
    
//     // Validate email and password
//     if (!email || !password) {
//         res.status(400);
//         throw new Error("Email and password are required");
//     }
//     if (typeof email !== 'string' || typeof password !== 'string') {
//         res.status(400);
//         throw new Error("Email and password must be strings");
//     }

//     let existingUser = await User.findOne({ email }).select('+password +role'); // Include both password and role
//     if (!existingUser) {
//         res.status(404);
//         throw new Error("User doesn't exist, Please Register");
//     }
//     let result = await existingUser.verifyPassword(password, existingUser.password);
//     if (!result) {
//         res.status(401);
//         throw new Error("Password is not correct");
//     }
//     let token = await generateToken(existingUser._id);
//     res.status(200).json({ username: existingUser.username, photo: existingUser.photo, email: existingUser.email, role: existingUser.role, token });
// });

// export const verifyToken = asyncHandler(async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     console.log('Verifying token:', token);
//     if (!token) {
//         res.status(401);
//         throw new Error('No token provided');
//     }

//     try {
//         console.log('JWT_SECRET:', process.env.JWT_SECRET);
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded token:', decoded);
//         const user = await User.findById(decoded.id).select('username email photo role');
//         if (!user) {
//             res.status(404);
//             throw new Error('User not found');
//         }
//         res.status(200).json({ user });
//     } catch (error) {
//         console.error('Token verification error - Full error:', error);
//         if (error.name === 'JsonWebTokenError') {
//             res.status(401);
//             throw new Error('Invalid token format: ' + error.message);
//         } else if (error.name === 'TokenExpiredError') {
//             res.status(401);
//             throw new Error('Token expired: ' + error.message);
//         } else {
//             res.status(500);
//             throw new Error('Token verification failed: ' + error.message);
//         }
//     }
// });


// @desc     Login
// @route    /api/users/login
// @access   Public
export const login = asyncHandler(async (req, res, next) => {
    let { email, password } = req.body;
    
    // Validate email and password
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400);
      throw new Error("Email and password must be strings");
    }
  
    let existingUser = await User.findOne({ email }).select('+password +role'); // Include both password and role
    if (!existingUser) {
      res.status(404);
      throw new Error("User doesn't exist, Please Register");
    }
    let result = await existingUser.verifyPassword(password, existingUser.password);
    if (!result) {
      res.status(401);
      throw new Error("Password is not correct");
    }
    let token = await generateToken(existingUser._id.toString());
    res.status(200).json({ 
      user: {
        _id: existingUser._id.toString(), // Ensure _id is included
        username: existingUser.username, 
        photo: existingUser.photo, 
        email: existingUser.email, 
        role: existingUser.role 
      }, 
      token 
    });
  });
  
  // @desc     Verify Token
  // @route    /api/users/verify-token
  // @access   Private
  export const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Verifying token:', token);
    if (!token) {
      res.status(401);
      throw new Error('No token provided');
    }
  
    try {
      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      const user = await User.findById(decoded.id).select('username email photo role _id');
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error('Token verification error - Full error:', error);
      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Invalid token format: ' + error.message);
      } else if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Token expired: ' + error.message);
      } else {
        res.status(500);
        throw new Error('Token verification failed: ' + error.message);
      }
    }
  });