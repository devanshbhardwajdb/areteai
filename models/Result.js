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
    scale: {
        type: Number,
        required: true,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true, // Ensure this field is unique
    },
    answers: {
        type: Object,
        required: true,
    },
}, { timestamps: true });

const Result = models.Result || model('Result', ResultSchema);

export default Result;
