import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Avatar,
  CardHeader,
  CardActions,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

const DetailModal = ({ open, onClose, photo, onDelete, onEdit, user }) => {
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
      <AppBar position="static">
        <Toolbar bgcolor={"#236FB8"} color={"white"}>
          <Typography textAlign={"center"} variant="h6" sx={{ flexGrow: 1 }}>
            <strong>{photo.title}</strong>
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Card>
          <CardMedia
            component="img"
            height="100%"
            image={photo.url}
            alt={photo.title}
          />
          <CardHeader
            avatar={<Avatar src={photo.userProfile} />}
            title={photo.userName}
            subheader={photo.date}
          />
          <CardActions>
            <Button
              variant=""
              startIcon={<PlaceIcon />}
              sx={{
                textAlign: "left",
              }}
            >
              {photo.address}
            </Button>
          </CardActions>
          <CardContent>
            {isEditing ? (
              <>
                <TextField
                  margin="dense"
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
                <Typography variant="body1" color="textSecondary">
                  {photo.contents}
                </Typography>
              </>
            )}
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
          </CardActions>
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
            {user && user.uid === photo.userId && (
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
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default DetailModal;
