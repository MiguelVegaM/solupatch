import "./App.css";
import { Auth } from "./pages/auth";
import { Cotizador } from "./pages/cotizador";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Auth />} />
          <Route path="/cotizador" exact element={<Cotizador />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
