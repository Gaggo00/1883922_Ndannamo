import React, {useEffect, useState} from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export default function Map({latitude, longitude, message}) {
  
  var coordinatesReady = false;

  const center = [51.505, -0.09];
  
  if (latitude && latitude !== "" && longitude && longitude !== "") {
      center[0] = +(latitude);    // parse float
      center[1] = +(longitude);    // parse float
      coordinatesReady = true;
  }


  const RecenterAutomatically = ({lat,lng}) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
      coordinatesReady = true;
    }, [lat, lng]);
    return null;
  }

  return (
    <div style={{width: "100%", height: "100%"}}>
      {coordinatesReady && <MapContainer center={center} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
              {message}
          </Popup>
        </Marker>
        <RecenterAutomatically lat={latitude} lng={longitude} />
      </MapContainer>}
    </div>
  );
}