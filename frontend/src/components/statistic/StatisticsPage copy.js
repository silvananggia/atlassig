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

import { fetchAutoWilayah } from "../../actions/filterActions";
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
  const [dataPie, setDataPie] = useState([]);

  const listWilayah = useSelector((state) => state.mapfilter.wilayahlist);
  const dataJenisFKTP = useSelector((state) => state.mapfktp.datalistfktp);
  const dataJenisFKRTL = useSelector((state) => state.mapfkrtl.datalistfkrtl);
  const dataFKTP = useSelector((state) => state.mapfktp.totalfktp);
  const dataFKRTL = useSelector((state) => state.mapfkrtl.totalfkrtl);

  const handleSubmit = () => {
    /*  dispatch(
      fetchFilterFKRTLList(
        selectedProvId,
        selectedKabId,
        selectedKecId,
       
      )
    ); */

    dispatch(
      fetchCountJenisFKRTL(
        selectedProvId,
        selectedKabId,
        selectedKecId,
        "null",
        "null"
      )
    );

    dispatch(
      fetchCountJenisFKTP(
        selectedProvId,
        selectedKabId,
        selectedKecId,
        "null",
        "null"
      )
    );

    dispatch(
      fetchCountFKRTL(
        selectedProvId,
        selectedKabId,
        selectedKecId,
        "null",
        "null"
      )
    );

    dispatch(
      fetchCountFKTP(
        selectedProvId,
        selectedKabId,
        selectedKecId,
        "null",
        "null"
      )
    );

    if(dataFKTP && dataFKTP.length > 0 && dataFKRTL && dataFKRTL.length > 0){
      setDataPie([dataFKTP[0].count, dataFKRTL[0].count]);
    }
    
  };


  useEffect(()=>{

  },[dataFKTP])
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
      handleSubmit();
    }
  };

  const handleInputWilayahChange = (event, value) => {
    if (value.length >= 3) {
      dispatch(fetchAutoWilayah(value));
    } else {
      dispatch(fetchAutoWilayah([]));
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
        <Grid item xs={6} md={4}>
          <Box p={2}>
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
          </Box>
        </Grid>
        <Grid item xs={6} md={2}>
          <Box p={2}>
            {/* <Button
                variant="contained"
                fullWidth
                size="medium"
                onClick={() => {
                  handleSubmit(); // Call the submission function
                }}
              >
                Terapkan
              </Button> */}
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box p={2}></Box>
        </Grid>
      </Grid>

       <Grid container spacing={2}>
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
                <Typography   style={{display: 'inline-block'}} sx={{ fontWeight: 'bold' }} fontSize={32}> {
                dataFKTP.length> 0?
                dataFKTP[0].count:0} </Typography> {" "}
                <Typography   style={{display: 'inline-block'}} sx={{ fontWeight: 'regular' }}> {
               } Faskes</Typography>
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
                <Typography   style={{display: 'inline-block'}} sx={{ fontWeight: 'bold' }} fontSize={32}> {
                dataFKRTL.length> 0?
                dataFKRTL[0].count:0} </Typography> {" "}
                <Typography   style={{display: 'inline-block'}} sx={{ fontWeight: 'regular' }}> {
               } Faskes</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={2} md={2}>
            <PieChart dataPie={dataPie} />
        </Grid>
      </Grid>
 
      <Grid container sx={{paddingTop: 3}}>
        <Grid item md={6}>
          <Box p={1}>
            <BarChart
              title="Jenis Fasilitas Kesehatan Tingkat Pertama"
              apiData={dataJenisFKTP}
            />
          </Box>
        </Grid>
        <Grid item  md={6}>
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
