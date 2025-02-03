
// src/components/Favorites.jsx
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [filteredNotes, setFilteredNotes] = useOutletContext();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/notes/getFavouriteNotes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setFavorites(response.data.data);
          setFilteredNotes(response.data.data); // Set initial filtered notes
        } else {
          console.error("Failed to fetch favorite notes:", response.data);
        }
      } catch (error) {
        console.error("Error fetching favorite notes:", error);
      }
    };

    fetchFavorites();
  }, [setFilteredNotes]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Favorite Notes</h2>
      {filteredNotes.length === 0 ? (
        <p>No favorite notes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="p-4 border rounded-lg bg-white">
              <h3 className="font-medium mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
