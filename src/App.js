import React, { useState } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import UploadModal from "./components/UploadModal";
import DetailModal from "./components/DetailModal";
import "./App.css";

const App = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPhoto, setSeletedPhoto] = useState(null);
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

  const hadleMarkerClick = (photo) => {
    setDetailModalOpen(true);
    setSeletedPhoto(photo);
  };
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSeletedPhoto(null);
  };

  const handleDeletePhoto = () => {
    setPhotos(photos.filter((photo) => photo !== selectedPhoto));
    handleCloseDetailModal();
  };

  const handleEditPhoto = (editPhoto) => {
    setPhotos(
      photos.map((photo) =>
        photo === selectedPhoto ? { ...photo, ...editPhoto } : photo
      )
    );
    setSeletedPhoto({ ...selectedPhoto, ...editPhoto });
  };
  return (
    <div className="App">
      <Header onUploadClick={handleUploadClick} />
      <Map photos={photos} onMarkerClick={hadleMarkerClick} />
      <UploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSavePhoto}
      />
      {selectedPhoto && (
        <DetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          photo={selectedPhoto}
          onDelete={handleDeletePhoto}
          onEdit={handleEditPhoto}
        />
      )}
    </div>
  );
};

export default App;
