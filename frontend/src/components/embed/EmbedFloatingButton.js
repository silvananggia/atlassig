import React from "react";
import Typography from "@mui/material/Typography";
import { Divider, Slider, Switch } from "@mui/material";

const FloatingButton = ({
  basemapOptions,
  basemap,
  changeBasemap,
  potentialLayerOpacity,
  handlePotentialLayerOpacityChange,
  faskesType,
  showFKTPMark, // Add the FKTP switch state
  showFKRTLMark,
  handleFktpSwitchChange, // Add the handler for FKTP switch change
  handleFkrtlSwitchChange,
}) => {
  return (
    <div className="embed-floating-button">
      <Typography id="opacity-slider-label" fontSize={12}>
        Peta Potensi {faskesType.toUpperCase()}: 
      </Typography>{" "}
      <div className="opacity-slider">
      <Slider
        value={potentialLayerOpacity}
        onChange={handlePotentialLayerOpacityChange}
        size="small"
        aria-labelledby="opacity-slider-label"
        step={0.1}
        min={0}
        max={1}
        
      />
      </div>
      
      <Typography fontSize={12}>
      <Switch checked={showFKTPMark} onChange={handleFktpSwitchChange} /> Titik FKTP
      </Typography>
      {faskesType !== "fktp" && (
      <Typography fontSize={12}>
      <Switch checked={showFKRTLMark} onChange={handleFkrtlSwitchChange} /> Titik FKRTL
      </Typography>
      )}
      <Divider/>
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
            <div className={`label-basemap ${basemap === option.key ? "active" : ""}`}>
            <Typography fontSize={10} align="center"> {option.label}</Typography>
            </div>{" "}
            {/* Label below div */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingButton;
