const moment = require('moment');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AppSettingSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    key: {
        type: String
    },
    value: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});


AppSettingSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model("AppSetting", AppSettingSchema, "AppSetting");
