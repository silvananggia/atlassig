import React, { useEffect, useState } from "react";
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
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import Box from "@mui/material/Box";
import { Divider, Switch } from "@mui/material";
import FloatingButton from "./FloatingButton";
import LayerGroup from "ol/layer/Group";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


const MapComponent = () => {
  const centerMap = [118.0149, -2.5489];
  const zoomLevel = 6;
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showOverlayList, setShowOverlayList] = useState(false);
  const [userMarker, setUserMarker] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState(centerMap);
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
  const [showPotentialLayer, setShowPotentialLayer] = useState(false);
  const [showUncoveredLayer, setShowUncoveredLayer] = useState(false);
  const [showPotentialFkrtl, setShowPotentialFkrtl] = useState(false);
  const [additionalMarker, setAdditionalMarker] = useState(null);
  const [showDetailBox, setShowDetailBox] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen);
  };

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const handleOverlayClick = () => {
    setShowOverlayList((prevState) => !prevState);
  };

  const closeDetailBox = () => {
    setShowDetailBox(false);
    // map.getView().setZoom(zoomLevel);
  };

  const togglePotentialLayer = () => {
    if (map) {
      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");

      const potentialLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "PotentialLayer");

      if (showPotentialLayer) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(potentialLayer);
      } else {
        // Create a new TileLayer for the potential layer
        const newPotentialLayer = new TileLayer({
          source: new XYZ({
            attributions: "",
            minZoom: 2,
            maxZoom: 10,
            url: "potential/{z}/{x}/{-y}.png",
            tileSize: [384, 384],
          }),
          title: "PotentialLayer",
        });

        // Add the potential layer to the overlay group
        overlayGroup.getLayers().push(newPotentialLayer);
      }

      // Update the showPotentialLayer state
      setShowPotentialLayer((prevState) => !prevState);
    }
  };

  const toggleUncoveredLayer = () => {
    if (map) {
      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");

      const uncoveredLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "UncoveredLayer");

      const newUncoveredLayer = new TileLayer({
        source: new XYZ({
          attributions: "",
          minZoom: 2,
          maxZoom: 10,
          url: "uncovered/{z}/{x}/{-y}.png",
          tileSize: [384, 384],
        }),
        title: "UncoveredLayer",
      });

      if (showUncoveredLayer) {
        // Remove the UncoveredLayer from the overlay group
        overlayGroup.getLayers().remove(uncoveredLayer);
      } else {
        // Add the UncoveredLayer to the overlay group
        overlayGroup.getLayers().push(newUncoveredLayer);
      }

      // Update the showUncoveredLayer state
      setShowUncoveredLayer((prevState) => !prevState);
    }
  };

  const togglePotentialFkrtl = () => {
    if (map) {
      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");

      const potentialFkrtl = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "PotentialLayer");

      if (showPotentialFkrtl) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(potentialFkrtl);
      } else {
        // Create a new TileLayer for the potential layer
        const newPotentialFkrtl = new TileLayer({
          source: new XYZ({
            attributions: "",
            minZoom: 2,
            maxZoom: 10,
            url: "potential_fkrtl/{z}/{x}/{-y}.png",
            tileSize: [384, 384],
          }),
          title: "PotentialLayer",
        });

        // Add the potential layer to the overlay group
        overlayGroup.getLayers().push(newPotentialFkrtl);
      }

      // Update the showPotentialLayer state
      setShowPotentialFkrtl((prevState) => !prevState);
    }
  };

  const basemapOptions = [
    { key: "map-switch-default", label: "Default" },
    { key: "map-switch-basic", label: "Bing Maps" },
    { key: "map-switch-satellite", label: "Satellite" },
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
            attributions:
              "&copy;  <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors, <a href='http://viewfinderpanoramas.org'>SRTM</a> | map style: © <a href='https://opentopomap.org'>OpenTopoMap</a> (<a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>)",
          }),
        });
      } else if (basemap === "map-switch-satellite") {
        basemapLayer = new TileLayer({
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: "&copy; <a href='http://www.esri.com/'>Esri</a>",
            tilePixelRatio: 2,
            maxZoom: 19,
          }),
        });
      } else {
        basemapLayer = new TileLayer({
          source: new OSM(),
        });
      }

      map.getLayers().item(0).setSource(basemapLayer.getSource());
      setSelectedBasemap(basemap);
    }
  };

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
          layers: [],
        }),
      ],
      view: new View({
        center: fromLonLat(centerMap),
        zoom: zoomLevel,
        maxZoom: 20,
      }),
    });

    setMap(map);

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
    setUserMarker(userMarkerFeature);

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
          src: "images/location-pin.png",
          zIndex: 2,
        }),
      })
    );
    markerSource.addFeature(markerFeature);
    markerLayer.setZIndex(2);
    setMarker(markerFeature);

    const additionalMarkerSource = new VectorSource();
    const additionalMarkerLayer = new VectorLayer({
      source: additionalMarkerSource,
      zIndex: 3, // Adjust the zIndex as needed
    });

    map.addLayer(additionalMarkerLayer);

    const centerCoordinates = fromLonLat([106.687623, -6.400652]); // Replace with your desired coordinates

    // Create the marker feature
    const additionalMarkerFeature = new Feature({
      geometry: new Point(centerCoordinates),
    });

    let baseScale = 0.5;

    additionalMarkerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "images/m2.png", // Path to your marker icon
          zIndex: 3, // Adjust the zIndex as needed
          scale: baseScale, // Apply the base scale factor initially
          imgSize: [30, 30], // Fixed size for the icon
        }),
      })
    );

    // Add a change listener to the map's view to handle zoom level changes
    map.getView().on("change:resolution", (event) => {
      const zoomLevel = map.getView().getZoom();
      let newScale = baseScale;

      // Define zoom levels where you want to adjust the marker size
      if (zoomLevel >= 10) {
        newScale = baseScale * 2; // Double the size at zoom level 10 and above
      } else if (zoomLevel <= 8) {
        newScale = baseScale * 0.5; // Half the size at zoom level 8 and below
      }

      // Update the marker's scale based on the current zoom level
      additionalMarkerFeature.getStyle().getImage().setScale(newScale);
    });
    additionalMarkerSource.addFeature(additionalMarkerFeature);

    // Create the circle feature with a 2-kilometer radius
    const additionalCircleFeature = new Feature({
      geometry: new Circle(centerCoordinates, 2000), // Radius in meters (2 kilometers)
    });

    additionalCircleFeature.setStyle(
      new Style({
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.2)", // Blue circle with 20% opacity
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 255, 0.7)", // Blue border with 70% opacity
          width: 2,
        }),
      })
    );

    const additionalCircleSource = new VectorSource({
      features: [additionalCircleFeature],
    });

    const additionalCircleLayer = new VectorLayer({
      source: additionalCircleSource,
      zIndex: 2, // Adjust the zIndex as needed
    });

    map.addLayer(additionalCircleLayer);

    setAdditionalMarker(additionalMarkerFeature);

    map.on("singleclick", (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (clickedFeature === additionalMarkerFeature) {
        map.getView().setCenter(centerCoordinates);
        map.getView().setZoom(14);
        setShowDetailBox(true);
      }
    });

    const translate = new Translate({
      features: new Collection([markerFeature]),
    });
    map.addInteraction(translate);

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

    markerFeature.on("change", () => {
      const coordinates = markerFeature.getGeometry().getCoordinates();
      const lonLat = toLonLat(coordinates);
      markerOverlay.setPosition(coordinates);
      setMarkerPosition(lonLat);

      window.parent.postMessage(
        {
          type: "MarkerPosition",
          latitude: lonLat[1],
          longitude: lonLat[0],
        },
        "http://localhost:8000"
      );
    });

    // Get the device's current location and zoom to it
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lonLat = [position.coords.longitude, position.coords.latitude];
        const coordinates = fromLonLat(lonLat);

        // Set the map's view to the device's location
        map.getView().setCenter(coordinates);
        map.getView().setZoom(zoomLevel); // Adjust the zoom level as needed

        // Set the user's marker's position to the device's location
        userMarkerFeature.getGeometry().setCoordinates(coordinates);

        // Set the marker's position to the device's location
        markerFeature.getGeometry().setCoordinates(coordinates);

        // Update the user marker position state
        setUserLocation(lonLat);
        // Update the marker position state
        setMarkerPosition(lonLat);
      });
    }
    return () => {
      map.removeInteraction(translate);
    };
  }, []);

  return (
    <Box className="contentRoot">
      <div id="map" className="map"></div>

      <div
        className="layer-select"
        id={selectedBasemap}
        onClick={handleLayerSelectClick}
      ></div>

      <div className="basemap-select hidden">
        <FloatingButton
          basemapOptions={basemapOptions}
          basemap={selectedBasemap}
          changeBasemap={changeBasemap}
        />
      </div>

      <div className="overlay-select" onClick={handleOverlayClick}>
        <div className="button-container">
          <LayersOutlinedIcon fontSize="medium" />
          <div className="label">Layer</div>
        </div>
      </div>

      <div className="overlay-box hidden">
        <Divider>FKTP</Divider>
        <div className="label">Fasilitas Kesehatan Tingkat Pertama</div>
        <Switch checked={showPotentialLayer} onChange={togglePotentialLayer} />
        Peta Potensi FKTP
        <br />
        <Switch checked={showUncoveredLayer} onChange={toggleUncoveredLayer} />
        Peta Uncovered FKTP
        <br />
        <Switch />
        Titik FKTP
        <Divider>FKRTL</Divider>
        <div className="label">Fasilitas Kesehatan Rujukan Tingkat Lanjut </div>
        <Switch checked={showPotentialFkrtl} onChange={togglePotentialFkrtl} />
        Peta Potensi FKRTL
        <br />
        <Switch />
        Peta Uncovered FKRTL
        <br />
        <Switch />
        Titik FKRTL
        <br />
      </div>

      <div className="filter-box">
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
          <div className="label">Filter</div>
        </div>
      </div>

      <div className="filter-content hidden">
        Filter
      </div>
      {showDetailBox && (
        <div className="detail-box" onClick={closeDetailBox}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image="images/Kantor-BPJS.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Nama Faskes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lizards are a widespread group of squamate reptiles, with over
                6,000 species, ranging across all continents except Antarctica
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Detail</Button>
              <Button size="small" onClick={closeDetailBox}>
                Close
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
      {/* Collapsible sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? (
            <span className="caret">&#x25B6;</span>
          ) : (
            <span className="caret">&#x25C0;</span>
          )}
        </div>
        {/* Sidebar content goes here */}
        <div className="sidebar-content">
         <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="FKTP" {...a11yProps(0)} />
          <Tab label="FKRTL" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>

      </SwipeableViews>
        </div>
      </div>
    </Box>
  );
};

export default MapComponent;
