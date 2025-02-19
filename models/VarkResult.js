import { Schema, model, models } from "mongoose";

const VarkResultSchema = new Schema({
    email: { type: String, required: true },
    class: { type: Number, required: true },
    testType: { type: String, default: "VarkTest" },
    uniqueId: { type: String, required: true, unique: true },
    answers: { type: Object, required: true },
    scores: {
        V: { type: Number, default: 0 },
        A: { type: Number, default: 0 },
        R: { type: Number, default: 0 },
        K: { type: Number, default: 0 }
    },
    reportUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });

const VarkResult = models.VarkResult || model('VarkResult', VarkResultSchema);

export default VarkResult;