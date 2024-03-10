import "./App.css";
import { Auth } from "./pages/auth";
import { Cotizador } from "./pages/cotizador";
import { Cotizaciones } from "./pages/cotizaciones";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { PDF } from "./components/pdf/PDF";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Auth />} />
          <Route path="/cotizador" exact element={<Cotizador />} />
          <Route path="/cotizaciones" exact element={<Cotizaciones />} />
          <Route path="/cotizaciones/:cotizacionId" exact element={<PDF />} />
          <Route path="*" exact element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
