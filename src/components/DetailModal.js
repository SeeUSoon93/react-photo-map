import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";

const DetailModal = ({ open, onClose, photo, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={URL.createObjectURL(photo.file)}
            alt={photo.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {photo.title}
            </Typography>
            <Chip
              label={photo.date}
              sx={{ mb: 1.5 }}
              size="small"
              variant="outlined"
            />
            <Typography variant="h6" color="textSecondary">
              {photo.contents}
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="success" onClick={onDelete}>
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DetailModal;
