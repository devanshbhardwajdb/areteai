import { Schema, model, models } from "mongoose";

// Define a schema for each intelligence type and its questions
const IntelligenceSchema = new Schema({
    intelligenceType: {
        type: String,
        required: true,
    },
    questions: [{
        type: String,
        required: true,
    }]
});

// Define the main Question schema, including class and an array of intelligence types
const QuestionSchema = new Schema({
    class: {
        type: Number,
        required: true,
        unique: true,
    },
    scale: {
        type: Number,
        required: true,
    },
    intelligences: [IntelligenceSchema] // Array of intelligence types with their questions
}, { timestamps: true });

const Question = models.Question || model('Question', QuestionSchema);

export default Question;
