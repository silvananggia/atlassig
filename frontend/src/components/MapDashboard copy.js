import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // Import the OpenLayers CSS
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import BingMaps from "ol/source/BingMaps";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import Box from "@mui/material/Box";
import { Switch } from "@mui/material";
import FloatingButton from "./FloatingButton";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [basemap, setBasemap] = useState("map-switch-default");
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showLayer, setShowLayer] = useState(false);
  const [showUncoveredLayer, setShowUncoveredLayer] = useState(false);
  const [showMarker, setShowMarker] = useState(true);
  const [showOverlayLayer, setShowOverlayLayer] = useState(false); // Added state for overlay layer

  const handleChangeLayer = () => {
    setShowLayer((prevShowLayer) => !prevShowLayer);
  };

  const handleChangeUncoveredLayer = () => {
    setShowUncoveredLayer((prevShowUncoveredLayer) => !prevShowUncoveredLayer);
  };

  const handleChange = () => {
    setShowMarker((prevShowMarker) => !prevShowMarker);
  };

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const changeBasemap = (newBasemap) => {
    setBasemap(newBasemap);
  };

  const basemapOptions = [
    { key: "map-switch-default", label: "Default" },
    { key: "map-switch-basic", label: "Bing Maps" },
    { key: "map-switch-sattelite", label: "Imagery" },
    { key: "map-switch-topography", label: "Topography" },
  ];

  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  useEffect(() => {
    let basemapLayer;

    if (basemap === "map-switch-default") {
      basemapLayer = new TileLayer({
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });
    } else if (basemap === "map-switch-basic") {
      basemapLayer = new TileLayer({
        source: new BingMaps({
          key: bingApiKey,
          imagerySet: "Road",
        }),
      });
    } else if (basemap === "map-switch-topography") {
      basemapLayer = new TileLayer({
        source: new XYZ({
          url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
        }),
      });
    } else if (basemap === "map-switch-sattelite") {
      basemapLayer = new TileLayer({
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          tilePixelRatio: 2,
          maxZoom: 20,
        }),
      });
    } else {
      basemapLayer = new TileLayer({
        source: new OSM(),
      });
    }

    const overlay = new TileLayer({
      source: new XYZ({
        url: "http://10.27.59.239/potential/{z}/{x}/{-y}.png",
      }),
      visible: showOverlayLayer, // Control visibility here
    });

    // Create a new map instance only when the basemap changes
    const map = new Map({
      target: mapRef.current,
      layers: [basemapLayer, overlay],
      view: new View({
        center: fromLonLat([118.0149, -2.5489]),
        zoom: 5,
      }),
    });

    return () => {
      map.setTarget(null);
    };
  }, [basemap, showOverlayLayer]); // Update the map when basemap or overlay layer visibility changes

  useEffect(() => {
    setShowOverlayLayer(showLayer && showUncoveredLayer);
  }, [showLayer, showUncoveredLayer]);

  return (
    <Box className="contentRoot">
      <div ref={mapRef} className="map"></div>
      <div
        className="layer-select"
        id={basemap}
        onClick={handleLayerSelectClick}
      ></div>

      {showFloatingButton && (
        <FloatingButton
          basemapOptions={basemapOptions}
          basemap={basemap}
          changeBasemap={changeBasemap}
        />
      )}

      <div className="filter-box">
        
        <Switch
          checked={showLayer}
          onChange={handleChangeLayer}
          inputProps={{ "aria-label": "controlled" }}
        />{" "}Potensial Layer
        <br />
       
        <Switch
          checked={showUncoveredLayer}
          onChange={handleChangeUncoveredLayer}
          inputProps={{ "aria-label": "controlled" }}
        />{" "}Unocovered Layer
        <br />
        
        <Switch
          checked={showMarker}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />{" "}
        Titik Faskes
      </div>
    </Box>
  );
};

export default MapComponent;
