import React from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";

const DropzoneArea = ({ onDrop, setFileError }) => {
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          const isImage = acceptedFiles.every((file) =>
            file.type.startsWith("image/")
          );

          if (isImage) {
            setFileError(null); // 파일이 정상적으로 업로드될 경우 오류 메시지 초기화
            onDrop(acceptedFiles);
          } else {
            setFileError("이미지 파일만 업로드할 수 있습니다.");
          }
        }
      },
      accept: "image/*", // 모든 이미지 파일 형식 허용
      onDropRejected: () => {
        setFileError("이미지 파일만 업로드할 수 있습니다.");
      },
    });

  const errorMessages = fileRejections.map((file) => (
    <Typography variant="body2" color="error" key={file.file.path}>
      {file.file.path} 파일은 이미지 파일이 아닙니다.
    </Typography>
  ));

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #eeeeee",
        borderRadius: "5px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: isDragActive ? "#fafafa" : "#f0f0f0",
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="h6" color="textSecondary">
          파일을 여기로 드래그 앤 드롭하세요
        </Typography>
      ) : (
        <Typography variant="h6" color="textSecondary">
          파일을 드래그 앤 드롭하거나 클릭하여 선택하세요.
        </Typography>
      )}
      {errorMessages}
    </Box>
  );
};

export default DropzoneArea;
