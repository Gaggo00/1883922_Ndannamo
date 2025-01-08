import React, {useEffect, useState} from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export default function Map({latitude, longitude, message}) {

    const center = [51.505, -0.09];
    if (latitude && latitude != "") center[0] = +(latitude);    // parse float
    if (longitude && longitude != "") center[1] = +(longitude);    // parse float


    const RecenterAutomatically = ({lat,lng}) => {
      const map = useMap();
       useEffect(() => {
         map.setView([lat, lng]);
       }, [lat, lng]);
       return null;
     }

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
                {message}
            </Popup>
          </Marker>
          <RecenterAutomatically lat={latitude} lng={longitude} />
        </MapContainer>
    );
}