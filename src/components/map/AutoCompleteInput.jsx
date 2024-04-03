import "../../assets/scss/map.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import getLocations from "../../services/apis/getLocations";
import { TextField } from "@mui/material";
import * as turf from "@turf/turf";
import { regionData } from "../../services/location/region";

AutoCompleteInput.propTypes = {
  handleManualInputChange: PropTypes.func.isRequired,
  setAddress: PropTypes.func.isRequired,
  streetAndNumber: PropTypes.string.isRequired,
};

const TOKEN =
  "pk.eyJ1IjoicGhhbmR1eSIsImEiOiJjbGswaDQzNjgwbGJlM2Z0NXd2c2V0eTgxIn0.mu5cOmm7meqqmT7eicLbKA";

export default function AutoCompleteInput({
  handleManualInputChange,
  setAddress,
  streetAndNumber,
}) {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (event) => {
    handleManualInputChange(event, "streetAndNumber");
    handleInputChange(event.target.value);
  };

  const handleInputChange = async (query) => {
    const suggestions = await getLocations(query, TOKEN);

    let res = [];

    for (let index = 0; index < suggestions.length; index++) {
      let points = turf.points([
        [suggestions[index].center[0], suggestions[index].center[1]],
      ]);

      let searchWithin = turf.polygon(
        regionData.features[0].geometry.coordinates[0]
      );

      var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

      if (ptsWithin.features.length > 0) {
        res.push(suggestions[index]);
      }
    }

    setSuggestions(res);
  };

  const handleSuggestionClick = (suggestion) => {
    // const streetAndNumber = suggestion.place_name.split(",")[0];
    const streetAndNumber = suggestion.place_name;
    const latitude = suggestion.center[1];
    const longitude = suggestion.center[0];

    const address = {
      streetAndNumber,
      latitude,
      longitude,
    };

    suggestion.context.forEach((element) => {
      const identifier = element.id.split(".")[0];

      address[identifier] = element.text;
    });

    console.log(address.longitude, address.latitude);

    const loc = {
      lng: address.longitude,
      lat: address.latitude,
    };

    localStorage.setItem("loc", JSON.stringify(loc));

    setAddress(address);
    localStorage.setItem("address", address.streetAndNumber);
    setSuggestions([]);
  };

  return (
    <div>
      <div className="autoCompleteInputContainer">
        <TextField
          id="address"
          className="basic-single"
          size="small"
          type="text"
          placeholder="Nhập địa điểm"
          value={streetAndNumber}
          onChange={handleChange}
          sx={{
            width: "15%",
            "& label.Mui-focused": {
              color: "black",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "black",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "gainsboro",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
        />
        <ul className="addressSuggestions">
          {suggestions?.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
