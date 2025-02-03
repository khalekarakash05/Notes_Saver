const express = require("express");
const router = express.Router();

const {createNote, searchNotes, getNoteById, updateNote, 
    filterNotes, DeleteNote, getAllNotes,
    toggleFavorite,
    getFavoriteNotes} = require("../controllers/notesController");
const {auth} = require("../middleware/userMiddleware");
const { uploadFile } = require("../controllers/fileuploadController");

router.post("/create", auth, createNote);
router.get("/search", auth, searchNotes);
router.get("/getNote/:id", auth, getNoteById);
router.put("/update", auth, updateNote);
router.delete("/delete/:id", auth, DeleteNote);
router.post("/filterNotes", auth, filterNotes);
router.get("/getAllNotes", auth, getAllNotes);
router.put("/toggleFavourite", auth, toggleFavorite);
router.get("/getFavouriteNotes", auth, getFavoriteNotes);

router.put("/imageUpload/:id", auth, uploadFile);

module.exports = router;
