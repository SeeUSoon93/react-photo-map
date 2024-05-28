import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ListModal = ({ photos, open, onClose, onDetail }) => {
  const [shuffledPhotos, setShuffledPhotos] = useState([]);

  useEffect(() => {
    if (photos.length > 0) {
      const shuffled = [...photos].sort(() => Math.random() - 0.5);
      setShuffledPhotos(shuffled);
    }
  }, [photos]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <IconButton edge="end" color="inherit" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <ImageList variant="masonry" cols={3} gap={8}>
          {shuffledPhotos.map((photo) => (
            <ImageListItem key={photo.url} onClick={() => onDetail(photo)}>
              <img
                srcSet={`${photo.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${photo.url}?w=248&fit=crop&auto=format`}
                alt={photo.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
    </Dialog>
  );
};

export default ListModal;
