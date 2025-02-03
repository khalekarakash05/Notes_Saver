const Note = require("../models/notesModel");
const cloudinary = require("../config/cloudinary");
const User = require("../models/userModel");

//creating note
exports.createNote = async(req, res) => {
    try {

        const {title, content, audioTranscription} = req.body;
        // console.log("title", title, "content", content, "audioTranscription", audioTranscription);
        let images = req.files?.images;

        // console.log("image", images);

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid title"
            });
        }

        if (!(content || audioTranscription)) {
            return res.status(400).json({
                success: false,
                message: "Please provide content or audio transcription"
            });
        }


        let imageUrls = [];

        if(images){
            // console.log("images", images);
            if (!Array.isArray(images)) {
                images = [images];
            }
            
            for(const image of images){
                // console.log("image", image);
                const result  = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "Notes",
                    use_filename: false
                })
                // console.log("result", result.secure_url);
        
                if(!result){
                    return res.status(400).json({
                        success: false,
                        message: "Image upload failed"
                    })
                }
        
                imageUrls.push(result.secure_url);
                // console.log("imageUrls", imageUrls);
            }
            // console.log("imageUrl", imageUrl);
        }
        
        const note = await Note.create({
            title,
            content,
            audioTranscription,
            imageUrls: imageUrls,
            user: req.user.id
        })
        // console.log("note", note);

        if(!note){
            return res.status(400).json({
                success: false,
                message: "Note not created"
            })
        }

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Note cannot be created"
        })
    }
}


//searching note
// Search notes by title/content (now accepting query from the body)
exports.searchNotes = async (req, res) => {
    try {
        const { q } = req.query; // Extract the search query from the request query
        const userId = req.user.id; // Assuming user info is attached in req.user from JWT middleware

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please provide a search query"
            });
        }

        
        const notes = await Note.find({
            user: userId, // Ensure that the user can only search their own notes
            $or: [
                { title: { $regex: q, $options: "i" } },
                { content: { $regex: q, $options: "i" } },
            ]
        });

        // If no notes found
        if (!notes || notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notes found matching the search query"
            });
        }

        // Return found notes
        return res.status(200).json({
            success: true,
            message: "Notes found successfully",
            data: notes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while searching for notes"
        });
    }
};



//get all details of current selected note
exports.getNoteById = async (req, res) => {
    try {
        const id  = req.params.id; // Extract note ID from request body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required"
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note fetched successfully",
            data: note
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not retrieve the note",
            error: error.message
        });
    }
};



//edit the specific note
exports.updateNote = async (req, res) => {
    try {
      const { id, title, content, favorite, imageUrls: bodyImageUrls, audioTranscription } = req.body;
      let images = req.files?.images; // Check if new image(s) are uploaded
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Note ID is required"
        });
      }
  
      let updatedFields = {};
  
      // Handle image upload if new image(s) are provided
      if (images) {
        // Ensure images is an array
        if (!Array.isArray(images)) {
          images = [images];
        }
  
        const uploadedUrls = [];
        for (const image of images) {
          const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "Notes",
            use_filename: false
          });
  
          if (!result) {
            return res.status(400).json({
              success: false,
              message: "Image upload failed"
            });
          }
          uploadedUrls.push(result.secure_url);
        }
  
        // If the client provided existing image URLs in the body,
        // combine them with the newly uploaded URLs.
        if (bodyImageUrls !== undefined) {
          let existingUrls;
          // If bodyImageUrls is already an array, use it directly;
          // if it's a string (for example, JSON string), parse it.
          if (Array.isArray(bodyImageUrls)) {
            existingUrls = bodyImageUrls;
          } else {
            try {
              existingUrls = JSON.parse(bodyImageUrls);
            } catch (err) {
              existingUrls = [];
            }
          }
          updatedFields.imageUrls = [...existingUrls, ...uploadedUrls];
        } else {
          updatedFields.imageUrls = uploadedUrls;
        }
      } else if (bodyImageUrls !== undefined) {
        // If no new images are provided, just use the provided existing URLs
        updatedFields.imageUrls = bodyImageUrls;
      }
  
      // Add other fields if provided
      if (title !== undefined) updatedFields.title = title;
      if (content !== undefined) updatedFields.content = content;
      if (favorite !== undefined) updatedFields.favorite = favorite;
      if (audioTranscription !== undefined) updatedFields.audioTranscription = audioTranscription;
  
      // Update the note in the database
      const note = await Note.findByIdAndUpdate(id, updatedFields, {
        new: true,
        runValidators: true
      });
  
      console.log("note", note);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Note updated successfully",
        data: note
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Could not update the note",
        error: error.message
      });
    }
  };
  
// exports.updateNote = async (req, res) => {
//     try {
//         const { id, title, content, favorite,  imageUrls: bodyImageUrls, audioTranscription } = req.body;
//         let images = req.files?.images;// Check if a new image is uploaded
//         // console.log("id", id, "title", title, "content", content, "favorite", favorite, "imageUrl", imageUrl, "audioTranscription", audioTranscription, "image", image);
//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Note ID is required"
//             });
//         }

//         let updatedFields = {};

//         // Handle image upload if a new image is provided
//         if (images) {

//             if (!Array.isArray(images)) {
//                 images = [images];
//             }

//             const uploadedUrls = [];

//             for (const image of images) {
//                 const result = await cloudinary.uploader.upload(image.tempFilePath, {
//                     folder: "Notes",
//                     use_filename: false
//                 });

//                 if (!result) {
//                     return res.status(400).json({
//                         success: false,
//                         message: "Image upload failed"
//                     });
//                 }

//                 uploadedUrls.push(result.secure_url)// Update with new Cloudinary URL
//                 // console.log("uploadedUrls", uploadedUrls);
//             }
//             updatedFields.imageUrls = uploadedUrls;
//             // console.log("updatedFields", updatedFields);
//         }
//         else if (bodyImageUrls !== undefined) {
//             // If no file is uploaded but the client sends an imageUrls value in the body.
//             updatedFields.imageUrls = bodyImageUrls;
//         }

//         // Add other fields only if they are provided (avoiding overwriting)
//         if (title !== undefined) updatedFields.title = title;
//         if (content !== undefined) updatedFields.content = content;
//         if (favorite !== undefined) updatedFields.favorite = favorite;
//         if (audioTranscription !== undefined) updatedFields.audioTranscription = audioTranscription;
       
//             //    if (!images && (bodyImageUrls !== undefined)) {
//             //         updatedFields.imageUrls = bodyImageUrls;
//             //     }


//         // Update the note in the database
//         // console.log("updatedFields", updatedFields);
//         const note = await Note.findByIdAndUpdate(id, updatedFields, {
//             new: true,
//             runValidators: true
//         });
//         console.log("note", note);
//         if (!note) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Note not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Note updated successfully",
//             data: note
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Could not update the note",
//             error: error.message
//         });
//     }
// };


//delete the specific note
exports.DeleteNote = async(req, res)=>{
    try {
        const id = req.params.id;
        console.log("id", id);

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Note ID is required"
            });
        }

        //find note id in user collection and delete from that array as well
        const userId = req.user.id;
        
        console.log("userId", userId);
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        //we have to pull out the id from the user collection
        // await User.findByIdAndUpdate(userId, 
        //     { $pull: { notes: id } }
        // );

       
        console.log("note i am here");


        const note = await Note.findById(id);
        console.log("note", note);
        if(!note){
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        await Note.findByIdAndDelete(id);
        // console.log("note i am here");

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not delete the note",
            error: error.message
        });
    }
}

//filter notes according to loder or newer or favorite
exports.filterNotes = async (req, res) => {
    try {
        const  {filter}  = req.body;
        console.log("filter", filter);
        const userId = req.user.id;
        console.log("userId", userId);

        if (!filter) {
            return res.status(400).json({
                success: false,
                message: "Filter is required"
            });
        }

        let notes = [];

        switch (filter) {
            case "older":
                notes = await Note.find({ user: userId }).sort({ createdAt: 1 });
                break;
            case "newer":
                notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
                break;
            case "favorite":
                notes = await Note.find({ user: userId, favorite: true });
                break;
            case "alphabetical-AZ":
                notes = await Note.find({ user: userId }).sort({ title: 1 });
                break;
            case "alphabetical-ZA":
                notes = await Note.find({ user: userId }).sort({ title: -1 });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid filter"
                });
        }

        console.log("notes", notes);
        if (!notes || notes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No notes found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not fetch notes",
            error: error.message
        });
    }
};


//getallNotes
exports.getAllNotes = async(req, res) => {
    try {
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const notes = await Note.find({user: userId});

        if(!notes || notes.length === 0){
            return res.status(404).json({
                success: false,
                message: "No notes found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not fetch notes",
            error: error.message
        });
    }
}

//dedicated to toggle favorite
exports.toggleFavorite = async(req, res) => {
    try {
        
        // Extract note ID from request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required"
            });
        }

        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Toggle the favorite status

        note.favorite = !note.favorite;

        await note.save();

        return res.status(200).json({
            success: true,
            message: "Favorite status updated successfully",
            data: note
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not update the favorite status",
            error: error.message
        });
    }

}

//dedicated to get favorite notes

exports.getFavoriteNotes = async(req, res) => {
    try {
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const notes = await Note.find({user: userId, favorite: true});

        if(!notes || notes.length === 0){
            return res.status(404).json({
                success: false,
                message: "No favorite notes found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Favorite notes fetched successfully",
            data: notes
        });

    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not fetch favorite notes",
            error: error.message
        });
    }
}
