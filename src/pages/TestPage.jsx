import React, { useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

function Test() {
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 10.775243,
    lng: 106.696282, // Tọa độ Dinh Độc Lập
  });

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleMarkerClick = (marker) => {
    setSelectedLocation({
      lat: marker.position.lat(),
      lng: marker.position.lng(),
    });
  };

  return (
    <div>
      <LoadScript
        googleMapsApiKey="AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo"
        libraries={["places"]}
      >
        <GoogleMap
          id="map"
          mapContainerStyle={{
            width: "100vw",
            height: "400px",
          }}
          zoom={17}
          center={selectedLocation}
          onClick={handleMapClick}
        >
          <MarkerF position={selectedLocation} onClick={handleMarkerClick} />
        </GoogleMap>
      </LoadScript>
      <br />
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Nhập địa chỉ..."
      />
      <br />
      <br />
      <p>
        Kinh độ: {selectedLocation.lng} - Vĩ độ: {selectedLocation.lat}
      </p>
      <p>Địa chỉ: {address}</p>
    </div>
  );
}

export default Test;
