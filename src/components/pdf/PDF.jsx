/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import wwwCursor from "../../assets/imgs/web-www-trazo-de-icono-de-cursor.png";
import empaqueSolupatch from "../../assets/imgs/empaque-solupatch.png";
import fbIcon from "../../assets/imgs/fb-icon.png";
import igIcon from "../../assets/imgs/ig-icon.png";
import ClipLoader from "react-spinners/ClipLoader";

import "../pdf/styles.scss";
import "../../../src/App.css";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";

import moment from "moment";

import "./styles.scss";

export const PDF = () => {
  // const navigate = useNavigate();
  const [datePdf, setDatePdf] = useState("");

  let { cotizacionId } = useParams();
  // console.log("</> → cotizacionId:", cotizacionId);

  const { cotizaciones } = useGetCotizaciones();
  // console.log("</> → cotizaciones:", cotizaciones);
  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  useEffect(() => {
    const { seconds, nanoseconds } = cotizacionSeleccionada?.createdAt || {};
    const Date = moment
      .unix(seconds)
      .add(nanoseconds / 1000000, "milliseconds");
    moment.locale("es-mx");
    const Fordate = Date.format("lll") || "";
    setDatePdf(Fordate);
  }, [cotizacionSeleccionada]);

  const pdfRef = useRef();

  let importe =
    cotizacionSeleccionada?.cantidad *
    cotizacionSeleccionada?.precio.replace(/,/g, "");
  let importeFormated = importe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let entrega = cotizacionSeleccionada?.entrega.replace(/,/g, "") * 1;
  let entregaFormated = entrega.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let precio = cotizacionSeleccionada?.precio.replace(/,/g, "") * 1;
  let precioFormated = precio.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let iva = (importe + entrega) * 0.16;
  let ivaFormated = iva.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let total = importe + entrega + iva;
  let totalFormated = total.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // console.log(importe, entrega, iva, total);

  const downloadPDF = () => {
    const input = pdfRef.current;
    // const style = document.createElement("style");
    // document.head.appendChild(style);
    // style.sheet?.insertRule(
    //   "body > div:last-child img { display: inline-block; }"
    // );
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${cotizacionSeleccionada?.nombre}-Cotizacion.pdf`);
    });
  };
  const printPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      window.open(pdf.output("bloburl"));
    });
  };
  // NOTE: Listado de vendedores
  const vendedores = () => {
    if (cotizacionSeleccionada?.emailValue === "aclarrea@solupatch.com") {
      return (
        <div className="pdf__header__title-vendor">
          Ana Cristina Larrea <br />
          {/* WhatsApp 81 8704 8514 */}
          Teléfonos: 8261299100, 8123691537
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === "jlramos@solupatch.com") {
      return (
        <div className="pdf__header__title-vendor">
          José Luis Ramos <br />
          {/* WhatsApp 81 8704 8514 */}
          Teléfonos: 8261299100, 8123691537
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === "lblanco@solupatch.com") {
      return (
        <div className="pdf__header__title-vendor">
          Luis Blanco <br />
          {/* WhatsApp 81 8704 8514 */}
          Teléfonos: 8261299100, 8123691537
        </div>
      );
    }
    if (cotizacionSeleccionada?.emailValue === "rvl@solupatch.com") {
      return (
        <div className="pdf__header__title-vendor">
          Rodolfo Villalobos <br />
          {/* WhatsApp 81 8704 8514 */}
          Teléfonos: 8261299100, 8123691537
        </div>
      );
    }
  };

  // console.log(cotizacionSeleccionada?.emailValue);

  return (
    <div>
      {cotizacionSeleccionada ? (
        <div className="pdf__container">
          <div className="pdf__button__container">
            <button className="pdf__button" onClick={downloadPDF}>
              Guardar PDF
            </button>
            <button className="pdf__button" onClick={printPDF}>
              Imprimir PDF
            </button>
          </div>
          <div ref={pdfRef} className="pdf">
            <section className="pdf__header">
              <div className="pdf__header__img__datos">
                <img
                  className="pdf__header__img"
                  src={logoPrincipal}
                  alt="Solupatch Logo"
                />
                <div className="pdf__header__datos">
                  <div className="pdf__header__datos1">
                    SOLUPATCH S.A. DE C.V.
                  </div>
                  <div className="pdf__header__datos2">RFC: SOL231030DX0</div>
                  <div>
                    <span>Dirección:</span> Av.Revolución, 4055, Local 15,
                    <br />
                    Contry C.P.64860, Monterey, Nuevo León, México
                  </div>
                </div>
              </div>
              <div className="pdf__header__title">
                <div>COTIZACIÓN</div>
                <div>{datePdf}</div>
                <div>Folio:{cotizacionSeleccionada?.folio}</div>
                <div>
                  <span>VENDEDOR</span>
                  {vendedores()}
                </div>
                <div>
                  <a href="https://www.solupatch.com">
                    <img src={wwwCursor} alt="" />
                  </a>
                  <span>
                    <a href="www.solupatch.com">solupatch.com</a>
                  </span>
                </div>
              </div>
            </section>
            <section className="cliente">
              <div className="cliente__title__bar">DATOS DEL CLIENTE</div>
              <hr />
              <div className="cliente__datos">
                <div className="cliente__datos__pair">
                  <div>{cotizacionSeleccionada?.nombre}</div>
                  <div>{cotizacionSeleccionada?.empresa}</div>
                </div>
                <div className="cliente__datos__pair">
                  <div>{cotizacionSeleccionada?.celular}</div>
                  <div>{cotizacionSeleccionada?.email}</div>
                </div>
              </div>
            </section>
            <section className="cotizacion">
              <table className="cotizacion__title__bar">
                <thead className="cotizacion__title__thead">
                  <tr>
                    <th className="cotizacion__title__th">CANTIDAD</th>
                    <th className="cotizacion__title__th">DESCRIPCIÓN</th>
                    <th className="cotizacion__title__th">V. UNITARIO</th>
                    <th className="cotizacion__title__th">ENTREGA</th>
                    <th className="cotizacion__title__th">IMPORTE</th>
                  </tr>
                </thead>
                <tbody className="cotizacion__title__tbody">
                  <tr className="cotizacion__title__tr">
                    <td className="cotizacion__title__td">
                      {cotizacionSeleccionada?.cantidad}{" "}
                      {cotizacionSeleccionada?.seleccione ===
                        "25kg Solupatch Bultos" && (
                        <span className="cotizador__input--placeholder">
                          Bultos
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Solupatch a Granel" && (
                        <span className="cotizador__input--placeholder">
                          Toneladas
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione === "Debastado" && (
                        <span className="cotizador__input--placeholder">
                          M2
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Suministro y tendido pg64" && (
                        <span className="cotizador__input--placeholder">
                          Toneladas
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Suministro y tendido pg76" && (
                        <span className="cotizador__input--placeholder">
                          Toneladas
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Impregnación" && (
                        <span className="cotizador__input--placeholder">
                          Litros
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Suministro pg64" && (
                        <span className="cotizador__input--placeholder">
                          Toneladas
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Traslado carpeta" && (
                        <span className="cotizador__input--placeholder">
                          Toneladas
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Movimientos maquinaria" && (
                        <span className="cotizador__input--placeholder">
                          Flete
                        </span>
                      )}
                      {cotizacionSeleccionada?.seleccione ===
                        "Emulsión aslfáltica" && (
                        <span className="cotizador__input--placeholder">
                          Litros
                        </span>
                      )}
                    </td>
                    <td className="cotizacion__title__td">
                      {cotizacionSeleccionada?.seleccione}
                    </td>
                    <td className="cotizacion__title__td">
                      $ {precioFormated}
                    </td>
                    <td className="cotizacion__title__td">
                      $ {entregaFormated}
                    </td>
                    <td className="cotizacion__title__td">
                      $ {importeFormated}
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr />
            </section>
            <section className="total">
              <div className="cotizacion__total__div">
                <span className="cotizacion__total__span">IMPORTE: </span>${" "}
                {importeFormated}
              </div>
              <div className="cotizacion__total__div">
                <span className="cotizacion__total__span">ENTREGA: </span>${" "}
                {entregaFormated}
              </div>
              <div className="cotizacion__total__div">
                <span className="cotizacion__total__span">IVA 16%: </span>${" "}
                {ivaFormated}
              </div>
              <div className="cotizacion__total__div">
                <span className="cotizacion__total__span">TOTAL: </span>$
                {totalFormated}
              </div>
            </section>
            <section className="banco">
              <div className="banco__title__bar">
                INFORMACIÓN PARA DEPOSITO O TRANSFERENCIA
              </div>
              <div className="banco__datos__img">
                <div>
                  <div>Banco: BBVA</div>
                  <div>Nombre: SOLUPATCH. S.A. de C.V.</div>
                  <div>ClaveInterbancaria: 012580001219422986</div>
                  <div>No.Tarjeta: 455513012605665</div>
                  <div>No.Cuenta: 0121942298</div>
                  <div>Coreo: facturacion@solupatch.com</div>
                </div>
                <img src={empaqueSolupatch} alt="" />
              </div>
            </section>
            <section className="footer">
              <div className="footer__title">
                <a
                  href="https://www.facebook.com/solupatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={fbIcon} alt="" />
                </a>
                <a
                  href="https://www.instagram.com/solupatch"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={igIcon} alt="" />
                </a>
                <div> /solupatch</div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="pdf__loader__spinner">
          <ClipLoader color="#fac000" size={50} />
          <div className="pdf__loader__text">Cargando...</div>
        </div>
      )}
    </div>
  );
};
