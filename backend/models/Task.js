const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    nametask: { type: String, required: true },
    description: { type: String, required: true },
    dead_line: { type: Date, default: Date.now },
    remind_me: { type: Date },
    status: {
        type: String,
        required: true,
        enum: ["In Progress", "Done", "Paused", "Revision"],
        default: "In Progress",
    },
    category: { type: String, required: true },
});

module.exports = mongoose.model("Task", TaskSchema);