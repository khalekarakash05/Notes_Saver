const Note = require("../models/notesModel");
const cloudinary = require("../config/cloudinary");

exports.uploadFile = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const noteId = req.params.id;

        if(!noteId){
            return res.status(401).json({
                success: false,
                message: "Note not found"
            });
        }

        const images = req.files?.images;

        if(!images){
            return res.status(401).json({
                success: false,
                message: "Image not found"
            });
        }

        if (!Array.isArray(images)) {
            images = [images];
        }

        const uploadedUrls = [];
        for (const image of images) {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "notes",
                use_filename: false
            });
            if (!result || !result.secure_url) {
                return res.status(400).json({
                    success: false,
                    message: "One of the image uploads failed"
                });
            }
            uploadedUrls.push(result.secure_url);
        }

        const note = await Note.findByIdAndUpdate(
            noteId, 
            { $push: { imageUrls: { $each: uploadedUrls } } },
            { new: true, runValidators: true }
        );

        if(!note){
            return res.status(401).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: note,
            message: "Image uploaded successfully"
        }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "error occured while uploading file",
        });
    }

}