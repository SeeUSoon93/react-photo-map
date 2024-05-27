import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EXIF from "exif-js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

const UploadModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [date, setDate] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // EXIF 데이터를 읽어 위치 정보 및 날짜 정보 추출
      EXIF.getData(file, function () {
        if (EXIF.pretty(this)) {
          const lat = EXIF.getTag(this, "GPSLatitude");
          const lon = EXIF.getTag(this, "GPSLongitude");
          const exifDate = EXIF.getTag(this, "DateTimeOriginal");

          if (lat && lon) {
            const latitude = lat[0] + lat[1] / 60 + lat[2] / 3600;
            const longitude = lon[0] + lon[1] / 60 + lon[2] / 3600;
            setPosition({ latitude: latitude, longitude: longitude });
          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                setPosition({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              });
            }
          }
          if (exifDate) {
            setDate(exifDate);
          } else {
            const today = new Date().toISOString();
            setDate(today);
          }
        }
      });
    } else {
      setPreview(null);
      setDate("");
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

      const photo = { title, contents, url, position, date };
      await addDoc(collection(db, "photos"), photo);
      onSave(photo);
      hadleClose();
    }
  };

  const hadleClose = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setContents("");
    setPosition({ latitude: null, longitude: null });
    setDate("");
    onClose();
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
    <Dialog open={open} onClose={hadleClose}>
      <DialogTitle>여행 기록하기</DialogTitle>
      <DialogContent>
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
          label="날짜"
          type="text"
          fullWidth
          value={date}
          InputProps={{
            readOnly: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={hadleClose} variant="contained" color="success">
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
