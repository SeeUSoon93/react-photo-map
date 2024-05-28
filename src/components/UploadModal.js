import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";
import EXIF from "exif-js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { readAndCompressImage } from "browser-image-resizer";
import dayjs from "dayjs";
import DropzoneArea from "./DropzoneArea";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";

const UploadModal = ({ open, onClose, onSave, user }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [date, setDate] = useState(dayjs());
  const [preview, setPreview] = useState(null);
  const [address, setAddress] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [positionError, setPositionError] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        EXIF.getData(file, function () {
          const lat = EXIF.getTag(this, "GPSLatitude");
          const lon = EXIF.getTag(this, "GPSLongitude");
          const exifDate = EXIF.getTag(this, "DateTimeOriginal");

          if (lat && lon) {
            const latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
            const longitude = lon[0] + lon[1] / 60 + lon[2] / 3600;

            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
              setPosition({ latitude: latitude, longitude: longitude });
              setPositionError(null);
            } else {
              setPositionError(
                "위치 정보가 올바르지 않습니다. 다시 시도해 주세요."
              );
            }

            const fetchAddress = async () => {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              if (data && data.display_name) {
                setAddress(data.display_name);
              }
            };
            fetchAddress();
          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                  setPosition({ latitude: latitude, longitude: longitude });
                  setPositionError(null);
                } else {
                  setPositionError(
                    "위치 정보가 올바르지 않습니다. 다시 시도해 주세요."
                  );
                }

                const fetchAddress = async () => {
                  const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                  );
                  const data = await response.json();
                  if (data && data.display_name) {
                    setAddress(data.display_name);
                  }
                };
                fetchAddress();
              });
            }
          }

          if (exifDate) {
            const [date] = exifDate.split(" ");
            const [year, month, day] = date.split(":");
            setDate(dayjs(`${year}-${month}-${day}`));
          }
        });
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setDate(dayjs());
      setAddress("");
    }
  }, [file]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const isImage = acceptedFiles.every((file) =>
        file.type.startsWith("image/")
      );

      if (isImage) {
        setFile(acceptedFiles[0]);
      } else {
        setFileError("이미지 파일만 업로드할 수 있습니다.");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSave = async () => {
    if (file) {
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const thumbnailConfig = {
        maxWidth: 200,
        maxHeight: 200,
        autoRotate: true,
        debug: true,
      };
      const thumbnailBlob = await readAndCompressImage(file, thumbnailConfig);
      const thumbStorageRef = ref(storage, `thumbnails/${file.name}`);
      await uploadBytes(thumbStorageRef, thumbnailBlob);
      const thumbUrl = await getDownloadURL(thumbStorageRef);

      let userProfileUrl = "";
      if (user.photoURL) {
        try {
          const response = await fetch(user.photoURL);
          const userProfileBlob = await response.blob();
          const userProfileStorageRef = ref(
            storage,
            `users/${user.uid}/profile.jpg`
          );
          await uploadBytes(userProfileStorageRef, userProfileBlob);
          userProfileUrl = await getDownloadURL(userProfileStorageRef);
        } catch (error) {
          console.error("Error uploading user profile image:", error);
        }
      }

      const photoData = {
        title,
        contents,
        url,
        thumbUrl,
        position,
        date: date.toString(),
        address,
        userId: user.uid,
        userName: user.displayName,
        userProfile: userProfileUrl,
      };
      const docRef = await addDoc(collection(db, "photos"), photoData);
      const photo = { id: docRef.id, ...photoData }; // Firestore 문서 ID 포함

      onSave(photo);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setContents("");
    setPosition({ latitude: null, longitude: null });
    setDate(dayjs());
    setAddress("");
    setSearchResults([]);
    setFileError(null);
    setPositionError(null);
    onClose();
  };

  const handleAddressChange = async (event) => {
    setAddress(event.target.value);
  };

  const handleAddressKeyDown = async (event) => {
    if (event.key === "Enter") {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${address}`
      );
      const data = await response.json();
      setSearchResults(data);
      setLoading(false);
    }
  };

  const handleAddressSelect = (result) => {
    setAddress(result.display_name);
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      setPosition({ latitude, longitude });
      setPositionError(null);
    } else {
      setPositionError("위치 정보가 올바르지 않습니다. 다시 시도해 주세요.");
    }
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <AppBar position="static">
        <Toolbar bgcolor={"#236FB8"} color={"white"}>
          <Typography textAlign={"center"} variant="h6" sx={{ flexGrow: 1 }}>
            <strong>여행 기록하기</strong>
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", marginTop: "10px" }}
          />
        )}
        {fileError && (
          <Typography variant="body2" color="error">
            {fileError}
          </Typography>
        )}
        {positionError && (
          <Typography variant="body2" color="error">
            {positionError}
          </Typography>
        )}
        <DropzoneArea
          onDrop={handleDrop}
          setFileError={setFileError}
          type="file"
          onChange={handleFileChange}
        />
        <TextField
          margin="dense"
          label="제목"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="내용"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />
        <TextField
          margin="dense"
          label="위치"
          type="text"
          fullWidth
          value={address}
          onChange={handleAddressChange}
          onKeyDown={handleAddressKeyDown}
        />
        {loading && <CircularProgress />}
        {searchResults.length > 0 && (
          <List>
            {searchResults.slice(0, 5).map((result) => (
              <ListItemButton
                key={result.place_id}
                onClick={() => handleAddressSelect(result)}
              >
                <ListItemText primary={result.display_name} />
              </ListItemButton>
            ))}
          </List>
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ width: "100%" }}
            renderInput={(params) => (
              <TextField {...params} margin="dense" fullWidth sx={{ mt: 2 }} />
            )}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!file || fileError || positionError}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
