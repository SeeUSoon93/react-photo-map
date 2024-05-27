import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
//Leaflet은 Interactive한 Map을 위한 Javascript 오픈소스 라이브러리 - 지도 위 마커나, 벡터를 그리는 등 다양한 api를 지원
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import {
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import CollectionsIcon from "@mui/icons-material/Collections";
const Map = ({
  photos,
  onMarkerClick,
  onUploadClick,
  onViewMyPics,
  onViewAllPics,
  user,
}) => {
  // 기본위치를 서울 강남구로 설정
  const [position, setPosition] = useState([37.514575, 127.0495556]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <EditIcon />, name: "Upload", onClick: onUploadClick },
    { icon: <PersonIcon />, name: "ViewMypic", onClick: onViewMyPics },
    { icon: <CollectionsIcon />, name: "ViewAllPic", onClick: onViewAllPics },
  ];
  // useEffect()는 컴포넌트가 렌더링될 때마다 특정 작업(side Effect)을 실행할 수 있도록 하는 hook
  useEffect(() => {
    // 컴포넌트가 마운트 될때 위치정보 받아오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 현재 사용자의 위치로 기본위치를 변경
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {}
      );
    }
  }, []); // 빈 배열을 의존성 배열로 설정 - 마운트, 언마운트 시에만 실행

  const createIcon = (photo) => {
    const iconHtml = `
    <div class="custom-marker" style="background-image: url('${photo.url}')">
    </div>
  `;
    return L.divIcon({
      className: "leaflet-div-icon",
      html: iconHtml,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: "100vh", width: "100%" }}
        key={position.toString()} //기본위치를 설정했었기 떄문에, 위치가 변경되면 다시 컴포넌트를 렌더링하도록 함
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />
        {photos.map((photo, index) => (
          <Marker
            key={index}
            position={[photo.position.latitude, photo.position.longitude]}
            icon={createIcon(photo)}
            eventHandlers={{ click: () => onMarkerClick(photo) }}
          ></Marker>
        ))}
      </MapContainer>
      <Backdrop open={open} />

      {user && (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      )}
    </div>
  );
};

export default Map;
