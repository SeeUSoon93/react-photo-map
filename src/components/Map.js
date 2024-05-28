import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./Map.css";

import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import CollectionsIcon from "@mui/icons-material/Collections";
import AppsIcon from "@mui/icons-material/Apps";

const Map = ({
  photos,
  onMarkerClick,
  onUploadClick,
  onViewMyPics,
  onViewAllPics,
  onViewListModal,
  user,
}) => {
  const [position, setPosition] = useState([37.514575, 127.0495556]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <EditIcon />, name: "Upload", onClick: onUploadClick },
    { icon: <PersonIcon />, name: "ViewMypic", onClick: onViewMyPics },
    { icon: <CollectionsIcon />, name: "ViewAllPic", onClick: onViewAllPics },
    { icon: <AppsIcon />, name: "ViewList", onClick: onViewListModal },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {}
      );
    }
  }, []);

  const createIcon = (photo) => {
    const iconHtml = `
    <div class="custom-marker" style="background-image: url('${photo.thumbUrl}')">
    </div>
  `;
    return L.divIcon({
      className: "leaflet-div-icon",
      html: iconHtml,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });
  };

  const adjustPosition = (latitude, longitude) => {
    const offset = 0.0001; // 위치를 약간씩 이동시키는 값
    const randomFactorLat = (Math.random() - 0.5) * offset;
    const randomFactorLon = (Math.random() - 0.5) * offset;
    return [latitude + randomFactorLat, longitude + randomFactorLon];
  };

  const createClusterCustomIcon = (cluster) => {
    const markers = cluster.getAllChildMarkers();
    const n = cluster.getChildCount();
    const markerIcon = markers[0].options.icon.options.html;
    const badgeHtml = `
      <div style="position: relative;">
        ${markerIcon}
        <div style="position: absolute; top: -10px; left: -10px;
        background-color: #236FB8; color: white;
        border-radius: 50%; width: 30px; height: 30px;
        display: flex; align-items: center; justify-content: center;">
          <p>${n}</p>
        </div>
      </div>
    `;

    return L.divIcon({
      html: badgeHtml,
      className: "leaflet-div-icon",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });
  };
  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position}
        zoom={7}
        style={{ height: "100vh", width: "100%" }}
        key={position.toString()}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains={["a", "b", "c", "d"]}
        />
        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
          {photos.map((photo, index) => {
            const [adjustedLat, adjustedLon] = adjustPosition(
              photo.position.latitude,
              photo.position.longitude
            );
            return (
              <Marker
                key={index}
                position={[adjustedLat, adjustedLon]}
                icon={createIcon(photo)}
                eventHandlers={{ click: () => onMarkerClick(photo) }}
              />
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
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
