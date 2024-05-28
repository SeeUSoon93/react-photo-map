import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Map from "./components/Map";
import UploadModal from "./components/UploadModal";
import DetailModal from "./components/DetailModal";
import ListModal from "./components/ListModal";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import "./App.css";
import { CircularProgress } from "@mui/material";
const App = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      let q = collection(db, "photos");
      if (view === "my" && user) {
        q = query(q, where("userId", "==", user.uid));
      }
      const querySnapshot = await getDocs(q);
      let loadedPhotos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        loadedPhotos = loadedPhotos.filter((photo) =>
          photo.address.toLowerCase().includes(searchLower)
        );
      }

      setPhotos(loadedPhotos);
      setLoading(false);
    };

    loadPhotos();
  }, [user, view, searchQuery]);

  const handleViewMyPics = () => {
    setView("my");
  };

  const handleViewAllPics = () => {
    setView("all");
  };

  const handleViewListModal = () => {
    setListModalOpen(true);
  };
  const handleCloseListModal = () => {
    setListModalOpen(false);
  };
  const handleUploadClick = () => {
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
      <Header user={user} setUser={setUser} setSearchQuery={setSearchQuery} />
      {loading ? (
        <CircularProgress />
      ) : (
        <Map
          photos={photos}
          onMarkerClick={handleMarkerClick}
          onUploadClick={handleUploadClick}
          onViewMyPics={handleViewMyPics}
          onViewAllPics={handleViewAllPics}
          onViewListModal={handleViewListModal}
          user={user}
        />
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <ListModal
          photos={photos}
          open={listModalOpen}
          onClose={handleCloseListModal}
          onDetail={handleMarkerClick}
        />
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <UploadModal
          open={uploadModalOpen}
          onClose={handleCloseUploadModal}
          onSave={handleSavePhoto}
          user={user}
        />
      )}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default App;
