import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  Box,
  Grid,
} from "@mui/material";

import {
  fetchAutoWilayah,
  fetchCabang,
  fetchAutoWilayahCabang,
  fetchJenisFKRTL,
  fetchJenisFKTP,
  fetchKodeDep,
  fetchAutoWilayahDeputi,
  fetchCabangDeputi,
} from "../../actions/filterActions";
import {
  fetchCountJenisFKRTL,
  fetchCountFKRTL,
} from "../../actions/fkrtlActions";
import { fetchCountJenisFKTP, fetchCountFKTP } from "../../actions/fktpActions";

import BarChart from "./ChartBar";
import PieChart from "./ChartPie";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const [selectedWilayah, setselectedWilayah] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKabId, setSelectedKabId] = useState(null);
  const [selectedKecId, setSelectedKecId] = useState(null);
  const [selectedProvId, setSelectedProvId] = useState(null);
  const [selectedCabang, setselectedCabang] = useState();
  const [dataPie, setDataPie] = useState([]);
  const [inputKodeCabang, setInputKodeCabang] = useState(null);
  const [inputKodeDeputi, setInputKodeDeputi] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const dataJenisFKTP = useSelector((state) => state.mapfktp.datalistfktp);
  const dataJenisFKRTL = useSelector((state) => state.mapfkrtl.datalistfkrtl);
  const dataFKTP = useSelector((state) => state.mapfktp.totalfktp);
  const dataFKRTL = useSelector((state) => state.mapfkrtl.totalfkrtl);
  const listCabang = useSelector((state) => state.mapfilter.cabanglist);
  const kodeDeputi = useSelector((state) => state.mapfilter.kodedep);

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

  useEffect(() => {
    if (kodeDeputi) {
      console.log(kodeDeputi[0].kodedep);
      setInputKodeDeputi(kodeDeputi[0].kodedep);
    }
  }, [kodeDeputi]);


  useEffect(() => {
    if (!isFiltered) {
      handleResetFilter();
    }
  }, []);

  useEffect(() => {
    if (dataFKTP && dataFKTP.length > 0 && dataFKRTL && dataFKRTL.length > 0) {
      setDataPie([dataFKTP[0].count, dataFKRTL[0].count]);
    }
  }, [dataFKTP, dataFKRTL, dataPie]);

  const handleKedeputianChange = (event, value) => {
    if(value === null || value == ""){
      setInputKodeDeputi("");
     
    
    } else {
      setInputKodeDeputi(value);
      setselectedCabang("");
      handleSelectCabang("");
    }
   
  };

  const handleInputCabangChange = (event, value) => {
    if (inputKodeDeputi === null || inputKodeDeputi==="") {
      if (value.length >= 2) {
        dispatch(fetchCabang(value));
      } else {
        //dispatch(fetchAutoWilayah([]));
        setInputKodeCabang("null");
      }
    } else {
      dispatch(fetchCabangDeputi(inputKodeDeputi, value));
    }
  };


  const handleSelectCabang = (event, selectedOption) => {
    if (selectedOption === null || selectedOption === '') {
      // Handle clear action
      setInputKodeCabang("null");
    } else {
      // Handle other changes
      if (selectedOption) {
        const { kodecab } = selectedOption;
  
        setInputKodeCabang(kodecab);
        dispatch(fetchKodeDep(kodecab));
      }
    }

   
  };
  const handleSubmit = () => {
    const sanitizedSelectedProvId = selectedProvId ?? "null";
    const sanitizedSelectedKabId = selectedKabId ?? "null";
    const sanitizedSelectedKecId = selectedKecId ?? "null";
   const sanitizedKodeCabang = inputKodeCabang === "" ? "null" : inputKodeCabang;
    const sanitizedKodeDeputi = inputKodeDeputi === "" ? "null" : inputKodeDeputi;
    dispatch(
      fetchCountJenisFKRTL(
        sanitizedSelectedProvId,
        sanitizedSelectedKabId,
        sanitizedSelectedKecId,
        sanitizedKodeCabang,
        sanitizedKodeDeputi
      )
    );

    dispatch(
      fetchCountJenisFKTP(
        sanitizedSelectedProvId,
        sanitizedSelectedKabId,
        sanitizedSelectedKecId,
        sanitizedKodeCabang,
        sanitizedKodeDeputi
      )
    );

    dispatch(
      fetchCountFKRTL(
        sanitizedSelectedProvId,
        sanitizedSelectedKabId,
        sanitizedSelectedKecId,
        sanitizedKodeCabang,
        sanitizedKodeDeputi
      )
    );

    dispatch(
      fetchCountFKTP(
        sanitizedSelectedProvId,
        sanitizedSelectedKabId,
        sanitizedSelectedKecId,
        sanitizedKodeCabang,
        sanitizedKodeDeputi
      )
    );

    if (dataFKTP && dataFKTP.length > 0 && dataFKRTL && dataFKRTL.length > 0) {
      setDataPie([dataFKTP[0].count, dataFKRTL[0].count]);
    }
    setIsFiltered(true);
  };

  const handleResetFilter = () => {
    dispatch(fetchCountJenisFKRTL("null", "null", "null", "null", "null"));

    dispatch(fetchCountJenisFKTP("null", "null", "null", "null", "null"));

    dispatch(fetchCountFKRTL("null", "null", "null", "null", "null"));

    dispatch(fetchCountFKTP("null", "null", "null", "null", "null"));

    if (dataFKTP && dataFKTP.length > 0 && dataFKRTL && dataFKRTL.length > 0) {
      setDataPie([dataFKTP[0].count, dataFKRTL[0].count]);
    }

    setIsFiltered(false);
    setInputKodeDeputi(null);
  };

  const handleSelectWilayah = (event, selectedOption) => {
    // Check if the new value is null or an empty string
    if (selectedOption === null || selectedOption === '') {
     // Handle clear action
     setSelectedKecId("null");
     setSelectedKabId("null");
     setSelectedProvId("null");
   } else {
     // Handle other changes
     if (selectedOption) {
       const { kec_id, kab_id, prov_id } = selectedOption;
 
       setSelectedKecId(kec_id);
       setSelectedKabId(kab_id);
       setSelectedProvId(prov_id);
     }
   }

  
 };

 const handleInputWilayahChange = (event, value) => {
  if (inputKodeDeputi === null   && inputKodeCabang === null) {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      dispatch(fetchAutoWilayah([]));

      setSelectedKecId("null");
      setSelectedKabId("null");
      setSelectedProvId("null");
    }
  } else if (inputKodeCabang === null || inputKodeCabang === "" && inputKodeDeputi != null && inputKodeDeputi != "null"  ) {
    dispatch(fetchAutoWilayahDeputi(inputKodeDeputi, value));
  } else {
    dispatch(fetchAutoWilayahCabang(inputKodeDeputi, inputKodeCabang, value));
  }
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
    <Box className="contentRoot" m={2}>
      <h1>Statistik</h1>

      <Grid container spacing={2}>
        <Grid item xs={6} md={1}>
          <Autocomplete
            id="kedeputian-autocomplete"
            options={listKedeputian}
            value={inputKodeDeputi}
            onChange={handleKedeputianChange}
            renderInput={(params) => (
              <TextField {...params} label="Kedeputian" size="small" />
            )}
          />
        </Grid>

        <Grid item xs={6} md={3}>
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
        </Grid>

        <Grid item xs={6} md={3}>
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
                label="Wilayah | Masukan minimal 3 karakter"
                defaultValue=""
              />
            )}
          />
        </Grid>

        <Grid item xs={6} md={2}>
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

        <Grid item xs={6} md={2}>
          {isFiltered && (
            <Button variant="contained" fullWidth onClick={handleResetFilter}>
              Hapus Filter
            </Button>
          )}
        </Grid>
      </Grid>

      <Grid container sx={{ paddingTop: 3 }}>
        <Grid item xs={6} md={4}>
          <Box p={2}>
            <Card sx={{ maxWidth: 350 }}>
              <CardHeader
                title="Total FKTP"
                subheader={"Fasilitas Kesehatan Tingkat Pertama"}
                style={cardHeaderStyle}
                titleTypographyProps={{ style: titleStyle }}
                subheaderTypographyProps={{ style: subheaderStyle }}
              />
              <CardContent>
                <Typography
                  style={{ display: "inline-block" }}
                  sx={{ fontWeight: "bold" }}
                  fontSize={32}
                >
                  {" "}
                  {dataFKTP.length > 0 ? dataFKTP[0].count : 0}{" "}
                </Typography>{" "}
                <Typography
                  style={{ display: "inline-block" }}
                  sx={{ fontWeight: "regular" }}
                >
                  {" "}
                  {} Faskes
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box p={2}>
            <Card sx={{ maxWidth: 350 }}>
              <CardHeader
                title="Total FKRTL"
                subheader={"Fasilitas Kesehatan Rujukan Tingkat Lanjut"}
                style={cardHeaderStyle}
                titleTypographyProps={{ style: titleStyle }}
                subheaderTypographyProps={{ style: subheaderStyle }}
              />
              <CardContent>
                <Typography
                  style={{ display: "inline-block" }}
                  sx={{ fontWeight: "bold" }}
                  fontSize={32}
                >
                  {" "}
                  {dataFKRTL.length > 0 ? dataFKRTL[0].count : 0}{" "}
                </Typography>{" "}
                <Typography
                  style={{ display: "inline-block" }}
                  sx={{ fontWeight: "regular" }}
                >
                  {" "}
                  {} Faskes
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={2} md={2}>
          <PieChart dataPie={dataPie} />
        </Grid>
      </Grid>

      <Grid container sx={{ paddingTop: 3 }}>
        <Grid item md={6}>
          <Box p={1}>
            <BarChart
              title="Jenis Fasilitas Kesehatan Tingkat Pertama"
              apiData={dataJenisFKTP}
            />
          </Box>
        </Grid>
        <Grid item md={6}>
          <Box p={1}>
            <BarChart
              title="JenisFasilitas Kesehatan Rujukan Tingkat Lanjut"
              apiData={dataJenisFKRTL}
            />
          </Box>
        </Grid>
        {/*  <Grid item xs={2} md={2}>
          <Box p={1}>
            <PieChart dataPie={dataPie}/>
          </Box>
        </Grid>*/}
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    mapfilter: state.mapfilter,
  };
};

export default connect(mapStateToProps)(StatisticsPage);
