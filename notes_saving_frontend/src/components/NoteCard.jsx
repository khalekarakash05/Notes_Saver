

// src/components/NoteCard.jsx
import { Image, Play, FileText, Edit, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import formatDuration from "../utils/timeDuration";
import UpdateNoteModal from "./UpdateNoteModal";
import formatDateTime from "../utils/timeFormator";

function NoteCard({ _id, title, content, createdAt, updatedAt, imageUrls, type, isPreview, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("NoteCard component mounted", type, isPreview ? "(Preview)" : "");
  }, [type, isPreview]);

  // Delete note handler
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const deleteUrl = `${process.env.REACT_APP_BASE_URL}/notes/delete/${_id}`;
      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Note deleted successfully");
        // Refresh notes list using onUpdate callback if available
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-60">
          <div className="text-sm text-gray-500 mb-1">{formatDateTime(createdAt)}</div>
          {type === "audio" && updatedAt ? (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Play size={12} />
              {formatDuration(updatedAt, createdAt)}
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-1">Text</div>
          )}
        </div>
        {/* Edit icon button positioned at top-right */}
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          title="Edit Note"
        >
          <Edit size={16} />
        </button>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{content}</p>
      <div className="flex items-center gap-2">
        {imageUrls && imageUrls.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Image size={16} />
            {imageUrls.length} Images
          </div>
        )}
        {type === "text" && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <FileText size={16} />
            Text
          </div>
        )}
      </div>
      {/* Delete button at bottom-right */}
      <button
        onClick={handleDelete}
        className="absolute bottom-2 right-2 text-red-500 hover:text-red-700"
        title="Delete Note"
      >
        <Trash size={16} />
      </button>
      {/* Render the update modal if editing */}
      {isEditing && (
        <UpdateNoteModal
          note={{ _id, title, content }}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

export default NoteCard;
