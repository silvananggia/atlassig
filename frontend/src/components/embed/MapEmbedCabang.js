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
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import Box from "@mui/material/Box";
import FloatingButton from "./EmbedFloatingButton";
import LayerGroup from "ol/layer/Group";
import PermDeviceInformationOutlinedIcon from "@mui/icons-material/PermDeviceInformationOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Slider from "@mui/material/Slider";
import { fetchFKTPCabang } from "../../actions/fktpActions";
import { fetchFKRTLCabang } from "../../actions/fkrtlActions";
import { fetchCenterCabang } from "../../actions/filterActions";
import GeoJSON from "ol/format/GeoJSON";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const MapComponent = (props) => {
  const bingApiKey =
    "Asz37fJVIXH4CpaK90Ohf9bPbV39RCX1IQ1LP4fMm4iaDN5gD5USHfqmgdFY5BrA";
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(Number(searchParams.get("lat")));
  const [lon, setLot] = useState(Number(searchParams.get("lon")));
  const [faskes, setFaskes] = useState(searchParams.get("faskes"));
  const [kodecabang, setKodeCabang] = useState(searchParams.get("cabang"));
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFloatingButton2, setShowFloatingButton2] = useState(false);
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
  const [showFKTPMark, setShowFKTPMark] = useState(false);
  const [showFKRTLMark, setShowFKRTLMark] = useState(false);
  const [showDetailBox, setShowDetailBox] = useState(false);

  const centerMap = [13124075.715923082,-277949.29803053016]; 
  const zoomLevel = 10;
  const circleRadius =
    faskes === "fktp" ? 2000 : faskes === "fkrtl" ? 5000 : "";

  const potentialLayerUrl =
    faskes === "fktp"
      ? "potential/{z}/{x}/{-y}.png"
      : faskes === "fkrtl"
      ? "potential_fkrtl/{z}/{x}/{-y}.png"
      : "";
      const testWilayah = [
        { label: 'Aceh' },
        { label: 'Palembang',},];
  useEffect(() => {
    props.loadmarkerfktp(kodecabang);
    props.loadmarkerfkrtl(kodecabang);
    props.loadcentercabang(kodecabang);

    
  }, []);

  const markerListFKTP = useSelector((state) => state.mapfktp.markerlist);
  const markerListFKRTL = useSelector((state) => state.mapfkrtl.markerlist);
  const centerCabang = useSelector((state) => state.mapfilter.coordinate);

  if (centerCabang){
   
    map.getView().animate({
      center: centerCabang,
      duration: 1000, // Animation duration in milliseconds
      zoom: 9,
    });
    
  }


  const handleLayerSelectClick = () => {
    setShowFloatingButton((prevState) => !prevState);
  };

  const handleLayerSelectClick2 = () => {
    setShowFloatingButton2((prevState) => !prevState);
  };

  const closeDetailBox = () => {
    setShowDetailBox(false);
    // map.getView().setZoom(zoomLevel);
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
      if (showFKTPMark) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(markerFKTPLayer);
      } else {
        //console.log(markerListFKTP);
        // Your existing code for processing markers
        if (markerListFKTP) {
          //console.log(markerListFKTP);
          const vectorSource = new VectorSource();
          const newMarkerFKTPLayer = new VectorLayer({
            source: vectorSource,
            title: "MarkerFKTP",
          });

          const features = new GeoJSON().readFeatures(markerListFKTP);
          
          //console.log(features);
          features.forEach((feature) => {
            //console.log(feature.id_);
            const coordinates = feature.getGeometry().getCoordinates();

            const markerFeature = new Feature({
              geometry: new Point(coordinates),
            });

            // Style for the marker
            const markerStyle = new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: "images/m2.png",
                zIndex: 10,
              }),
            });

            markerFeature.setStyle(markerStyle);

        
           
            
            const circleRadiusMeters = 2000; // 2 kilometers
            const circleGeometry = new Circle(coordinates, circleRadiusMeters);
            const circleFeature = new Feature(circleGeometry);
            const circleStyle = new Style({
              fill: new Fill({
                color: "rgba(0, 0, 255, 0.2)", // Blue circle with 20% opacity
              }),
              stroke: new Stroke({
                color: "rgba(0, 0, 255, 0.7)", // Blue border with 70% opacity
                width: 2,
              }),
            });
            circleFeature.setStyle(circleStyle);

            vectorSource.addFeatures([markerFeature, circleFeature]);
          });

 
            
          overlayGroup.getLayers().push(newMarkerFKTPLayer);
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
      if (showFKRTLMark) {
        // Remove the potential layer from the overlay group
        overlayGroup.getLayers().remove(markerFKRTLLayer);
      } else {
        // Your existing code for processing markers
        if (markerListFKRTL) {
          const vectorSource = new VectorSource();
          const newMarkerFKRTLLayer = new VectorLayer({
            source: vectorSource,
            title: "MarkerFKRTL",
          });

          const featuresFKRTL = new GeoJSON().readFeatures(markerListFKRTL);
          //console.log(features);
          featuresFKRTL.forEach((feature) => {
            const coordinates = feature.getGeometry().getCoordinates();

            // Create a marker feature
            const markerFeature = new Feature({
              geometry: new Point(coordinates),
            });

            // Style for the marker
            const markerStyle = new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: "images/m3.png",
                zIndex: 3,
              }),
            });

            markerFeature.setStyle(markerStyle);

            const circleRadiusMeters = 5000; // 2 kilometers circleRadiusMeters);
            const circleGeometry = new Circle(coordinates, circleRadiusMeters);
            const circleFeature = new Feature(circleGeometry);
            const circleStyle = new Style({
              fill: new Fill({
                color: "rgba(0, 255, 0, 0.2)", // Green circle with 20% opacity
              }),
              stroke: new Stroke({
                color: "rgba(0, 255, 0, 0.7)", // Green border with 70% opacity
                width: 2,
              }),
            });
            circleFeature.setStyle(circleStyle);
            vectorSource.addFeatures([markerFeature, circleFeature]);
          });

          //  map.addLayer(markerFKTPLayer);
          // Add the potential layer to the overlay group
          overlayGroup.getLayers().push(newMarkerFKRTLLayer);
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
                url: potentialLayerUrl,
                tileSize: [384, 384],
              }),
            }),
          ],
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
        function(feature, layer) {
          return { feature, layer };
        }
      );
    
      if (clickedFeature ) {
        console.log(clickedFeature);
        const featureId = clickedFeature.feature.getId();
    
          const layerName = clickedFeature.layer.get("title");
    
          console.log("Clicked Feature ID:", featureId);
          console.log("Layer Name:", layerName);
    
          map.getView().setCenter(centerCabang);
          map.getView().setZoom(14);
          setShowDetailBox(true);
   
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
          showFKTPMark={showFKTPMark}
          showFKRTLMark={showFKRTLMark}
          handleFktpSwitchChange={handleFktpSwitchChange}
          handleFkrtlSwitchChange={handleFkrtlSwitchChange}
        />
      </div>

      <div className="layer-select-embed2" onClick={handleLayerSelectClick2}>
        <PermDeviceInformationOutlinedIcon fontSize="medium" />
      </div>

      <div className="basemap-select2 hidden">
        <div className="embed-floating-button2">
          <div className="legend-box">
            <img src="images/legend-fkrtl.png" width="225px" height="350px" />
          </div>
        </div>
      </div>

      <div className="filter-box">
        <div className="button-container">
          <TuneOutlinedIcon fontSize="medium" />
          <div className="label">Filter</div>
          
        </div>
      </div>

      <div className="filter-content hidden">
        Filter
<br></br>
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={testWilayah}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Wilayah" />}
    />
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
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
              LHOONG 
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Jenis : Puskesmas
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Kode Faskes : 7625
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Alamat : JL. B.ACEH - MEULABOH KM.52
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
const mapDispatchToProps = (dispatch) => {
  return {
    loadmarkerfktp: (kodecabang) => dispatch(fetchFKTPCabang(kodecabang)),
    loadmarkerfkrtl: (kodecabang) => dispatch(fetchFKRTLCabang(kodecabang)),
    loadcentercabang: (kodecabang) => dispatch(fetchCenterCabang(kodecabang)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapComponent);
