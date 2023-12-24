import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Slider, Switch } from "@mui/material";

const FloatingButton = ({
  basemapOptions,
  basemap,
  changeBasemap,
  potentialLayerOpacity,
  handlePotentialLayerOpacityChange,
  overlayLayerOpacity,
  handleOverlayOpacityChange,
  faskesType,
  showFKTPMark, // Add the FKTP switch state
  showFKRTLMark,
  handleFktpSwitchChange, // Add the handler for FKTP switch change
  handleFkrtlSwitchChange,
  leftPosition,
}) => {
  return (
    <div className="embed-floating-button" style={{ left: leftPosition }}>
      <Typography id="opacity-slider-label" fontSize={12}>
        Transparansi Peta Potensi {faskesType.toUpperCase()}:
      </Typography>{" "}
      <div className="opacity-slider">
        <Slider
          value={potentialLayerOpacity}
          onChange={handlePotentialLayerOpacityChange}
          size="small"
          aria-labelledby="opacity-slider-label"
          step={0.1}
          min={0.2}
          max={1}
        />
      </div>
      <Typography id="opacity-slider-label" fontSize={12}>
        Transparansi Radius :
      </Typography>{" "}
      <div className="opacity-slider">
        <Slider
          id="slider-opacity"
          value={overlayLayerOpacity}
          onChange={handleOverlayOpacityChange}
          size="small"
          aria-labelledby="opacity-slider-label"
          step={0.1}
          min={0.3}
          max={1}
        />
      </div>
      <Typography fontSize={12}>
        <Switch
          id="switch-fktp"
          checked={showFKTPMark}
          onChange={handleFktpSwitchChange}
        />{" "}
        Titik FKTP
      </Typography>
      {faskesType !== "fktp" && (
        <Typography fontSize={12}>
          <Switch
            id="switch-fkrtl"
            checked={showFKRTLMark}
            onChange={handleFkrtlSwitchChange}
          />{" "}
          Titik FKRTL
        </Typography>
      )}
      <Divider />
      <Typography id="opacity-slider-label" fontSize={12}>
        Peta Dasar :
      </Typography>{" "}
      <div className="basemap-option">
        {basemapOptions.map((option) => (
          <div key={option.key} className="button-container-embed">
            <div
              className={`image ${basemap === option.key ? "active" : ""}`}
              id={option.key}
              onClick={() => changeBasemap(option.key)}
            ></div>
            <div
              className={`label-basemap ${
                basemap === option.key ? "active" : ""
              }`}
            >
              <Typography fontSize={10} align="center">
                {" "}
                {option.label}
              </Typography>
            </div>{" "}
            {/* Label below div */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingButton;
