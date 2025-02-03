import { Search, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SortDropdown from "./SortDropDown"; // Import the sorting dropdown

function Header({ onSearchResults }) {
  const [query, setQuery] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";

  // Fetch initial notes based on the current page
  useEffect(() => {
    const fetchInitialNotes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const endpoint = isFavoritesPage
          ? "/notes/getFavouriteNotes"
          : "/notes/getAllNotes";

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setAllNotes(response.data.data);
          onSearchResults(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchInitialNotes();
    setQuery(""); // Reset search query when changing pages
  }, [isFavoritesPage, onSearchResults]);

  // Handle search
  useEffect(() => {
    if (isFavoritesPage) {
      // Client-side search for favorites
      if (!query.trim()) {
        onSearchResults(allNotes);
        return;
      }

      const filtered = allNotes.filter((note) => {
        const searchLower = query.toLowerCase();
        return (
          note.title?.toLowerCase().includes(searchLower) ||
          note.content?.toLowerCase().includes(searchLower)
        );
      });
      onSearchResults(filtered);
    } else {
      // Server-side search for all notes
      const fetchSearchResults = async () => {
        if (!query.trim()) {
          onSearchResults(allNotes);
          return;
        }

        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/notes/search`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                q: query,
              },
            }
          );

          if (response.status === 200) {
            onSearchResults(response.data.data);
          }
        } catch (error) {
          console.error("Error searching notes:", error);
        }
      };

      const delayDebounceFn = setTimeout(() => {
        fetchSearchResults();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [query, isFavoritesPage, allNotes, onSearchResults]);

  // Function to handle sorting option selection
  const handleSortChange = async (selectedFilter) => {
    try {
        console.log("filter", selectedFilter);
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/notes/filterNotes`,
        { filter: selectedFilter }, // Send filter in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        onSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching filtered notes:", error);
    }
  };
  

  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-4">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={`Search ${isFavoritesPage ? "in favorites" : "notes"}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Sorting Dropdown */}
      <SortDropdown  onSortChange={handleSortChange} />
    </div>
  );
}

export default Header;



