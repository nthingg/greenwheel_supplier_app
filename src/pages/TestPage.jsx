import React, { useState, useEffect } from "react";

const MapWithSearch = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const googleScript = document.createElement("script");
      googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCzYlFQ9BHxHZRRYS2RFMz-ofS_lWw_XLo&libraries=places`;
      googleScript.async = true;
      googleScript.defer = true;
      googleScript.onload = initializeMap;
      googleScript.onerror = () => alert("Không thể tải Google Maps");
      document.head.appendChild(googleScript);
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    try {
      const google = window.google;
      const mapCenter = { lat: 10.7769, lng: 106.7009 }; // Tọa độ của Dinh Độc Lập
      const mapOptions = {
        zoom: 13,
        center: mapCenter,
      };
      const map = new google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );
      setMap(map);

      const marker = new google.maps.Marker({
        position: mapCenter,
        map: map,
      });
      setMarker(marker);

      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete")
      );
      setAutocomplete(autocomplete);

      autocomplete.bindTo("bounds", map);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Thu phóng để hiển thị chi tiết địa điểm
        }

        marker.setPosition(place.geometry.location);
        setPlace({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: place.formatted_address,
        });
      });
    } catch (error) {
      console.error("Lỗi khi khởi tạo bản đồ:", error);
    }
  };

  return (
    <div>
      <input id="autocomplete" type="text" placeholder="Nhập địa chỉ" />
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
      {place ? (
        <div>
          <p>Kinh độ: {place.longitude}</p>
          <p>Vĩ độ: {place.latitude}</p>
          <p>Địa chỉ chính xác: {place.address}</p>
        </div>
      ) : (
        <div>
          <p>Kinh độ: 106.7009</p>
          <p>Vĩ độ: 10.7769</p>
          <p>
            Địa chỉ chính xác: Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh,
            Việt Nam
          </p>
        </div>
      )}
    </div>
  );
};

export default MapWithSearch;
