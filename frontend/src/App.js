import React from "react";

import MyRouter from "./router/index.js";
import LoadingIndicator from "./components/loading/Loading.js"
function App() {
  return (
    <div className="app">
    
        <MyRouter />
<LoadingIndicator/>
  </div>

  );
}

export default App;
