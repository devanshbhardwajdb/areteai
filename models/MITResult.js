// models/Result.js
import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    class: {
        type: Number,
        required: true,
    },
    testType: {
        type: String,
        default: "MITest"
    },
    scale: {
        type: Number,
        required: true,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    answers: {
        type: Object,
        required: true,
    },
    reportUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

const MITResult = models.MITResult || model('MITResult', ResultSchema);

export default MITResult;