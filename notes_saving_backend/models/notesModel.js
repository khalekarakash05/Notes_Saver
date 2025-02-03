const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User Model
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        audioTranscription: {
            type: String, // Transcribed text from audio
            default: "",
        },
        imageUrls: {
            type: [String], // URL for uploaded image
            default: [],
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
