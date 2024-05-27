import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import UploadModal from "./components/UploadModal";
import DetailModal from "./components/DetailModal";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
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
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    console.log(user.displayName);
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleSavePhoto = async (photo) => {
    setPhotos((prevPhotos) => [...prevPhotos, photo]);
  };

  const handleMarkerClick = (photo) => {
    setDetailModalOpen(true);
    setSelectedPhoto(photo);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async () => {
    if (selectedPhoto && selectedPhoto.id) {
      await deleteDoc(doc(db, "photos", selectedPhoto.id));
      setPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.id !== selectedPhoto.id)
      );
      handleCloseDetailModal();
    }
  };

  const handleEditPhoto = async (editPhoto) => {
    if (selectedPhoto && selectedPhoto.id) {
      const updatedPhoto = { ...selectedPhoto, ...editPhoto };
      const docRef = doc(db, "photos", selectedPhoto.id);
      await updateDoc(docRef, updatedPhoto);
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === selectedPhoto.id ? updatedPhoto : photo
        )
      );
      setSelectedPhoto(updatedPhoto);
    }
  };

  return (
    <div className="App">
      <Header user={user} setUser={setUser} />
      <Map
        photos={photos}
        onMarkerClick={handleMarkerClick}
        onUploadClick={handleUploadClick}
        user={user}
      />
      <UploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSavePhoto}
        user={user}
      />
      {selectedPhoto && (
        <DetailModal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          photo={selectedPhoto}
          onDelete={handleDeletePhoto}
          onEdit={handleEditPhoto}
          user={user}
        />
      )}
    </div>
  );
};

export default App;
