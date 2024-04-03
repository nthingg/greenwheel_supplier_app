import "../../assets/scss/map.scss";
import PropTypes from "prop-types";
import PointerIcon from "../../assets/images/map-marker-512.png";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useState, useEffect } from "react";
import { regionData } from "../../services/location/region";
import * as turf from "@turf/turf";

const TOKEN =
  "pk.eyJ1IjoicGhhbmR1eSIsImEiOiJjbGswaDQzNjgwbGJlM2Z0NXd2c2V0eTgxIn0.mu5cOmm7meqqmT7eicLbKA";

CustomMap.propTypes = {
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  updateCoordinates: PropTypes.func.isRequired,
};

const geojson = regionData;

const layerStyle = {
  id: "point",
  type: "line",
  paint: {
    "line-color": "#000",
    "line-width": 2,
  },
};

function CustomMap({ longitude, latitude, updateCoordinates }) {
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: 16,
    center: [longitude, latitude],
  });

  const [marker, setMarker] = useState({
    latitude,
    longitude,
  });

  useEffect(() => {
    setMarker(() => ({
      latitude,
      longitude,
    }));
  }, [latitude, longitude]);

  useEffect(() => {
    setViewport((oldViewport) => ({
      ...oldViewport,
      latitude,
      longitude,
    }));
  }, [latitude, longitude]);

  const handleMarkerDrag = (event) => {
    const lat = event.lngLat.lat;
    const lng = event.lngLat.lng;

    let points = turf.points([[lng, lat]]);

    let searchWithin = turf.polygon(
      regionData.features[0].geometry.coordinates[0]
    );

    var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
    console.log(ptsWithin);

    if (ptsWithin.features.length > 0) {
      console.log(lat);
      console.log(lng);

      setMarker({ latitude: lat, longitude: lng });

      const loc = {
        lng: lng,
        lat: lat,
      };

      localStorage.setItem("loc", JSON.stringify(loc));

      updateCoordinates(lat, lng);
    } else {
      setMarker({ latitude, longitude });

      const loc = {
        lng: longitude,
        lat: latitude,
      };

      localStorage.setItem("loc", JSON.stringify(loc));

      updateCoordinates(latitude, longitude);
    }
  };

  const handleClick = (e) => {
    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng;

    let points = turf.points([[longitude, latitude]]);

    let searchWithin = turf.polygon(
      regionData.features[0].geometry.coordinates[0]
    );

    var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

    if (ptsWithin.features.length > 0) {
      setMarker({ latitude, longitude });

      console.log(longitude, latitude);
      const loc = {
        lng: longitude,
        lat: latitude,
      };

      localStorage.setItem("loc", JSON.stringify(loc));

      updateCoordinates(latitude, longitude);
    }
  };

  return (
    <div className="map">
      <Map
        {...viewport}
        mapboxAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(event) => {
          setViewport(event.viewState);
        }}
        onClick={handleClick}
      >
        <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
        <Marker
          latitude={marker.latitude}
          longitude={marker.longitude}
          draggable={true}
          onDragEnd={handleMarkerDrag}
        >
          <img className="marker" src={PointerIcon} />
        </Marker>
      </Map>
    </div>
  );
}

export default CustomMap;
