import React, { useEffect, useState } from "react";
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
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { Box, Grid, formControlClasses } from "@mui/material";
import FloatingButton from "../embed/EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import {
  fetchFKTPCabang,
  fetchFKTPDetail,
  fetchFilterFKTP,
  fetchFilterFKTPList,
  fetchMarkersFKTP,
} from "../../actions/fktpActions";
import {
  fetchFKRTLCabang,
  fetchFKRTLDetail,
  fetchFilterFKRTLList,
  fetchFilterFKRTL,
  fetchMarkersFKRTL,
} from "../../actions/fkrtlActions";
import {
  fetchAutoWilayah,
  fetchJenisFKRTL,
  fetchJenisFKTP,
  fetchCabang,
} from "../../actions/filterActions";
import GeoJSON from "ol/format/GeoJSON";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

import {TextField,Autocomplete,FormGroup,FormControlLabel,Checkbox,Alert,Stack,FormControl, InputLabel,Select,MenuItem} from "@mui/material";

import CardFaskes from "../embed/CardFaskes";
const MapComponent = ({ faskes }) => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const [centerMap, setCenterMap] = useState([
    13124075.715923082, -277949.29803053016,
  ]);
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
  const [userMarkerFeature, setUserMarkerFeature] = useState(null);
  const [latitude, setLatitude] = useState(-2.5489);
  const [longitude, setLongitude] = useState(118.0149);
  const [potentialLayerOpacity, setPotentialLayerOpacity] = useState(0.9);
  const [markersLoaded, setMarkersLoaded] = useState(false);
  const [showFKTPMark, setShowFKTPMark] = useState(false);
  const [showFKRTLMark, setShowFKRTLMark] = useState(false);
  const [showDetailBox, setShowDetailBox] = useState(false);
  const [activeFaskes, setActiveFaskes] = useState("");
  const [showLegend, setShowLegend] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSidebarData, setShowSidebarData] = useState(false);
  const [selectedWilayah, setselectedWilayah] = useState();
  const [selectedCabang, setselectedCabang] = useState();

  //input
  const [inputNama, setInputNama] = useState(null);
  const [inputAlamat, setInputAlamat] = useState(null);
  const [inputJenis, setInputJenis] = useState([]);
  const [inputrmin, setInputRmin] = useState(null);
  const [inputrmax, setInputRmax] = useState(null);
  const [inputKodeCabang, setInputKodeCabang] = useState(null);
  const [inputKodeDeputi, setInputKodeDeputi] = useState(null);
  const [inputRasio, setInputRasio] = useState({
    "< 5000": true,
    ">= 5000": true,
  });
  const [inputKelasRS, setInputKelasRS] = useState(["A", "B", "C", "D"]);
  const [isFiltered, setIsFiltered] = useState(false);

  const [inputCanggih, setInputCanggih] = useState([
    "Cathlab",
    "Sarana Radioterapi",
    "Sarana Kemoterapi",
    "None,nan",
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKabId, setSelectedKabId] = useState(null);
  const [selectedKecId, setSelectedKecId] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);
  //endinput

  const zoomLevel = 6;
  const listKedeputian = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const listKelasRS = ["A", "B", "C", "D"];
  const listCanggih = [
    { name: "Cathlab", value: "Cathlab" },
    { name: "Sarana Radioterapi", value: "Sarana Radioterapi" },
    { name: "Sarana Kemoterapi", value: "Sarana Kemoterapi" },
    { name: "Tanpa Pelayanan Canggih", value: "None,nan" },
  ];

  const listRasio = ["< 5000", ">= 5000"];

  const potentialLayerUrl =
    faskes === "fktp"
      ? "../tiles/fktp_tile/latest/{z}/{x}/{-y}.png"
      : faskes === "fkrtl"
      ? "../tiles/fkrtl_tile/latest/{z}/{x}/{-y}.png"
      : "";
      

  useEffect(() => {
    dispatch(fetchMarkersFKTP(latitude, longitude));
    dispatch(fetchMarkersFKRTL(latitude, longitude));
 
    if (faskes === "fkrtl") {
      dispatch(fetchJenisFKRTL());
    } else {
      dispatch(fetchJenisFKTP());
    }

    //dispatch(fetchAutoWilayah(""));
  }, [dispatch, latitude, longitude]);

  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);
  const detailFKTP = useSelector((state) => state.mapfktp.fktpobj);
  const detailFKRTL = useSelector((state) => state.mapfkrtl.fkrtlobj);
  const jenisFKRTL = useSelector((state) => state.mapfilter.jenisfkrtl);
  const jenisFKTP = useSelector((state) => state.mapfilter.jenisfktp);
  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const listCabang = useSelector((state) => state.mapfilter.cabanglist);
  const listFilterFKTP = useSelector((state) => state.mapfktp.fktpdatalist);
  const listFilterFKRTL = useSelector((state) => state.mapfkrtl.fkrtldatalist);

  useEffect(() => {
    if (faskes === "fkrtl") {
      if (
        markerListFKRTL &&
        markerListFKRTL != null &&
        markerListFKRTL.features &&
        markerListFKRTL.features.length > 0
      ) {
        FKRTLPointMarker();
      }
    } else {
      if (
        markerListFKTP &&
        markerListFKTP != null &&
        markerListFKTP.features &&
        markerListFKTP.features.length > 0
      ) {
        FKTPPointMarker();
      }
    }
  }, [markerListFKRTL, markerListFKTP]);

  useEffect(() => {
    if (jenisFKRTL) {
      const initialInputJenis = jenisFKRTL.map((item) => item.jenisfaskes);
      setInputJenis(initialInputJenis);
    }
  }, [jenisFKRTL]);

  useEffect(() => {
    if (jenisFKTP) {
      const initialInputJenis = jenisFKTP.map((item) => item.jenisfaskes);
      setInputJenis(initialInputJenis);
    }
  }, [jenisFKTP]);


  const handleKedeputianChange = (event, value) => {
    setInputKodeDeputi(value);
  };

  const handleInputWilayahChange = (event, value) => {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      //dispatch(fetchAutoWilayah([]));
    }
  };

  const handleInputCabangChange = (event, value) => {
    if (value.length >= 2) {
      dispatch(fetchCabang(value));
    } else {
      //dispatch(fetchAutoWilayah([]));
    }
  };
  

  const handleSelectWilayah = (event, selectedOption) => {
    if (selectedOption) {
      const { kec_id, kab_id, prov_id } = selectedOption;

      setSelectedKecId(kec_id);
      setSelectedKabId(kab_id);
      setSelectedProvId(prov_id);
    }
  };

  const handleSelectCabang = (event, selectedOption) => {
    if (selectedOption) {
      const { kodecab } = selectedOption;

      setInputKodeCabang(kodecab);
    }
  };
  useEffect(() => {
    if (centerMap && map) {
      map.getView().animate({
        center: centerMap,
        duration: 1000,
        zoom: 6,
      });
    }
  }, [centerMap, map]);

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const toggleSidebar = () => {
    setShowSidebarData((prevSidebarOpen) => !prevSidebarOpen);
  };

  const handleLayerSelectClick2 = () => {
    setShowFloatingButton2((prevState) => !prevState);
  };

  const handleLegendClick = () => {
    setShowLegend((prevState) => !prevState);
  };

  const handleFilterClick = () => {
    setShowSidebar((prevState) => !prevState);
    setShowSidebarData(false);
  };

  const handleResetFilter = () => {
    if (faskes === "fkrtl") {
      dispatch(fetchMarkersFKRTL(latitude, longitude));
      removeFKRTLPointMarkerLayers();
    } else {
      dispatch(fetchMarkersFKTP(latitude, longitude));
      removeFKTPPointMarkerLayers();
    }

    handleFilterClick();
    resetInput();
    closeDetailBox();
    setIsFiltered(false);
    resetInput();
    setInputRasio({ "< 5000": true, ">= 5000": true });
    setInputKelasRS(["A", "B", "C", "D"]);
    setInputCanggih([
      "Cathlab",
      "Sarana Radioterapi",
      "Sarana Kemoterapi",
      "None,nan",
    ]);
    setSelectedKecId("null");
    setSelectedKabId("null");
    setSelectedProvId("null");
  };
  const closeDetailBox = () => {
    setShowDetailBox(false);

    if (map && map.getLayers()) {
      let markerLayer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("title") === "Marker");

      // Check if the markerLayer and its source exist
      if (markerLayer && markerLayer.getSource()) {
        // Clear existing features from the marker layer
        markerLayer.getSource().clear();
      }

      map.getView().animate({
        center: centerMap,
        duration: 1000, // Animation duration in milliseconds
        zoom: zoomLevel,
      });
    }
  };

  const toggleShowFKTPMark = () => {
    setShowFKTPMark((prevState) => {
      if (!prevState) {
        FKTPPointMarker();
      } else {
        removeFKTPPointMarkerLayers();
      }
      return !prevState;
    });
  };

  const removeFKTPPointMarkerLayers = () => {
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

      // Remove the potential layers from the overlay group if they exist
      if (markerFKTPLayer) {
        overlayGroup.getLayers().remove(markerFKTPLayer);
      }
      if (RadiusFKTPLayer) {
        overlayGroup.getLayers().remove(RadiusFKTPLayer);
      }
    }
  };
  const FKTPPointMarker = () => {
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

      if (
        markerListFKTP &&
        markerListFKTP !== null &&
        markerListFKTP.features &&
        markerListFKTP.features.length > 0
      ) {
        if (!markerFKTPLayer || !RadiusFKTPLayer) {
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

          const featuresFKTP = new GeoJSON().readFeatures(markerListFKTP);

          if (featuresFKTP && featuresFKTP.length > 0) {
            featuresFKTP.forEach((feature) => {
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
                  src: "../images/m2.png",
                  scale: 0.5,
                  zIndex: 1000,
                }),
              });

              markerFeature.setStyle(markerStyle);

              const circleRadiusMeters = 2000; // 2 kilometers circleRadiusMeters);
              const circleGeometry = new Circle(
                coordinates,
                circleRadiusMeters
              );
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
      }
    }
  };

  const toggleShowFKRTLMark = () => {
    setShowFKRTLMark((prevState) => {
      if (!prevState) {
        FKRTLPointMarker();
      } else {
        removeFKRTLPointMarkerLayers();
      }
      return !prevState;
    });
  };

  const removeFKRTLPointMarkerLayers = () => {
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

      // Remove the potential layers from the overlay group if they exist
      if (markerFKRTLLayer) {
        overlayGroup.getLayers().remove(markerFKRTLLayer);
      }
      if (RadiusFKRTLLayer) {
        overlayGroup.getLayers().remove(RadiusFKRTLLayer);
      }
    }
  };

  const FKRTLPointMarker = () => {
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

      if (
        markerListFKRTL &&
        markerListFKRTL !== null &&
        markerListFKRTL.features &&
        markerListFKRTL.features.length > 0
      ) {
        if (!markerFKRTLLayer || !RadiusFKRTLLayer) {
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

          if (featuresFKRTL && featuresFKRTL.length > 0) {
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
              const circleGeometry = new Circle(
                coordinates,
                circleRadiusMeters
              );
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

              newMarkerFKRTLLayer.setZIndex(10000);
              newRadiusFKRTLLayer.setZIndex(100);
              radiusSource.addFeatures([circleFeature]);
              vectorSource.addFeatures([markerFeature]);
            });

            overlayGroup.getLayers().push(newMarkerFKRTLLayer);
            overlayGroup.getLayers().push(newRadiusFKRTLLayer);
          }
        }
      }
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
      if (map && map.getLayers()) {
        const basemapGroup = map
          .getLayers()
          .getArray()
          .find((layer) => layer.get("title") === "Basemap");

        basemapGroup.getLayers().clear();
        basemapGroup.getLayers().push(basemapLayer);
        setSelectedBasemap(basemap);
      }
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
        maxZoom: 14,
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

    if (faskes === "fkrtl") {
      FKRTLPointMarker();
      setShowFKRTLMark(true);
    } else {
      FKTPPointMarker();
      setShowFKTPMark(true);
    }
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
    markerLayer.setZIndex(100000);

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

  const handleKelasRSChange = (kelas, event) => {
    const updatedKelasRS = [...inputKelasRS];

    if (event.target.checked) {
      updatedKelasRS.push(kelas);
    } else {
      const index = updatedKelasRS.indexOf(kelas);
      if (index !== -1) {
        updatedKelasRS.splice(index, 1);
      }
    }

    setInputKelasRS(updatedKelasRS);
  };

  const handleCanggihChange = (item, event) => {
    const updatedCanggih = [...inputCanggih];

    if (event.target.checked) {
      updatedCanggih.push(item);
    } else {
      const index = updatedCanggih.indexOf(item);
      if (index !== -1) {
        updatedCanggih.splice(index, 1);
      }
    }
    setInputCanggih(updatedCanggih);
  };

  const handleRasioChange = (item) => {
    setInputRasio((prevInputRasio) => {
      let newInputRasio = { ...prevInputRasio };

      // Toggle the checked state of the current item
      newInputRasio[item] = !prevInputRasio[item];

      // Check the conditions and update inputRmin and inputRmax accordingly
      if (newInputRasio["< 5000"] && newInputRasio[">= 5000"]) {
        setInputRmin(0);
        setInputRmax(1000000);
      } else if (newInputRasio["< 5000"]) {
        setInputRmin(0);
        setInputRmax(5000);
      } else if (newInputRasio[">= 5000"]) {
        setInputRmin(5000);
        setInputRmax(1000000);
      } else {
        // If none of the conditions are met, you can set default values or handle it as needed
        // For example, setting both to some default values like 0
        setInputRmin(0);
        setInputRmax(0);
      }

      return newInputRasio;
    });
  };

  const handleListClick = (index) => {
    setSelectedItem(index);

    if (faskes === "fkrtl") {
      const selectedId = listFilterFKRTL[index]?.id;
      dispatch(fetchFKRTLDetail(selectedId));
      setActiveFaskes("FKRTL");
    } else {
      const selectedId = listFilterFKTP[index]?.id;
      dispatch(fetchFKTPDetail(selectedId));
      setActiveFaskes("FKTP");
    }
  };

  useEffect(() => {
    if (inputRasio["< 5000"] && inputRasio[">= 5000"]) {
      setInputRmin(0);
      setInputRmax(1000000);
    } else if (inputRasio["< 5000"]) {
      setInputRmin(0);
      setInputRmax(5000);
    } else if (inputRasio[">= 5000"]) {
      setInputRmin(5000);
      setInputRmax(1000000);
    } else {
      // If none of the conditions are met, you can set default values or handle it as needed
      // For example, setting both to some default values like 0
      setInputRmin(0);
      setInputRmax(0);
    }
  }, [inputRasio]);
  const handleSubmit = () => {
    const sanitizedSelectedProvId = selectedProvId ?? "null";
    const sanitizedSelectedKabId = selectedKabId ?? "null";
    const sanitizedSelectedKecId = selectedKecId ?? "null";
    const sanitizedKodeCabang = inputKodeCabang ?? "null";
    const sanitizedKodeDeputi = inputKodeDeputi ?? "null";
    const sanitizedInputKelasRS =
      inputKelasRS.length > 0 ? inputKelasRS : "nan";
    const sanitizedInputCanggih =
      inputCanggih.length > 0 ? inputCanggih : listCanggih;
    const sanitizedInputJenis = inputJenis.length > 0 ? inputJenis : "null";
    const sanitizedInputNama = inputNama ?? "null";
    const sanitizedInputAlamat = inputAlamat ?? "null";
    const sanitizedInputRmin = inputrmin ?? "null";
    const sanitizedInputRmax = inputrmax ?? "null";

    if (faskes === "fkrtl") {
      dispatch(
        fetchFilterFKRTLList(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
          sanitizedKodeCabang,
          sanitizedKodeDeputi,
          sanitizedInputKelasRS,
          sanitizedInputCanggih,
          sanitizedInputJenis,
          sanitizedInputNama,
          sanitizedInputAlamat
        )
      );

      dispatch(
        fetchFilterFKRTL(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
          sanitizedKodeCabang,
          sanitizedKodeDeputi,
          sanitizedInputKelasRS,
          sanitizedInputCanggih,
          sanitizedInputJenis,
          sanitizedInputNama,
          sanitizedInputAlamat
        )
      );

      removeFKRTLPointMarkerLayers();
    } else {
      dispatch(
        fetchFilterFKTPList(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
          sanitizedKodeCabang,
          sanitizedKodeDeputi,
          sanitizedInputRmax,
          sanitizedInputRmin,
          sanitizedInputJenis,
          sanitizedInputNama,
          sanitizedInputAlamat
        )
      );

      dispatch(
        fetchFilterFKTP(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
          sanitizedKodeCabang,
          sanitizedKodeDeputi,
          sanitizedInputRmax,
          sanitizedInputRmin,
          sanitizedInputJenis,
          sanitizedInputNama,
          sanitizedInputAlamat
        )
      );

      removeFKTPPointMarkerLayers();
    }

    closeDetailBox();
    toggleSidebar(true);
    setIsFiltered(true);
    resetInput();
  };

  const resetInput = () => {
    const sanitizedSelectedProvId = "null";
    const sanitizedSelectedKabId = "null";
    const sanitizedSelectedKecId = "null";
    const sanitizedInputKelasRS = "nan";
    const sanitizedInputCanggih = "null";
    const sanitizedInputJenis = "null";
    const sanitizedInputNama = "null";
    const sanitizedInputAlamat = "null";
  };

  const getLayerLeftPosition = () => {
    return showSidebar ? "380px" : "20px"; // Adjust this value based on your layout
  };
  return (
    <Box className="contentRoot">
      <div id="map" className="map-dashboard"></div>
      {/* Center Geolocation Button */}
      <button
        onClick={handleCenterGeolocation}
        className="center-geolocation-button"
      >
        <MyLocationOutlinedIcon className="img" />
      </button>

      <div
        className="layer-select"
        id={selectedBasemap}
        onClick={handleLayerSelectClick}
        style={{ left: getLayerLeftPosition() }}
      ></div>

      <div
        className="basemap-select hidden"
        style={{ left: getLayerLeftPosition() }}
      >
        <FloatingButton
          basemapOptions={basemapOptions}
          basemap={selectedBasemap}
          changeBasemap={changeBasemap}
          potentialLayerOpacity={potentialLayerOpacity} // Pass potentialLayerOpacity
          handlePotentialLayerOpacityChange={handlePotentialLayerOpacityChange} // Pass handlePotentialLayerOpacityChange
          faskesType={faskes}
          showFKTPMark={showFKTPMark}
          showFKRTLMark={showFKRTLMark}
          handleFktpSwitchChange={toggleShowFKTPMark}
          handleFkrtlSwitchChange={toggleShowFKRTLMark}
          leftPosition={getLayerLeftPosition()}
        />
      </div>

      <div
        className="legend-button"
        onClick={handleLegendClick}
        style={{ left: getLayerLeftPosition() }}
      >
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
      </div>

      {showLegend && (
        <div className="legend-box" onClick={handleLegendClick}>
          {faskes === "fkrtl" ? (
            <img
              src="../images/legend-fkrtl.png"
              width="100%"
            />
          ) : (
            <img src="../images/legend-fktp.png" width="100%" />
          )}
        </div>
      )}

      <div
        className="filter-button"
        onClick={handleFilterClick}
        style={{ left: getLayerLeftPosition() }}
      >
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className={`sidebar-filter-dashboard ${showSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <Typography>Filter {faskes.toUpperCase()} Kerja Sama</Typography>
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
                  value={inputNama || ""}
                  onChange={(e) =>
                    setInputNama(e.target.value === "" ? null : e.target.value)
                  }
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
                  value={inputAlamat || ""}
                  onChange={(e) =>
                    setInputAlamat(
                      e.target.value === "" ? null : e.target.value
                    )
                  }
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

            
            <Grid item xs={6}>
              <Box
                sx={{
                  padding: 1,
                  marginTop: -3,
                }}
              >
      
      <Autocomplete
        id="kedeputian-autocomplete"
        options={listKedeputian}
        value={inputKodeDeputi}
        onChange={handleKedeputianChange}
        renderInput={(params) => (
          <TextField {...params} label="Kedeputian" size="small" />
        )}
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
 <Autocomplete
                  disablePortal
                  noOptionsText={"Data Tidak Ditemukan"}
                  size={"small"}
                  fullWidth
                  id="combo-box-demo"
                  value={selectedCabang}
                  onChange={handleSelectCabang}
                  inputValue={selectedCabang}
                  onInputChange={handleInputCabangChange}
                  options={listCabang || []}
                  getOptionLabel={(option) => option.namacabang}
                  style={{ zindex: 1000000, left: 0 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kantor Cabang | Masukan Minimal 2 Karakter"
                      defaultValue=""
                    />
                  )}
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
                  disablePortal
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
                  style={{ zindex: 1000000, left: 0 }}
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
            {faskes === "fktp" ? (
              <>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Box
                    sx={{
                      padding: 1,
                      marginTop: -3,
                    }}
                  >
                    <FormGroup>
                      {listRasio.map((item) => (
                        <FormControlLabel
                          key={item}
                          control={
                            <Checkbox
                              checked={inputRasio[item] || false}
                              onChange={() => handleRasioChange(item)}
                            />
                          }
                          label={item}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Grid>
              </>
            ) : null}

            {faskes === "fkrtl" ? (
              <>
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
                      {listKelasRS.map((kelas) => (
                        <Grid item xs={1} key={kelas}>
                          <Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={inputKelasRS.includes(kelas)}
                                  onChange={(event) =>
                                    handleKelasRSChange(kelas, event)
                                  }
                                />
                              }
                              label={kelas}
                            />
                          </Typography>
                        </Grid>
                      ))}
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
                      {listCanggih.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              checked={inputCanggih.includes(option.value)}
                              onChange={(event) =>
                                handleCanggihChange(option.value, event)
                              }
                            />
                          }
                          label={option.name}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Grid>
              </>
            ) : null}
          </Grid>
        </div>
        <div className="sidebar-footer-dashboard">
          <Box sx={{ m: 1 }}>
            <Grid container spacing={0.5}>
              {isFiltered ? (
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleResetFilter}
                  >
                    Hapus Filter
                  </Button>
                </Grid>
              ) : null}

              <Grid item xs={isFiltered ? 6 : 12}>
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

      {faskes === "fkrtl" ? (
        <>
          <div className={`sidebar-data-dashboard ${showSidebarData ? "open" : ""}`}>
            <div className="sidebar-header">
              <Typography>Daftar Faskes Kerja Sama</Typography>
              <div className="sidebar-data-toggle" onClick={toggleSidebar}>
                {showSidebarData ? (
                  <span className="caret">&#x25C0;</span>
                ) : (
                  <span className="caret">&#x25B6;</span>
                )}
              </div>
            </div>
            {listFilterFKRTL && listFilterFKRTL.length > 0 ? (
              <>
                <div className="sidebar-subheader">
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="success">
                      <Typography>
                        Total : {listFilterFKRTL.length} Data Ditemukan
                      </Typography>
                    </Alert>
                  </Stack>
                </div>

                <div className="sidebar-content">
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {listFilterFKRTL.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            height: 100,
                            transition: "background-color 0.3s",
                            backgroundColor:
                              selectedItem === index
                                ? "lightgrey"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: "lightgrey",
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
                        {index < listFilterFKRTL.length - 1 && <Divider />}{" "}
                      </React.Fragment>
                    ))}
                  </List>
                </div>
              </>
            ) : (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">
                  {" "}
                  <Typography>Data Tidak Ditemukan</Typography>
                </Alert>
              </Stack>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={`sidebar-data-dashboard ${showSidebarData ? "open" : ""}`}>
            <div className="sidebar-header">
              <Typography>Daftar Faskes Kerja Sama</Typography>
              <div className="sidebar-data-toggle" onClick={toggleSidebar}>
                {showSidebarData ? (
                  <span className="caret">&#x25C0;</span>
                ) : (
                  <span className="caret">&#x25B6;</span>
                )}
              </div>
            </div>
            {listFilterFKTP && listFilterFKTP.length > 0 ? (
              <>
                <div className="sidebar-subheader">
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="success">
                      <Typography>
                        Total : {listFilterFKTP.length} Data Ditemukan
                      </Typography>
                    </Alert>
                  </Stack>
                </div>

                <div className="sidebar-content">
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {listFilterFKTP.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{
                            height: 100,
                            transition: "background-color 0.3s",
                            backgroundColor:
                              selectedItem === index
                                ? "lightgrey"
                                : "transparent",
                            "&:hover": {
                              backgroundColor: "lightgrey",
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
                        {index < listFilterFKTP.length - 1 && <Divider />}{" "}
                      </React.Fragment>
                    ))}
                  </List>
                </div>
              </>
            ) : (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">
                  {" "}
                  <Typography>Data Tidak Ditemukan</Typography>
                </Alert>
              </Stack>
            )}
          </div>
        </>
      )}

      {showDetailBox && detailFKTP && detailFKTP.length > 0 && (
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
    mapfilter: state.mapfilter,
  };
};

export default connect(mapStateToProps)(MapComponent);
