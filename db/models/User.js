const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppSetting"
    }

}, {
    timestamps: true
});

// Remove __v from JSON output
UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        delete ret.password; // Don't send password in JSON responses
        return ret;
    }
};

module.exports = mongoose.model("User", UserSchema, "User"); 