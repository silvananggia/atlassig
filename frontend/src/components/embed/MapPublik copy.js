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
import FloatingButton from "./EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  fetchFKTPDetail,
  fetchFilterFKTPPublik,
  fetchFilterFKTPListPublik,
  fetchMarkersFKTP,
} from "../../actions/fktpActions";
import {
  fetchFKRTLDetail,
  fetchFilterFKRTLListPublik,
  fetchFilterFKRTLPublik,
  fetchMarkersFKRTL,
} from "../../actions/fkrtlActions";
import {
  fetchAutoWilayah,
} from "../../actions/filterActions";
import {
  setLoading,

} from "../../actions/loadingActions";
import GeoJSON from "ol/format/GeoJSON";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Switch } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CardFaskes from "./CardFaskes";
const MapComponent = ({ faskes }) => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);

  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const [centerMap, setCenterMap] = useState([13124075.715923082, -277949.29803053016]);
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

  //input
  
  const [isFiltered, setIsFiltered] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKabId, setSelectedKabId] = useState(null);
  const [selectedKecId, setSelectedKecId] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);
  //endinput

  const zoomLevel = 10;

  const potentialLayerUrl =
  faskes === "fktp"
  ? "../tiles/fktp_tile/latest/{z}/{x}/{-y}.png"
  : faskes === "fkrtl"
  ? "../tiles/fkrtl_tile/latest/{z}/{x}/{-y}.png"
  : "";

 
      useEffect(() => {
        dispatch(fetchMarkersFKTP(latitude, longitude));
        dispatch(fetchMarkersFKRTL(latitude, longitude));
      }, [dispatch, latitude, longitude]);


  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);
  const detailFKTP = useSelector((state) => state.mapfktp.fktpobj);
  const detailFKRTL = useSelector((state) => state.mapfkrtl.fkrtlobj);
  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const listFilterFKTP = useSelector((state) => state.mapfktp.fktpdatalist);
  const listFilterFKRTL = useSelector((state) => state.mapfkrtl.fkrtldatalist);
  const isLoading = useSelector((state) => state.loading.isLoading);

  useEffect(() => {
    
  }, [isLoading]);
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


  const handleInputWilayahChange = (event, value) => {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      dispatch(fetchAutoWilayah([]));

      setSelectedKecId("null");
      setSelectedKabId("null");
      setSelectedProvId("null");
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
  useEffect(() => {
    if (centerMap && map) {
      map.getView().animate({
        center: centerMap,
        duration: 1000,
        zoom: 9,
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

  const handleSubmit = () => {
  
    const sanitizedSelectedProvId = selectedProvId ?? "null";
    const sanitizedSelectedKabId = selectedKabId ?? "null";
    const sanitizedSelectedKecId = selectedKecId ?? "null";


    if (faskes === "fkrtl") {
      dispatch(
        fetchFilterFKRTLListPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
        )
      );

      dispatch(
        fetchFilterFKRTLPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
        )
      );
      dispatch(
        fetchFilterFKTPListPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
        )
      );

      dispatch(
        fetchFilterFKTPPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
        )
      );

      removeFKTPPointMarkerLayers();
      removeFKRTLPointMarkerLayers();
    } else {
      dispatch(
        fetchFilterFKTPListPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
        )
      );

      dispatch(
        fetchFilterFKTPPublik(
          sanitizedSelectedProvId,
          sanitizedSelectedKabId,
          sanitizedSelectedKecId,
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
    return showSidebar ? "420px" : "20px"; // Adjust this value based on your layout
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

      <div className="searchbar-embed">
        <Box sx={{ m: 1 }}>
          <Grid container spacing={0.5}>
            <Grid item xs={8}>
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
            </Grid>
            <Grid item xs={4}>
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

      <div
        className="layer-select-embed"
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
        className="legend-button-embed"
        onClick={handleLegendClick}
        style={{ left: getLayerLeftPosition() }}
      >
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
      </div>

      {showLegend && (
        <div className="legend-box-embed" onClick={handleLegendClick}>
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

      
      {faskes === "fkrtl" ? (
        <>
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
            {isLoading ?
            
            <div className="sidebar-subheader">
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="info">
                      <Typography>
                       Mengambil Data ...
                      </Typography>
                    </Alert>
                  </Stack>
                </div>: 
                listFilterFKRTL && listFilterFKRTL.length > 0 ? (
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
            {isLoading ?
            
            <div className="sidebar-subheader">
                  <Stack sx={{ width: "100%" }} spacing={2}>
                    <Alert severity="info">
                      <Typography>
                       Mengambil Data ...
                      </Typography>
                    </Alert>
                  </Stack>
                </div>: listFilterFKTP && listFilterFKTP.length > 0 ? (
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

<div className="layer-select-embed3" >
        <InfoOutlinedIcon fontSize="medium" />
      </div>

      <div className="basemap-select3 hidden">
        <div className="coordinate-box-embed">
          <p className="label">
            <strong>Keterangan :</strong> <br />
           
            Lokasi Anda : Latitude: {userLocation[1].toFixed(6)}, Longitude:{" "}
            {userLocation[0].toFixed(6)}
          </p>
          <p className="label">
            - Titik Fasilitas Kesehatan yang Ditampilkan Radius 10 Km dari Titik
            Lokasi Anda.
            
          </p>
        </div>
      </div>
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