import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";

import Crop from "ol-ext/filter/Crop";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import Button from "@mui/material/Button";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Translate } from "ol/interaction";
import Collection from "ol/Collection";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import {Box,Grid} from "@mui/material";
import FloatingButton from "./FloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slider from "@mui/material/Slider";
import { Divider, Switch } from "@mui/material";

import { fetchMarkersFKTP, fetchFKTPDetail } from "../../actions/fktpActions";
import { fetchMarkersFKRTL, fetchFKRTLDetail } from "../../actions/fkrtlActions";
import {
  fetchCenterCabang,
  fetchBBOXCabang,
  fetchAutoWilayah,
  fetchJenisFKRTL,
  fetchJenisFKTP,
  fetchFilterFKTPList,
  fetchFilterFKRTLList,
} from "../../actions/filterActions";
import GeoJSON from "ol/format/GeoJSON";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import CardFaskes from "../embed/CardFaskes";
const MapComponent = () => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);
  const [showOverlayList, setShowOverlayList] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);
  const [faskes, setFaskes] = useState("fktp");
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const [centerMap, setCenterMap] = useState([0, 0]);
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
  const [showPotentialLayer, setShowPotentialLayer] = useState(false);
  const [showUncoveredLayer, setShowUncoveredLayer] = useState(false);
  const [showPotentialFkrtl, setShowPotentialFkrtl] = useState(false);
  
  const [userMarkerFeature, setUserMarkerFeature] = useState(null);

  const [potentialLayerOpacity, setPotentialLayerOpacity] = useState(0.7);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [latitude, setLatitude] = useState(-2.5489);
  const [longitude, setLongitude] = useState(118.0149);
  const [showFKTPMark, setShowFKTPMark] = useState(false);
  const [showFKRTLMark, setShowFKRTLMark] = useState(false);
  const [showDetailBox, setShowDetailBox] = useState(false);
  const [activeFaskes, setActiveFaskes] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSidebarData, setShowSidebarData] = useState(false);
  const [selectedWilayah, setselectedWilayah] = useState();
  const listKelasRS = ["A", "B", "C", "D", "nan"];
  const listCanggih = ["Cathlab", "Sarana Radioterapi", "Sarana Kemoterapi", "nan"];

  //input
  const [inputNama, setInputNama] = useState(null);
  const [inputAlamat, setInputAlamat] = useState(null);
  const [inputJenis, setInputJenis] = useState([]);
  const [inputwilayah, setInputWilayah] = useState(null);
  const [inputRasio, setInputRasio] = useState(false);
  const [inputKelasRS, setInputKelasRS] = useState([]);
  const [inputCanggih, setInputCanggih] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKabId, setSelectedKabId] = useState(null);
  const [selectedKecId, setSelectedKecId] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);
  //endinput

  const circleRadius =
    faskes === "fktp" ? 2000 : faskes === "fkrtl" ? 5000 : "";



  const zoomLevel = 13;

  useEffect(() => {
    dispatch(fetchMarkersFKTP(latitude, longitude));
    dispatch(fetchMarkersFKRTL(latitude, longitude));
  }, [dispatch, latitude, longitude]);

  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);
  const detailFKTP = useSelector((state) => state.mapfktp.fktpobj);
  const detailFKRTL = useSelector((state) => state.mapfktp.fkrtlobj);
  const jenisFKRTL = useSelector((state) => state.mapfilter.jenisfkrtl);
  const jenisFKTP = useSelector((state) => state.mapfilter.jenisfktp);
  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const listFilterFKTP = useSelector((state) => state.mapfilter.datalistfktp);
  const listFilterFKRTL = useSelector((state) => state.mapfilter.datalistfkrtl);

  const toggleSidebar = () => {
    setShowSidebarData((prevSidebarOpen) => !prevSidebarOpen);
  };

  const handleFilterClick = () => {
    setShowSidebar((prevState) => !prevState);
  };

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const handleLayerSelectClick2 = () => {
    setShowFloatingButton2((prevState) => !prevState);
  };



  const handleLegendClick = () => {
    setShowLegend((prevState) => !prevState);
  };

  const handleOverlayClick = () => {
    setShowOverlayList((prevState) => !prevState);
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
      center: centerMap,
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
          //console.log(markerListFKTP);
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
    { key: "map-switch-default", label: "Plain" },
    { key: "map-switch-basic", label: "Road" },
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
    
    const map = new Map({
      target: "map",
      controls: defaultControls(),
      layers: [
        new LayerGroup({
          title: "Basemap",
          layers: [
            new TileLayer({
              title: "Basemap",
              source: new XYZ({
                url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
              }),
            }),
          ],
        }),

        new LayerGroup({
          title: "PotentialLayer",
        }),
        new LayerGroup({
          title: "Overlay",
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
      zIndex: 100,
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
    userMarkerLayer.setZIndex(1000);
    setUserMarkerFeature(userMarkerFeature);
    /* 
    const markerSource = new VectorSource();
    const markerLayer = new VectorLayer({
      source: markerSource,
      zIndex: 4,
    });

    map.addLayer(markerLayer);

    const markerFeature = new Feature({
      geometry: new Point(fromLonLat(centerMap)),
    });
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "../images/p1.png",
          scale: 0.5,
          zIndex: 10000,
        }),
      })
    );

    markerSource.addFeature(markerFeature);
    markerLayer.setZIndex(1000); */

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
    /* 
    const circleSource = new VectorSource();
    const circleLayer = new VectorLayer({
      source: circleSource,
      zIndex: 500,
    });

    const circleFeature = new Feature({
      geometry: new Circle(fromLonLat(centerMap), circleRadius),
    });

    // Style for the circular feature
    const circleStyle = new Style({
      fill: new Fill({
        color: "rgba(249, 168, 246, 0.1)", // Red circle with 20% opacity
      }),
      stroke: new Stroke({
        color: "rgba(249, 168, 246, 1)", // Red border with 70% opacity
        width: 2,
      }),
    });

    circleFeature.setStyle(circleStyle);
    circleSource.addFeature(circleFeature);
    map.addLayer(circleLayer); */

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
        map.getView().animate({
          center: coordinates,
          duration: 1000, // Animation duration in milliseconds
          zoom: zoomLevel,
        });

        userMarkerFeature.getGeometry().setCoordinates(coordinates);
        //markerFeature.getGeometry().setCoordinates(coordinates);
        // circleFeature.getGeometry().setCoordinates(coordinates);

        setUserLocation(lonLat);
        setMarkerPosition(coordinates);
        setCenterMap(coordinates);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
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
        setCenterMap(coordinates);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
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


  const handleJenisChange = (item) => {
    const isChecked = inputJenis.includes(item);

    if (isChecked) {
      setInputJenis((prev) => prev.filter((value) => value !== item));
    } else {
      setInputJenis((prev) => [...prev, item]);
    }
  };

  const handleKelasRSChange = (item) => {
    const isChecked = inputJenis.includes(item);

    if (isChecked) {
      setInputKelasRS((prev) => prev.filter((value) => value !== item));
    } else {
      setInputKelasRS((prev) => [...prev, item]);
    }
  };

  const handleCanggihChange = (item) => {
    const isChecked = inputCanggih.includes(item);

    if (isChecked) {
      setInputCanggih((prev) => prev.filter((value) => value !== item));
    } else {
      setInputCanggih((prev) => [...prev, item]);
    }
  };


  const handleSubmit = () => {
    dispatch(
      fetchFilterFKRTLList(
        selectedProvId,
        selectedKabId,
        selectedKecId,
        "null",
        "null",
        "nan",
        "nan",
        "null",
        "null"
      )
    );
    toggleSidebar(true);
  };

  const handleSelectWilayah = (event, selectedOption) => {
    console.log("Selected Option:", selectedOption);
    if (selectedOption) {
      const { kec_id, kab_id, prov_id } = selectedOption;
      console.log("Kecamatan ID:", kec_id);
      console.log("Kabupaten ID:", kab_id);
      console.log("Provinsi ID:", prov_id);

      setSelectedKecId(kec_id);
      setSelectedKabId(kab_id);
      setSelectedProvId(prov_id);
    }
  };

  const handleInputWilayahChange = (event, value) => {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      //dispatch(fetchAutoWilayah([]));
    }
  };
  const handleListClick = (index) => {
    setSelectedItem(index);
    const selectedId = listFilterFKRTL[index]?.id;
    console.log(selectedId);
    dispatch(fetchFKRTLDetail(selectedId));
    setActiveFaskes("FKRTL");
  };
  return (
    <Box className="contentRoot">
      <div id="map" className="map-dashboard"></div>
      {/* Center Geolocation Button */}
      <button
        onClick={handleCenterGeolocation}
        className=" center-geolocation-button"
      >
        <MyLocationOutlinedIcon className="img" />
      </button>

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
        <Switch checked={showFKTPMark} onChange={handleFktpSwitchChange} />
        Titik FKTP
        <Divider>FKRTL</Divider>
        <div className="label">Fasilitas Kesehatan Rujukan Tingkat Lanjut </div>
        <Switch checked={showPotentialFkrtl} onChange={togglePotentialFkrtl} />
        Peta Potensi FKRTL
        <br />
        <Switch />
        Peta Uncovered FKRTL
        <br />
        <Switch checked={showFKRTLMark} onChange={handleFkrtlSwitchChange} />
        Titik FKRTL
        <br />
      </div>

      <div className="legend-button" onClick={handleLegendClick}>
      <div className="button-container">
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
        </div>
      </div>

      {showLegend && (
        <div className="legend-box" onClick={handleLegendClick}>
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

     
<div className="filter-button" onClick={handleFilterClick}>
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className={`sidebar-filter-dashboard ${showSidebar ? "open" : ""}`}>
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
                  value={inputNama}
                  onChange={(e) => setInputNama(e.target.value)}
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
                  value={inputAlamat}
                  onChange={(e) => setInputAlamat(e.target.value)}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Typography fontWeight="fontWeightBold" variant="body2">
                  Jenis Faskes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <FormGroup>
                  {faskes === "fktp"
                    ? jenisFKTP.map((item, index) => (
                        <div key={index}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={inputJenis.includes(item.jenisfaskes)}
                                onChange={() =>
                                  handleJenisChange(item.jenisfaskes)
                                }
                              />
                            }
                            label={item.jenisfaskes}
                          />
                        </div>
                      ))
                    : jenisFKRTL.map((item, index) => (
                        <div key={index}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={inputJenis.includes(item.jenisfaskes)}
                                onChange={() =>
                                  handleJenisChange(item.jenisfaskes)
                                }
                              />
                            }
                            label={item.jenisfaskes}
                          />
                        </div>
                      ))}
                </FormGroup>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Typography fontWeight="fontWeightBold" variant="body2">
                  Wilayah
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Autocomplete
                  noOptionsText={"Data Tidak Ditemukan"}
                  size={"small"}
                  fullWidth
                  id="combo-box-demo"
                  value={selectedWilayah}
                  onChange={handleSelectWilayah}
                  inputValue={selectedWilayah}
                  onInputChange={handleInputWilayahChange}
                  options={listWilayah || []}
                   getOptionLabel={(option) => option.disp}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Masukan minimal 3 karakter"
                      defaultValue=""
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Typography fontWeight="fontWeightBold" variant="body2">
                  Rasio Dokter
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Typography fontSize={12}>
                  {" "}
                  {"< 5000"} <Switch /> {">= 5000"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Typography fontWeight="fontWeightBold" variant="body2">
                  Kelas RS
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <Grid
                  container
                  wrap="nowrap"
                  spacing={8}
                  sx={{ overflow: "auto" }}
                >
                  <Grid item xs={1}>
                    <Typography>
                      {" "}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={inputKelasRS.includes("A")}
                            onChange={() => handleKelasRSChange("A")}
                          />
                        }
                        label="A"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      {" "}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={inputKelasRS.includes("B")}
                            onChange={() => handleKelasRSChange("B")}
                          />
                        }
                        label="B"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      {" "}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={inputKelasRS.includes("C")}
                            onChange={() => handleKelasRSChange("C")}
                          />
                        }
                        label="C"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>
                      {" "}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={inputKelasRS.includes("D")}
                            onChange={() => handleKelasRSChange("D")}
                          />
                        }
                        label="D"
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography fontWeight="fontWeightBold" variant="body2">
                  Pelayanan Canggih
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inputCanggih.includes("Cathlab")}
                        onChange={() => handleCanggihChange("Cathlab")}
                      />
                    }
                    label="Cathlab"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inputCanggih.includes("Sarana Radioterapi")}
                        onChange={() =>
                          handleCanggihChange("Sarana Radioterapi")
                        }
                      />
                    }
                    label="Sarana Radioterapi"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inputCanggih.includes("Sarana Kemoterapi")}
                        onChange={() =>
                          handleCanggihChange("Sarana Kemoterapi")
                        }
                      />
                    }
                    label="Sarana Kemoterapi"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inputCanggih.includes("nan")}
                        onChange={() =>
                          handleCanggihChange("nan")
                        }
                      />
                    }
                    label="Tanpa Pelayanan Canggih"
                  />
                </FormGroup>
                
              </Box>
            </Grid>
          </Grid>
        </div>
        <div className="sidebar-footer">
          <Box sx={{ m: 1 }}>
            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFilterClick}
                >
                  Tutup
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  size="medium"
                  onClick={() => {
                    handleSubmit(); // Call the submission function
                  }}
                >
                  Terapkan
                </Button>
              </Grid>
            </Grid>

            
          </Box>
        </div>
      </div>

      <div className={`sidebar-data ${showSidebarData ? "open" : ""}`}>
              <div className="sidebar-header">
                <Typography>Daftar Faskes</Typography>
                <div className="sidebar-data-toggle" onClick={toggleSidebar}>
                  {showSidebarData ? (
                    <span className="caret">&#x25C0;</span>
                  ) : (
                    <span className="caret">&#x25B6;</span>
                  )}
                </div>
              </div>

              {/* Sidebar content goes here */}
              <div className="sidebar-content">
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  <Divider />
                  {listFilterFKRTL && listFilterFKRTL.length > 0
                    ? listFilterFKRTL.map((item, index) => (
                        <div key={index}>
                          <ListItem
                            alignItems="flex-start"
                            sx={{
                              height: 100,
                              transition: "background-color 0.3s",
                              backgroundColor:
                                selectedItem === index
                                  ? "lightgrey"
                                  : "transparent", // Apply different color for selected item
                              "&:hover": {
                                bgcolor: "lightgrey", // Change the color on hover
                              },
                            }}
                            onClick={() => handleListClick(index)}
                          >
                            <ListItemText
                              primary={item.nmppk}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    sx={{ display: "inline" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {item.jenisfaskes} | Kode Faskes{" "}
                                    {item.faskesid}
                                  </Typography>
                                  <Typography fontSize={10}>
                                    {item.alamatppk}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider />
                        </div>
                      ))
                    : "Data Tidak Ditemukan"}
                </List>
              </div>
            </div>

      {showDetailBox && (
        <CardFaskes
          detailFKTP={detailFKTP}
          activeFaskes={activeFaskes}
          closeDetailBox={closeDetailBox}
        />
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapfktp: state.mapfktp,
    mapfkrtl: state.mapfkrtl,
  };
};

export default connect(mapStateToProps)(MapComponent);
