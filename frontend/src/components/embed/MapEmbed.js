import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
} from "ol/style.js";
import Box from "@mui/material/Box";
import FloatingButton from "./EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";

import Typography from "@mui/material/Typography";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import Slider from "@mui/material/Slider";
import { fetchMarkers } from "../../actions/mapActions";

const MapComponent = (props) => {
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(Number(searchParams.get("lat")));
  const [lon, setLot] = useState(Number(searchParams.get("lon")));
  const [faskes, setFaskes] = useState(searchParams.get("faskes"));
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [userMarker, setUserMarker] = useState(null);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([lon, lat]); // Move centerMap declaration here
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
  const [showPotentialLayer, setShowPotentialLayer] = useState(false);
  const [userMarkerFeature, setUserMarkerFeature] = useState(null);
  const [markerFeature, setMarkerFeature] = useState(null);
  const [markerSource, setMarkerSource] = useState(null);
  const [markerLayer, setMarkerLayer] = useState(null);
  const [potentialLayerOpacity, setPotentialLayerOpacity] = useState(0.7);
  const [markersLoaded, setMarkersLoaded] = useState(false);

  const centerMap = [lon, lat]; // Move this line above its usage
  const zoomLevel = 15;

  useEffect(() => {
    props.loadmarker();
  }, []);

  const markerList = useSelector((state) => state.mapfktp.markerlist);

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const basemapOptions = [
    { key: "map-switch-default", label: "Default" },
    { key: "map-switch-basic", label: "Bing Maps" },
    { key: "map-switch-satellite", label: "Imagery" },
    { key: "map-switch-topography", label: "Topography" },
  ];

  const changeBasemap = (basemap) => {
    if (map) {
      let basemapLayer;

      if (basemap === "map-switch-default") {
        basemapLayer = new TileLayer({
          source: new XYZ({
            url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attributions:
              "&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>",
          }),
          zIndex: 1,
        });
      } else if (basemap === "map-switch-basic") {
        basemapLayer = new TileLayer({
          source: new BingMaps({
            key: bingApiKey,
            imagerySet: "Road",
          }),
          zIndex: 1,
        });
      } else if (basemap === "map-switch-topography") {
        basemapLayer = new TileLayer({
          source: new XYZ({
            url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
            attributions:
              "&copy;  <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors, <a href='http://viewfinderpanoramas.org'>SRTM</a> | map style: © <a href='https://opentopomap.org'>OpenTopoMap</a> (<a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>)",
          }),
          zIndex: 1,
        });
      } else if (basemap === "map-switch-satellite") {
        basemapLayer = new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: "&copy; <a href='http://www.esri.com/'>Esri</a>",
            tilePixelRatio: 2,
            maxZoom: 19,
          }),
          zIndex: 1,
        });
      } else {
        basemapLayer = new TileLayer({
          source: new OSM(),
           zIndex: 1,
        });
      }

      map.getLayers().item(0).setSource(basemapLayer.getSource());
      setSelectedBasemap(basemap);
    }
  };

  const handlePotentialLayerOpacityChange = (event, newValue) => {
    setPotentialLayerOpacity(newValue);
    if (map) {
      const overlayLayer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");
      if (overlayLayer) {
        overlayLayer.setOpacity(newValue);
      }
    }
  };
  useEffect(() => {
    // Only proceed if markers have been loaded and map is available
    if (markersLoaded && map) {
      // Your existing code for processing markers
      if (markerList && markerList.length > 0) {
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });
  
    

        markerList.forEach((location) => {
          const coordinates = fromLonLat([
            parseFloat(location.longitude),
            parseFloat(location.latitude),
          ]);
  
          // Create a marker feature
          const markerFeature = new Feature({
            geometry: new Point(coordinates),
          });
  
          // Style for the marker
          const markerStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: "images/m2.png",
              zIndex: 2,
            }),
          });

         markerFeature.setStyle(markerStyle);
         
          const circleRadiusMeters = 2000; // 2 kilometers
          const circleGeometry = new Circle(coordinates, circleRadiusMeters);
          const circleFeature = new Feature(circleGeometry);
          const circleStyle =  new Style({
            fill: new Fill({
              color: "rgba(0, 0, 255, 0.2)", // Blue circle with 20% opacity
            }),
            stroke: new Stroke({
              color: "rgba(0, 0, 255, 0.7)", // Blue border with 70% opacity
              width: 2,
            }),
          })
          circleFeature.setStyle(circleStyle);
          vectorSource.addFeatures([markerFeature,circleFeature]);
        });
        
        map.addLayer(vectorLayer);

      }
    }
  }, [markersLoaded, map, markerList]);
      

  useEffect(() => {
    const map = new Map({
      target: "map",
      controls: defaultControls(),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          }),
        }),
        new LayerGroup({
          title: "Overlay",
          layers: [
            new TileLayer({
              title: "Overlay",
              // opacity: 0.7,
              extent: [
                10579526.106266, -1183786.742609, 15698284.718149,
                658788.158935,
              ],
              source: new XYZ({
                attributions: "",
                minZoom: 2,
                maxZoom: 10,
                url: "potential/{z}/{x}/{-y}.png",
                tileSize: [384, 384],
              }),
            }),
          ],
        }),
      ],
      view: new View({
        center: fromLonLat(centerMap),
        zoom: zoomLevel,
        maxZoom: 20,
      }),
    });

    setMap(map);
    setMarkersLoaded(true);

    const userMarkerSource = new VectorSource();
    const userMarkerLayer = new VectorLayer({
      source: userMarkerSource,
      zIndex: 1,
    });

    map.addLayer(userMarkerLayer);

    const userMarkerFeature = new Feature({
      geometry: new Point(fromLonLat([0, 0])),
    });
    userMarkerFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          zIndex: 1,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );
    userMarkerSource.addFeature(userMarkerFeature);
    userMarkerLayer.setZIndex(1);
    setUserMarkerFeature(userMarkerFeature);

    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
      zIndex: 2,
    });

    map.addLayer(markerLayer);

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat(centerMap)),
    });
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "images/m1.png",
          zIndex: 2,
        }),
      })
    );


    const cRadiusMeters = 2000; // 2 kilometers
    const cGeometry = new Circle(centerMap, cRadiusMeters);
    const cFeature = new Feature(cGeometry);
    const cStyle =  new Style({
      fill: new Fill({
        color: "rgba(0, 0, 255, 0.2)", // Blue circle with 20% opacity
      }),
      stroke: new Stroke({
        color: "rgba(0, 0, 255, 0.7)", // Blue border with 70% opacity
        width: 2,
      }),
    })
    cFeature.setStyle(cStyle);

    markerSource.addFeature(markerFeature,cFeature);
    markerLayer.setZIndex(2);
    setMarkerFeature(markerFeature);
    setMarkerSource(markerSource);
    setMarkerLayer(markerLayer);
    setMarkerPosition(centerMap);


    const markerOverlay = new Overlay({
      element: document.getElementById("marker-overlay"),
      positioning: "bottom-center",
      offset: [0, -20],
    });
    map.addOverlay(markerOverlay);

    const userMarkerOverlay = new Overlay({
      element: document.getElementById("user-marker-overlay"),
      positioning: "bottom-center",
      offset: [0, -20],
    });
    map.addOverlay(userMarkerOverlay);

    userMarkerFeature.on("change", () => {
      const coordinates = userMarkerFeature.getGeometry().getCoordinates();
      const lonLat = toLonLat(coordinates);
      userMarkerOverlay.setPosition(coordinates);
      setUserLocation(lonLat);
    });

    // Get the device's current location and zoom to it
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lonLat = [position.coords.longitude, position.coords.latitude];
        const coordinates = fromLonLat(lonLat);
        userMarkerFeature.getGeometry().setCoordinates(coordinates);
        setUserLocation(lonLat);
      });
    }
    return () => {};
  }, []);

  const handleCenterGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lonLat = [position.coords.longitude, position.coords.latitude];
        const coordinates = fromLonLat(lonLat);

        map.getView().animate({
          center: coordinates,
          duration: 1000, // Animation duration in milliseconds
          zoom: zoomLevel,
        });

        userMarkerFeature.getGeometry().setCoordinates(coordinates);
  
        setUserLocation(lonLat);
      });
    }
  };

  return (
    <Box className="contentRoot">
      <div id="map" className="map"></div>
      {/* Center Geolocation Button */}
      <button
        onClick={handleCenterGeolocation}
        className="center-geolocation-button"
      >
        <MyLocationOutlinedIcon className="img" />
      </button>
      <div
        className="layer-select-embed"
        id={selectedBasemap}
        onClick={handleLayerSelectClick}
      ></div>

      <div className="basemap-select hidden">
        <FloatingButton
          basemapOptions={basemapOptions}
          basemap={selectedBasemap}
          changeBasemap={changeBasemap}
          potentialLayerOpacity={potentialLayerOpacity} // Pass potentialLayerOpacity
          handlePotentialLayerOpacityChange={handlePotentialLayerOpacityChange} // Pass handlePotentialLayerOpacityChange
          faskesType={faskes}
        />
      </div>
      <div className="coordinate-box-embed">
        <p className="label">
          Latitude: {markerPosition[1].toFixed(6)}, Longitude:{" "}
          {markerPosition[0].toFixed(6)} | User Latitude:{" "}
          {userLocation[1].toFixed(6)}, User Longitude:{" "}
          {userLocation[0].toFixed(6)}
        </p>
      </div>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapfktp: state.mapfktp,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadmarker: () => dispatch(fetchMarkers()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
