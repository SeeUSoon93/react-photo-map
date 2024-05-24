import React, { useState } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import UploadModal from "./components/UploadModal";
import "./App.css";

const App = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleSavePhoto = (photo) => {
    setPhotos([...photos, photo]);
  };

  return (
    <div className="App">
      <Header onUploadClick={handleUploadClick} />
      <Map photos={photos} />
      <UploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSavePhoto}
      />
    </div>
  );
};

export default App;
