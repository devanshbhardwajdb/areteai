import { Schema, model, models } from "mongoose";

// Define schema for each VARK question
const VarkQuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    learningType: [{
        type: String,
        enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'],
        required: true,
    }]
});

// Define main schema for VARK test
const VarkTestSchema = new Schema({
    testName: {
        type: String,
        required: true,
        default: "VARK Learning Style Test"
    },
    class: {
        type: Number,
        required: true,
    },
    questions: [VarkQuestionSchema],
}, { timestamps: true });

const VarkTest = models.VarkTest || model('VarkTest', VarkTestSchema);

export default VarkTest;
