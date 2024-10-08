import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
    },
    profilepic: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user', // Default role
    },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
