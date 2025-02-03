
import React, { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [filteredNotes, setFilteredNotes] = useState([]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onSearchResults={setFilteredNotes} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={[filteredNotes, setFilteredNotes]} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

