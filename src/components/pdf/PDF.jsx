/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";

import "../pdf/styles.scss";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";

import moment from "moment";

import "./styles.scss";

export const PDF = () => {
  const [datePdf, setDatePdf] = useState("");

  const pdfRef = useRef();

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
    // console.log(Fordate);
    setDatePdf(Fordate);
  }, [cotizacionSeleccionada]);

  let importe =
    cotizacionSeleccionada?.cantidad * cotizacionSeleccionada?.precio;

  let entrega = cotizacionSeleccionada?.entrega * 1;

  // let iva = (Math.round((importe + entrega) * 0.16) / 100).toFixed(2) * 1;

  let iva = (importe + entrega) * 0.16;

  let total = importe + entrega + iva;

  console.log(importe, entrega, iva, total);

  const downloadPDF = () => {
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
      pdf.save(`${cotizacionSeleccionada?.nombre}-Cotizacion.pdf`);
    });
  };

  // console.log(cotizacionSeleccionada);

  return (
    <div ref={pdfRef} className="pdf">
      <section className="pdf__header">
        <img
          className="pdf__header__img"
          src={logoPrincipal}
          alt="Solupatch Logo"
        />
        <div className="pdf__header__datos">
          <div className="pdf__header__datos1">SOLUPATCH</div>
          <div className="pdf__header__datos2">SOL231030DX0</div>
          <div>(601) General de Ley Personas Morales</div>
          <div>
            AV REVOLUCIÓN 4055 LOCAL 15, CONTRY C.P. 64860
            <br />
            MONTERREY, Nuevo León, México
            <br />
            Tel. 8261299100, 8123691537
          </div>
        </div>
        <div className="pdf__header__title">
          <div>COTIZACIÓN</div>
          <div>{datePdf}</div>
        </div>
      </section>
      <section className="cliente">
        <div className="cliente__title__bar">DATOS DEL CLIENTE</div>
        <hr />
        <div className="cliente__datos">
          <div>
            <div>{cotizacionSeleccionada?.nombre}</div>
            <div>{cotizacionSeleccionada?.empresa}</div>
          </div>
          <div>
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
              <td>
                {cotizacionSeleccionada?.cantidad}{" "}
                {cotizacionSeleccionada?.seleccione === "Solupatch a Granel"
                  ? "Toneladas"
                  : "Bultos"}
              </td>
              <td className="cotizacion__title__td">
                {cotizacionSeleccionada?.seleccione}
              </td>
              <td className="cotizacion__title__td">
                $ {cotizacionSeleccionada?.precio}.00
              </td>
              <td className="cotizacion__title__td">$ {entrega}.00</td>
              <td className="cotizacion__title__td">
                ${importe}
                .00
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
      </section>
      <section className="total">
        <div className="cotizacion__total__div">
          <span className="cotizacion__total__span">IMPORTE: </span>$ {importe}
          .00
        </div>
        <div className="cotizacion__total__div">
          <span className="cotizacion__total__span">ENTREGA: </span>$ {entrega}
          .00
        </div>
        <div className="cotizacion__total__div">
          <span className="cotizacion__total__span">IVA 16%: </span>$ {iva}
        </div>
        <div className="cotizacion__total__div">
          <span className="cotizacion__total__span">TOTAL: </span>${total}
        </div>
      </section>
      <button className="pdf__button" onClick={downloadPDF}>
        Descargar PDF
      </button>
    </div>
  );
};
