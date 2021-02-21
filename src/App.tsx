import React, { useContext } from "react";

import Header from "./components/Header";
import Home from "./pages/Home";
import { ThemeContext } from "./utils/ThemeContext";

function App() {
  return (
    <>
      <Home />
    </>
  );
}

export default App;
