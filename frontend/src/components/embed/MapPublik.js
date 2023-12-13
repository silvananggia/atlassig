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
import Box from "@mui/material/Box";
import FloatingButton from "./EmbedFloatingButton";
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
import { fetchMarkersFKTP, fetchFKTPDetail } from "../../actions/fktpActions";
import {
  fetchMarkersFKRTL,
  fetchFKRTLDetail,
} from "../../actions/fkrtlActions";
import GeoJSON from "ol/format/GeoJSON";

const MapComponent = ({ faskes }) => {
  const dispatch = useDispatch();
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";

  const [map, setMap] = useState(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);

  const [userLocation, setUserLocation] = useState([0, 0]);
  const [markerPosition, setMarkerPosition] = useState([0, 0]);
  const [centerMap, setCenterMap] = useState([0, 0]);
  const [selectedBasemap, setSelectedBasemap] = useState("map-switch-default");
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

  const circleRadius =
    faskes === "fktp" ? 2000 : faskes === "fkrtl" ? 5000 : "";

  const potentialLayerUrl =
    faskes === "fktp"
      ? "../potential/{z}/{x}/{-y}.png"
      : faskes === "fkrtl"
      ? "../potential_fkrtl/{z}/{x}/{-y}.png"
      : "";

  const zoomLevel = 13;

  useEffect(() => {
    dispatch(fetchMarkersFKTP(latitude, longitude));
    dispatch(fetchMarkersFKRTL(latitude, longitude));
  }, [dispatch, latitude, longitude]);

  const markerListFKTP = useSelector((state) => state.mapfktp.fktplist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.fkrtllist);
  const detailFKTP = useSelector((state) => state.mapfktp.fktpobj);
  const detailFKRTL = useSelector((state) => state.mapfktp.fkrtlobj);

  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const handleLayerSelectClick2 = () => {
    setShowFloatingButton2((prevState) => !prevState);
  };

  const handleLegendClick = () => {
    setShowLegend((prevState) => !prevState);
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

     <div className="filter-button-embed">
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
        </div>
      </div>

      <div className="layer-select-embed3" onClick={handleLayerSelectClick2}>
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
            - Titik Fasilitas Kesehatan yang Ditampilkan Radius 10 Km dari
            Lokasi Anda.
            <br /> - Peta Potensi Perluasan Fasilitas Kesehatan yang Ditampilkan
            15 Km dari Titik Calon Pendaftar.
            <br />
          </p>
        </div>
      </div>

      {showDetailBox && (
        <div className="detail-box" onClick={closeDetailBox}>
          <Card sx={{ maxWidth: 350 }}>
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
  };
};

export default connect(mapStateToProps)(MapComponent);
