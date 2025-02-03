

import { useState } from "react";
import { Mic, Image, Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function RecordingBar({ onStartRecording, onStopRecording, onNoteCreated }) {
  const [isTyping, setIsTyping] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const [isRecording, setIsRecording] = useState(false);

  // Toggle start/stop recording
  const handleToggleRecording = () => {
    if (isRecording) {
      onStopRecording();
      setIsRecording(false);
    } else {
      onStartRecording();
      setIsRecording(true);
    }
  };

  const handleCreateNote = async () => {
    try {
      // Compute title as first 15 characters of noteText (or full text if shorter)
      const computedTitle =
        noteText.length > 15 ? noteText.slice(0, 15) : noteText;
      const token =
        localStorage.getItem("authAuthToken") ||
        localStorage.getItem("authToken");
      console.log("Here is note text:", noteText);

      let response;
      // If an image is selected, send data using FormData
      if (imageFile) {
        const formData = new FormData();
        formData.append("title", computedTitle);
        formData.append("content", noteText);
        formData.append("images", imageFile); // Field name as expected by your backend

        response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/notes/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // If no image, send as JSON
        response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/notes/create`,
          {
            title: computedTitle,
            content: noteText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.status === 201) {
        toast.success("Note created successfully");
        setNoteText("");
        setImageFile(null); // Clear the image file
        setIsTyping(false);
        // Optionally, trigger a refresh of the notes list via a callback
        // Call the callback to refresh the notes list in Home
            if (onNoteCreated) {
                onNoteCreated();
            }
      }
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  // Handler for image selection
  const handleImageChange = (e) => {
    console.log("Selected image:", e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      {isTyping && (
        <div className="border-b p-4">
          <div className="max-w-screen-xl mx-auto">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your note here..."
              rows={3}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {/* File input for image */}
                <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                  <Image size={20} title="Attach Image" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTyping(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">
                {JSON.parse(localStorage.getItem("user"))[0]}
              </span>
            </div>
            <span className="text-sm">
              {JSON.parse(localStorage.getItem("user"))}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTyping(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Create text note"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={handleToggleRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <Mic size={16} />
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordingBar;
