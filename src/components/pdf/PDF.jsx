/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import { useNavigate } from "react-router-dom";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";

import "../pdf/styles.scss";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";

import moment from "moment";

import "./styles.scss";

export const PDF = () => {
  // const navigate = useNavigate();
  const [datePdf, setDatePdf] = useState("");

  let { cotizacionId } = useParams();
  console.log("</> → cotizacionId:", cotizacionId);

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

  const pdfRef = useRef();

  // NOTE: COSTOS

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

  console.log(importe, entrega, iva, total);
  // NOTE:

  // useEffect(() => {
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
      // window.open(pdf.output("bloburl"));
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
      // pdf.save(`${cotizacionSeleccionada?.nombre}-Cotizacion.pdf`);
    });
  };

  // downloadPDF();
  // navigate("/cotizaciones");
  // }, []);

  // useEffect(() => {
  // if (cotizacionId) {
  //   if (cotizacionSeleccionada) {
  //     if (datePdf) {
  //       downloadPDF();
  //     }
  //   }
  // }
  // }, []);

  return (
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
            <div>Folio:</div>
            <div>{cotizacionSeleccionada?.id.split("", 8)}</div>
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
                <td>
                  {cotizacionSeleccionada?.cantidad}{" "}
                  {cotizacionSeleccionada?.seleccione === "Solupatch a Granel"
                    ? "Toneladas"
                    : "Bultos"}
                </td>
                <td className="cotizacion__title__td">
                  {cotizacionSeleccionada?.seleccione}
                </td>
                <td className="cotizacion__title__td">$ {precioFormated}</td>
                <td className="cotizacion__title__td">$ {entregaFormated}</td>
                <td className="cotizacion__title__td">${importeFormated}</td>
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
      </div>
    </div>
  );
};
