import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        minLength: [4, "Please enter characters above 4"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'author'],
        default: 'user',
        select: false
    },
    photo: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg"
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return this.password === value;
            },
            message: "Password and Confirm Password do not match"
        }
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.verifyPassword = async function(pwd, pwdDb) {
    console.log('Verifying password - pwd:', pwd, 'pwdDb:', pwdDb);
    if (!pwd || typeof pwd !== 'string') {
        throw new Error('Password is required and must be a string');
    }
    if (!pwdDb || typeof pwdDb !== 'string') {
        throw new Error('User password is not set or invalid');
    }
    try {
        const result = await bcrypt.compare(pwd, pwdDb);
        console.log('bcrypt.compare result:', result);
        return result;
    } catch (error) {
        console.error('bcrypt.compare error:', error);
        throw new Error('Password verification failed: ' + error.message);
    }
};

export default model("User", userSchema);