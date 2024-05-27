import React, { useState, useEffect } from "react";
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
  TextField,
} from "@mui/material";

const DetailModal = ({ open, onClose, photo, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(photo.title);
  const [editedContents, setEditedContents] = useState(photo.contents);

  const handleSaveEdit = () => {
    onEdit({ title: editedTitle, contents: editedContents });
    setIsEditing(false);
  };

  useEffect(() => {
    if (photo) {
      setEditedTitle(photo.title);
      setEditedContents(photo.contents);
    }
  }, [photo]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={photo.url}
            alt={photo.title}
          />
          <CardContent>
            {isEditing ? (
              <>
                <TextField
                  margin="dense"
                  label="제목"
                  type="text"
                  fullWidth
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </>
            ) : (
              <>
                <Typography gutterBottom variant="h5" component="div">
                  {photo.title}
                </Typography>
              </>
            )}
            <Chip
              label={photo.date}
              sx={{ mb: 1.5 }}
              size="small"
              variant="outlined"
            />
            <Chip
              label={photo.address}
              sx={{ mb: 1.5 }}
              size="small"
              variant="outlined"
            />
            {isEditing ? (
              <>
                <TextField
                  margin="dense"
                  label="내용"
                  type="text"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedContents}
                  onChange={(e) => setEditedContents(e.target.value)}
                />
              </>
            ) : (
              <>
                <Typography variant="h6" color="textSecondary">
                  {photo.contents}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(false)}
              variant="contained"
              color="success"
            >
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEdit}
            >
              저장
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
            <Button variant="contained" color="success" onClick={onDelete}>
              삭제
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default DetailModal;
