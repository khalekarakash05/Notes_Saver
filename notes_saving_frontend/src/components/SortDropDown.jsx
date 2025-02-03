import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

const sortingOptions = [
  { label: "Newest First", value: "newer" },
  { label: "Oldest First", value: "older" },
  { label: "Favorites", value: "favorite" },
  { label: "A-Z", value: "alphabetical-AZ" },
  { label: "Z-A", value: "alphabetical-ZA" },
];

function SortDropdown({ onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Sort");

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    onSortChange(option.value);
  };

  return (
    <div className="relative ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
      >
        <ArrowUpDown size={20} />
        {selected}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          {sortingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
