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
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import Circle from "ol/geom/Circle";
import { fromLonLat, toLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import Icon from "ol/style/Icon";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import Box from "@mui/material/Box";
import FloatingButton from "./EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { fetchMarkersFKTP } from "../../actions/fktpActions";
import { fetchMarkersFKRTL } from "../../actions/fkrtlActions";
import GeoJSON from "ol/format/GeoJSON";

const MapComponent = ({ latitude, longitude, faskes }) => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([0, 0]); // Move centerMap declaration here
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
  const [showLegend, setShowLegend] = useState(false);


  const circleRadius =
    faskes === "fktp" ? 2000 : faskes === "fkrtl" ? 5000 : "";

  const potentialLayerUrl =
    faskes === "fktp"
      ? "../potential/{z}/{x}/{-y}.png"
      : faskes === "fkrtl"
      ? "../potential_fkrtl/{z}/{x}/{-y}.png"
      : "";

  const centerMap = [longitude, latitude]; // Move this line above its usage
  const zoomLevel = 13;

  useEffect(() => {
    dispatch(fetchMarkersFKTP(latitude, longitude));
    dispatch(fetchMarkersFKRTL(latitude, longitude));
  }, [dispatch, latitude, longitude]);

  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);


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


  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };


  const handleLegendClick = () => {
    setShowLegend((prevState) => !prevState);
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

      const basemapGroup = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("title") === "Basemap");

 
      if (boundingBox && boundingBox.features && boundingBox.features.length > 0) {
        const coords = boundingBox.features[0].geometry.coordinates;
        const f = new Feature({ geometry: new Polygon(coords) });
        const crop = new Mask({
          feature: f,
          wrapX: true,
          inner: false,
          shadowWidth : 5,
        });

        basemapLayer.addFilter(crop);
      }

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

  const centerCoordinates = fromLonLat(centerMap);

    // Calculate the bounding box coordinates
    const boundingBoxRadius = 15000; // 15 km in meters
    const lowerLeft = [
      centerCoordinates[0] - boundingBoxRadius,
      centerCoordinates[1] - boundingBoxRadius,
    ];
    const upperRight = [
      centerCoordinates[0] + boundingBoxRadius,
      centerCoordinates[1] + boundingBoxRadius,
    ];

    const boundingBox = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lowerLeft[0], lowerLeft[1]],
                [lowerLeft[0], upperRight[1]],
                [upperRight[0], upperRight[1]],
                [upperRight[0], lowerLeft[1]],
                [lowerLeft[0], lowerLeft[1]],
              ],
            ],
          },
        },
      ],
    };

    const coords = boundingBox.features[0].geometry.coordinates;
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

    
    const boundingBoxFeature = new Feature({ geometry: new Polygon(coords) });

    const crop = new Crop({
      feature: boundingBoxFeature,
      wrapX: true,
      inner: false,
    });
    potentialLayer.addFilter(crop);

    const map = new Map({
      target: "map",
      controls: defaultControls(),
      layers: [
        new LayerGroup({
          title: "Basemap",
          layers:  [new TileLayer({
            title: "Basemap",
            source: new XYZ({
              url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            }),
          }),]
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
    markerLayer.setZIndex(1000);
    setMarkerFeature(markerFeature);
    setMarkerSource(markerSource);
    setMarkerLayer(markerLayer);
    setMarkerPosition(centerMap);

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
    map.addLayer(circleLayer);

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

    if (faskes === "fkrtl") {
      FKRTLPointMarker();
      setShowFKRTLMark(true);
    } else {
      FKTPPointMarker();
      setShowFKTPMark(true);
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
      });
    }
  };

  return (
    <Box className="contentRoot">
      <div id="map" className="map"></div>
      {/* Center Geolocation Button */}
      <button
        onClick={handleCenterGeolocation}
        className=" center-geolocation-button"
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
          handleFktpSwitchChange={toggleShowFKTPMark}
          handleFkrtlSwitchChange={toggleShowFKRTLMark}
        />
      </div>

      
      <div className="legend-button-embed" onClick={handleLegendClick}>
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
      </div>

{showLegend && (

          <div className="legend-box-embed" onClick={handleLegendClick}>
            {faskes === "fkrtl" ? (
              <img
                src="../images/legend-calon-fkrtl.png"
                width="100%"
              />
            ) : (
              <img
                src="../images/legend-fktp.png"
                width="100%"
              />
            )}
          </div>
   
)}

      <div className="layer-select-embed3" >
        <InfoOutlinedIcon fontSize="medium" />
      </div>

      <div className="basemap-select3 hidden">
        <div className="coordinate-box-embed">
          <p className="label">
            <strong>Keterangan :</strong> <br />
            Lokasi Calon Faskes : Latitude: {latitude}, Longitude: {longitude}
            <br></br>
            Lokasi Anda : Latitude: {userLocation[1].toFixed(6)}, Longitude:{" "}
            {userLocation[0].toFixed(6)}
          </p>
          <p className="label">
            - Titik Fasilitas Kesehatan yang Ditampilkan Radius 10 Km dari Titik
            Calon Pendaftar.
            <br /> - Peta Potensi Perluasan Fasilitas Kesehatan yang Ditampilkan
            15 Km dari Titik Calon Pendaftar.
            <br />
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
  };
};

export default connect(mapStateToProps)(MapComponent);
