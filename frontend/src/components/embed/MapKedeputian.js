import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";

import Crop from "ol-ext/filter/Crop";
import Mask from "ol-ext/filter/Mask";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Point from "ol/geom/Point";
import Circle from "ol/geom/Circle";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { Box, Grid } from "@mui/material";
import FloatingButton from "./EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Slider from "@mui/material/Slider";
import { fetchFKTPKedeputian, fetchFKTPDetail } from "../../actions/fktpActions";
import { fetchFKRTLKedeputian, fetchFKRTLDetail } from "../../actions/fkrtlActions";
import {
  fetchCenterKedeputian,
  fetchBBOXKedeputian,
} from "../../actions/filterActions";
import GeoJSON from "ol/format/GeoJSON";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Switch } from "@mui/material";
const MapComponent = ({ faskes, kodeKedeputian }) => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";
  const [searchParams] = useSearchParams();

  const [map, setMap] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);
  const [userMarker, setUserMarker] = useState(null);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
  const [showPotentialLayer, setShowPotentialLayer] = useState(false);
  const [userMarkerFeature, setUserMarkerFeature] = useState(null);
  const [markerFeature, setMarkerFeature] = useState(null);
  const [markerSource, setMarkerSource] = useState(null);
  const [markerLayer, setMarkerLayer] = useState(null);
  const [potentialLayerOpacity, setPotentialLayerOpacity] = useState(0.7);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [showFKTPMark, setShowFKTPMark] = useState(false);
  const [showFKRTLMark, setShowFKRTLMark] = useState(false);
  const [showDetailBox, setShowDetailBox] = useState(false);
  const [activeFaskes, setActiveFaskes] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const centerMap = [13124075.715923082, -277949.29803053016];
  const zoomLevel = 10;

  const potentialLayerUrl =
    faskes === "fktp"
      ? "../potential/{z}/{x}/{-y}.png"
      : faskes === "fkrtl"
      ? "../potential_fkrtl/{z}/{x}/{-y}.png"
      : "";
  const testWilayah = [{ label: "Aceh" }, { label: "Palembang" }];
  useEffect(() => {
    dispatch(fetchFKTPKedeputian(kodeKedeputian));
    dispatch(fetchFKRTLKedeputian(kodeKedeputian));
    dispatch(fetchCenterKedeputian(kodeKedeputian));
    dispatch(fetchBBOXKedeputian(kodeKedeputian));
  }, [dispatch, kodeKedeputian]);

  const centerKedeputian = useSelector((state) => state.mapfilter.coordinate);
  const bboxKedeputian = useSelector((state) => state.mapfilter.dataobj);
  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);
  const detailFKTP = useSelector((state) => state.mapfktp.fktpobj);
  const detailFKRTL = useSelector((state) => state.mapfktp.fkrtlobj);

  useEffect(() => {
    if (centerKedeputian && map) {
      map.getView().animate({
        center: centerKedeputian,
        duration: 1000,
        zoom: 9,
      });
    }
  }, [centerKedeputian, map]);

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const handleLayerSelectClick2 = () => {
    setShowFloatingButton2((prevState) => !prevState);
  };

  const handleLegendClick = () => {
    setShowLegend((prevState) => !prevState);
  };

  const handleFilterClick = () => {
    setShowSidebar((prevState) => !prevState);
  };

  const closeDetailBox = () => {
    setShowDetailBox(false);

    // Check if the marker layer already exists
    let markerLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("title") === "Marker");

    // Clear existing features from the marker layer
    markerLayer.getSource().clear();
    map.getView().animate({
      center: centerKedeputian,
      duration: 1000, // Animation duration in milliseconds
      zoom: zoomLevel,
    });
  };

  const handleFktpSwitchChange = () => {
    // Only proceed if markers have been loaded and map is available

    if (map) {
      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");

      const markerFKTPLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "MarkerFKTP");
      const RadiusFKTPLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "RadiusFKTP");

      if (showFKTPMark) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(markerFKTPLayer);
        overlayGroup.getLayers().remove(RadiusFKTPLayer);
      } else {
        if (markerListFKTP) {
          //console.log(detailFKTP);
          const vectorSource = new VectorSource();
          const newMarkerFKTPLayer = new VectorLayer({
            source: vectorSource,
            title: "MarkerFKTP",
          });

          const radiusSource = new VectorSource();
          const newRadiusFKTPLayer = new VectorLayer({
            source: radiusSource,
            title: "RadiusFKTP",
          });

          const features = new GeoJSON().readFeatures(markerListFKTP);
          //console.log(features);
          features.forEach((feature) => {
            const coordinates = feature.getGeometry().getCoordinates();

            const markerFeature = new Feature({
              geometry: new Point(coordinates),
              id: feature.getId(),
            });

            // Style for the marker
            const markerStyle = new Style({
              image: new Icon({
                // anchor: [0.5, 1],
                src: "../images/m2.png",
                scale: 0.5,
                zIndex: 10000,
              }),
            });

            markerFeature.setStyle(markerStyle);

            const circleRadiusMeters = 2000; // 2 kilometers
            const circleGeometry = new Circle(coordinates, circleRadiusMeters);
            const circleFeature = new Feature(circleGeometry);
            const circleStyle = new Style({
              fill: new Fill({
                color: "rgba(0, 0, 255, 0.1)",
              }),
              stroke: new Stroke({
                color: "rgba(0, 0, 255, 0.6)",
                width: 0.5,
              }),
              zIndex: 10,
            });
            circleFeature.setStyle(circleStyle);
            newMarkerFKTPLayer.setZIndex(1000);
            newRadiusFKTPLayer.setZIndex(10);
            radiusSource.addFeatures([circleFeature]);
            vectorSource.addFeatures([markerFeature]);
          });

          overlayGroup.getLayers().push(newMarkerFKTPLayer);
          overlayGroup.getLayers().push(newRadiusFKTPLayer);
        }
      }
      // Update the showPotentialLayer state
      setShowFKTPMark((prevState) => !prevState);
    }
    // You can add additional logic here if needed
  };

  const handleFkrtlSwitchChange = () => {
    // Only proceed if markers have been loaded and map is available
    if (map) {
      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Overlay");

      const markerFKRTLLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "MarkerFKRTL");

      const RadiusFKRTLLayer = overlayGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "RadiusFKRTL");
      if (showFKRTLMark) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(markerFKRTLLayer);
        overlayGroup.getLayers().remove(RadiusFKRTLLayer);
      } else {
        // Your existing code for processing markers
        if (markerListFKRTL) {
          const vectorSource = new VectorSource();
          const newMarkerFKRTLLayer = new VectorLayer({
            source: vectorSource,
            title: "MarkerFKRTL",
          });

          const radiusSource = new VectorSource();
          const newRadiusFKRTLLayer = new VectorLayer({
            source: radiusSource,
            title: "RadiusFKRTL",
          });
          const featuresFKRTL = new GeoJSON().readFeatures(markerListFKRTL);
          //console.log(features);
          featuresFKRTL.forEach((feature) => {
            const coordinates = feature.getGeometry().getCoordinates();

            // Create a marker feature
            const markerFeature = new Feature({
              geometry: new Point(coordinates),
              id: feature.getId(),
            });

            // Style for the marker
            const markerStyle = new Style({
              image: new Icon({
                //anchor: [0.5, 1],
                src: "../images/m3.png",
                scale: 0.5,
                zIndex: 1000,
              }),
            });

            markerFeature.setStyle(markerStyle);

            const circleRadiusMeters = 5000; // 5 kilometers circleRadiusMeters);
            const circleGeometry = new Circle(coordinates, circleRadiusMeters);
            const circleFeature = new Feature(circleGeometry);
            const circleStyle = new Style({
              fill: new Fill({
                color: "rgba(56, 167, 203, 0.1)",
              }),
              stroke: new Stroke({
                color: "rgba(56, 167, 203, 0.6)",
                width: 0.5,
              }),
            });
            circleFeature.setStyle(circleStyle);

            newMarkerFKRTLLayer.setZIndex(1000);
            newRadiusFKRTLLayer.setZIndex(10);
            radiusSource.addFeatures([circleFeature]);
            vectorSource.addFeatures([markerFeature]);
          });

          //  map.addLayer(markerFKTPLayer);
          // Add the potential layer to the overlay group
          overlayGroup.getLayers().push(newMarkerFKRTLLayer);
          overlayGroup.getLayers().push(newRadiusFKRTLLayer);
        }
      }
      // Update the showPotentialLayer state
      setShowFKRTLMark((prevState) => !prevState);
    }
    // You can add additional logic here if needed
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
          title: "Basemap",
          source: new XYZ({
            url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            attributions:
              "&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>",
          }),
        });
      } else if (basemap === "map-switch-basic") {
        basemapLayer = new TileLayer({
          title: "Basemap",
          source: new BingMaps({
            key: bingApiKey,
            imagerySet: "Road",
          }),
        });
      } else if (basemap === "map-switch-topography") {
        basemapLayer = new TileLayer({
          title: "Basemap",
          source: new XYZ({
            url: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
            attributions:
              "&copy;  <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors, <a href='http://viewfinderpanoramas.org'>SRTM</a> | map style: © <a href='https://opentopomap.org'>OpenTopoMap</a> (<a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>)",
          }),
        });
      } else if (basemap === "map-switch-satellite") {
        basemapLayer = new TileLayer({
          title: "Basemap",
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attributions: "&copy; <a href='http://www.esri.com/'>Esri</a>",
            tilePixelRatio: 2,
            maxZoom: 19,
          }),
        });
      } else {
        basemapLayer = new TileLayer({
          title: "Basemap",
          source: new OSM(),
        });
      }

      const basemapGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Basemap");

      /* if (bboxCabang && bboxCabang.features && bboxCabang.features.length > 0) {
        const coords = bboxCabang.features[0].geometry.coordinates;
        const f = new Feature({ geometry: new Polygon(coords) });
        const crop = new Mask({
          feature: f,
          wrapX: true,
          inner: false,
        });

        basemapLayer.addFilter(crop);
      } */

      basemapGroup.getLayers().clear();
      basemapGroup.getLayers().push(basemapLayer);
      setSelectedBasemap(basemap);
    }
  };

  const handlePotentialLayerOpacityChange = (event, newValue) => {
    setPotentialLayerOpacity(newValue);
    if (map) {
      const overlayLayer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "PotentialLayer");
      if (overlayLayer) {
        overlayLayer.setOpacity(newValue);
      }
    }
  };

  useEffect(() => {
    if (bboxKedeputian && bboxKedeputian.features && bboxKedeputian.features.length > 0) {
      const potentialLayer = new TileLayer({
        title: "PotentialLayer",
        source: new XYZ({
          attributions: "",
          minZoom: 2,
          maxZoom: 10,
          url: potentialLayerUrl,
          tileSize: [384, 384],
        }),
      });

      const coords = bboxKedeputian.features[0].geometry.coordinates;
      const f = new Feature({ geometry: new Polygon(coords) });
      const crop = new Crop({
        feature: f,
        wrapX: true,
        inner: false,
        //shadowWidth : 5,
      });

      potentialLayer.addFilter(crop);

      const overlayGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "PotentialLayer");
      overlayGroup.getLayers().clear();
      overlayGroup.getLayers().push(potentialLayer);
    }
  }, [bboxKedeputian, map, potentialLayerUrl]);

  useEffect(() => {
    if (bboxKedeputian && bboxKedeputian.features && bboxKedeputian.features.length > 0) {
      const basemapMask = new TileLayer({
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });
      const coords = bboxKedeputian.features[0].geometry.coordinates;
      const f = new Feature({ geometry: new Polygon(coords) });
      const crop = new Mask({
        feature: f,
        wrapX: true,
        inner: false,
      });

      basemapMask.addFilter(crop);

      const basemapGroup = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Basemap");
      basemapGroup.getLayers().clear();
      basemapGroup.getLayers().push(basemapMask);
    }
  }, [bboxKedeputian, map]);

  useEffect(() => {
    const potentialLayer = new TileLayer({
      title: "PotentialLayer",

      source: new XYZ({
        attributions: "",
        minZoom: 2,
        maxZoom: 10,
        url: potentialLayerUrl,
        tileSize: [384, 384],
      }),
    });

    const map = new Map({
      target: "map",
      controls: defaultControls(),
      layers: [
        new LayerGroup({
          title: "Basemap",
        }),
        new LayerGroup({
          title: "Basemap",
        }),
        new LayerGroup({
          title: "PotentialLayer",
          layers: [potentialLayer],
        }),
        new LayerGroup({
          title: "Overlay",
        }),
      ],
      view: new View({
        center: centerMap,
        zoom: zoomLevel,
        maxZoom: 20,
      }),
    });

    setMap(map);
    setMarkersLoaded(true);

    // Create the circle feature with a 2-kilometer radius
    const additionalCircleFeature = new Feature({
      geometry: new Circle(centerMap, 2000), // Radius in meters (2 kilometers)
    });

    additionalCircleFeature.setStyle(
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
    map.on("singleclick", (event) => {
      const clickedFeature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature, layer) => ({ feature, layer })
      );

      if (clickedFeature && clickedFeature.feature) {
        const featureId = clickedFeature.feature.get("id");

        if (featureId !== undefined) {
          const layerName = clickedFeature.layer.get("title");
          if (layerName === "MarkerFKTP") {
            dispatch(fetchFKTPDetail(featureId));
            setActiveFaskes("FKTP");
          } else if (layerName === "MarkerFKRTL") {
            dispatch(fetchFKRTLDetail(featureId));
            setActiveFaskes("FKRTL");
          } else {
            console.warn("Feature ID is undefined");
          }
        } else {
          console.warn("Feature ID is undefined");
        }
      }
    });

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
  useEffect(() => {
    if (detailFKTP && detailFKTP.length > 0) {
      addOrUpdateMarker(
        detailFKTP[0].lon,
        detailFKTP[0].lat,
        "../images/p1.png"
      );
    }
  }, [detailFKTP]);

  useEffect(() => {
    if (detailFKRTL && detailFKRTL.length > 0) {
      addOrUpdateMarker(
        detailFKRTL[0].lon,
        detailFKRTL[0].lat,
        "../images/p1.png"
      );
    }
  }, [detailFKRTL]);

  const addOrUpdateMarker = (lon, lat, iconSrc) => {
    setShowDetailBox(true);
    const coordinates = fromLonLat([lon, lat]);

    // Check if the marker layer already exists
    let markerLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("title") === "Marker");

    // If the marker layer doesn't exist, create a new one
    if (!markerLayer) {
      const markerSource = new VectorSource();
      markerLayer = new VectorLayer({
        source: markerSource,
        zIndex: 4,
        title: "Marker",
      });
      map.addLayer(markerLayer);
    }

    // Clear existing features from the marker layer
    markerLayer.getSource().clear();

    // Add a new marker with updated coordinates and specified icon
    const markerFeature = new Feature({
      geometry: new Point(coordinates),
    });
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: iconSrc,
        scale: 0.8,
        zIndex: 10000,
      }),
    });

    markerFeature.setStyle(markerStyle);
    markerLayer.getSource().addFeature(markerFeature);
    markerLayer.setZIndex(1000);

    // Animate the map to the new coordinates
    map.getView().animate({
      center: coordinates,
      duration: 500, // Animation duration in milliseconds
      zoom: 15,
    });
  };

  const cardHeaderStyle = {
    background: "linear-gradient(to right, #0F816F, #274C8B)", // Adjust gradient colors as needed
    color: "white", // Set text color to contrast with the background
  };

  const titleStyle = {
    fontSize: "1.2rem", // Set the desired font size for the title
  };

  const subheaderStyle = {
    fontSize: "0.8rem", // Set the desired font size for the subheader
    color: "lightgray",
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
          showFKTPMark={showFKTPMark}
          showFKRTLMark={showFKRTLMark}
          handleFktpSwitchChange={handleFktpSwitchChange}
          handleFkrtlSwitchChange={handleFkrtlSwitchChange}
        />
      </div>

      <div className="legend-button-embed" onClick={handleLegendClick}>
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
      </div>

      {showLegend && (
        <div className="legend-box-embed" onClick={handleLegendClick}>
          {faskes === "fkrtl" ? (
            <img
              src="../images/legend-fkrtl.png"
              width="225px"
              height="350px"
            />
          ) : (
            <img src="../images/legend-fktp.png" width="225px" height="300px" />
          )}
        </div>
      )}

      <div className="filter-button-embed" onClick={handleFilterClick}>
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className={`sidebar-filter ${showSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <Typography>Filter</Typography>
        </div>
        <div className="sidebar-content">
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Nama Faskes"
                  variant="outlined"
                  size={"small"}
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Alamat Faskes"
                  variant="outlined"
                  size={"small"}
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography>Jenis Faskes</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Rumah Sakit"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Rumah Sakit"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Rumah Sakit"
                  />
                </FormGroup>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography>Wilayah</Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Autocomplete
                  disablePortal
                  size={"small"}
                  fullWidth
                  id="combo-box-demo"
                  options={testWilayah}
                  renderInput={(params) => (
                    <TextField {...params} label="Wilayah" />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography>Rasio Dokter</Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
               <Typography fontSize={12}>  {"< 5000"} <Switch /> {">= 5000"}</Typography> 
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography>Kelas RS</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="A"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="B"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="C"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="D"
                  />
                </FormGroup>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography fon>Pelayanan Canggih</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Cathlab"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Sarana Radioterapi"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Sarana Kemoterapi"
                  />
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
        </div>
        <div className="sidebar-footer">
          <Box  sx={{ m: 1}}>
          <Grid container spacing={0.5}  >
            <Grid item xs={6}>
     
                <Button variant="contained" fullWidth onClick={handleFilterClick}>Tutup</Button>
           
            </Grid>
            <Grid item xs={6}>
    
                <Button variant="contained" fullWidth size="medium"  onClick={handleFilterClick}>Terapkan</Button>
             
            </Grid>
          </Grid>
          </Box>
         
        </div>
      </div>

      {showDetailBox && (
        <div className="detail-box" onClick={closeDetailBox}>
          <Card sx={{ maxWidth: 345 }}>
            {/*  <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image="images/Kantor-BPJS.jpg"
            /> */}
            <CardHeader
              title={detailFKTP[0].nmppk}
              subheader={
                activeFaskes + ` | KODE FASKES : ${detailFKTP[0].faskesid}`
              }
              style={cardHeaderStyle}
              titleTypographyProps={{ style: titleStyle }}
              subheaderTypographyProps={{ style: subheaderStyle }}
            />
            <CardContent>
              <Typography fontSize={12}>
                <table className="table-card">
                  <tbody>
                    <tr>
                      <td style={{ width: "150px" }}>
                        <strong>KEDEPUTIAN WILAYAH</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].kwppk}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>KANTOR CABANG</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].kcppk}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>
                          {activeFaskes === "FKRTL" ? "KELAS RS" : "JENIS"}
                        </strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>
                        {activeFaskes === "FKRTL"
                          ? detailFKTP[0].kelasrs
                          : detailFKTP[0].jenisfaskes}
                      </td>
                    </tr>
                    {activeFaskes === "FKRTL" ? (
                      <tr>
                        <td>
                          <strong>PELAYANAN CANGGIH</strong>
                        </td>
                        <td>
                          <strong>:</strong>
                        </td>
                        <td>{detailFKTP[0].pelayanancanggih}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>
                        <strong>ALAMAT</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].alamatppk}</td>
                    </tr>
                  </tbody>
                </table>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={closeDetailBox}>
                Tutup
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapfktp: state.mapfktp,
    mapfkrtl: state.mapfkrtl,
    mapfilter: state.mapfilter,
  };
};

export default connect(mapStateToProps)(MapComponent);
