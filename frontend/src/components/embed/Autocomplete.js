// src/components/Autocomplete.js

import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { fetchAutoWilayah } from "../../actions/filterActions";
const AutocompleteComponent = () => {
  const dispatch = useDispatch();
  const [selectedWilayah, setselectedWilayah] = useState();
  const listWilayah = useSelector((state) => state.mapfilter.datalist);

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

  const handleSelectWilayah = (event, value) => {
    setselectedWilayah(value);
  };

  return (
    <Autocomplete
    disablePortal
    size={"small"}
    fullWidth
    id="combo-box-demo"
    value={selectedWilayah}
    onChange={handleSelectWilayah}
    inputValue={selectedWilayah}
    onInputChange={handleInputWilayahChange}
    options={listWilayah.data.disp || []}
    
    renderInput={(params) => (
      <TextField {...params} label="Wilayah" />
    )}
  />
  );
};

export default AutocompleteComponent;
