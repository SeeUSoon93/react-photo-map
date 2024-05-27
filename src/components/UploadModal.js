import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EXIF from "exif-js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
            setPosition({ latitude: latitude, longitude: longitude });

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
                setPosition({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });

                const fetchAddress = async () => {
                  const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
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
            const [date, time] = exifDate.split(" ");
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSave = async () => {
    if (file) {
      const storageRef = ref(storage, `photos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const photoData = {
        title,
        contents,
        url,
        position,
        date: date.toString(),
        address,
        userId: user.uid,
        userName: user.displayName,
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
    setPosition({
      latitude: result.lat,
      longitude: result.lon,
    });
    setSearchResults([]);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>여행 기록하기</DialogTitle>
      <DialogContent
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>
          {`
      .MuiDialogContent-root::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", marginTop: "10px" }}
          />
        )}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
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
            label="날짜"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ width: "100%" }}
            renderInput={(params) => <TextField {...params} margin="dense" />}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="success">
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
