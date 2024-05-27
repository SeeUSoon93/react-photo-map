import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import UploadModal from "./components/UploadModal";
import DetailModal from "./components/DetailModal";

import { storage, db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "./App.css";

const App = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPhoto, setSeletedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadStoredFiles = async () => {
      const querySnapshot = await getDocs(collection(db, "photos"));
      const storedFiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(storedFiles);
    };
    loadStoredFiles();
  }, []);

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleSavePhoto = async (photo) => {
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

  const handleDeletePhoto = async () => {
    await deleteDoc(doc(db, "photos", selectedPhoto.id));
    setPhotos(photos.filter((photo) => photo.id !== selectedPhoto.id));
    handleCloseDetailModal();
  };

  const handleEditPhoto = async (editPhoto) => {
    const updatePhoto = { ...selectedPhoto, ...editPhoto };
    const docRef = doc(db, "photos", selectedPhoto.id);
    await updateDoc(docRef, updatePhoto);
    setPhotos(
      photos.map((photo) =>
        photo.id === selectedPhoto.id ? updatePhoto : photo
      )
    );
    setSeletedPhoto(updatePhoto);
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
