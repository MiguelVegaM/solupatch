import "./App.css";
// import "./assets/fonts/GalanoGrotesqueBlack.otf";
// import "./assets/fonts/GalanoGrotesqueBlackItalic.otf";
// import "./assets/fonts/GalanoGrotesqueBold.otf";
// import "./assets/fonts/GalanoGrotesqueBoldItalic.otf";
// import "./assets/fonts/GalanoGrotesqueExtraBold.otf";
// import "./assets/fonts/GalanoGrotesqueExtraBoldItalic.otf";
// import "./assets/fonts/GalanoGrotesqueExtraLight.otf";
// import "./assets/fonts/GalanoGrotesqueExtraLightItalic.otf";
// import "./assets/fonts/GalanoGrotesqueHeavy.otf";
// import "./assets/fonts/GalanoGrotesqueHeavyItalic.otf";
// import "./assets/fonts/GalanoGrotesqueItalic.otf";
// import "./assets/fonts/GalanoGrotesqueLight.otf";
// import "./assets/fonts/GalanoGrotesqueLightItalic.otf";
// import "./assets/fonts/GalanoGrotesqueMedium.otf";
// import "./assets/fonts/GalanoGrotesqueMediumItalic.otf";
// import "./assets/fonts/GalanoGrotesqueRegular.otf";
// import "./assets/fonts/GalanoGrotesqueSemiBold.otf";
// import "./assets/fonts/GalanoGrotesqueSemiBoldItalic.otf";
// import "./assets/fonts/GalanoGrotesqueThin.otf";
// import "./assets/fonts/GalanoGrotesqueThinItalic.otf";

import { Auth } from "./pages/auth";
import { Cotizador } from "./pages/cotizador";
import { Cotizaciones } from "./pages/cotizaciones";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { PDF } from "./components/pdf/PDF";
import { PDFTr } from "./components/pdf/PDFTr";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/autenticacion" exact element={<Auth />} />
          <Route path="/cotizador" exact element={<Cotizador />} />
          <Route path="/cotizaciones" exact element={<Cotizaciones />} />
          <Route path="/PDFTr" exact element={<PDFTr />} />
          <Route path="/cotizaciones/:cotizacionId" exact element={<PDF />} />
          <Route path="*" exact element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
