import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import moment from "moment";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import "../cotizaciones/styles.scss";
import { useEffect, useState } from "react";

export const Cotizaciones = () => {
  const {
    isAuth,
    // userID,
    emailValue,
  } = useGetUserInfo();
  // console.log("</> → emailValue:", emailValue);

  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();
  // console.log("</> → cotizaciones:", cotizaciones);

  const [datePdf, setDatePdf] = useState([]);

  // console.log(cotizaciones);

  useEffect(() => {
    cotizaciones.forEach(
      (cotizacion) => {
        // console.log(cotizacion?.createdAt);
        const { seconds, nanoseconds } = cotizacion?.createdAt || {};
        const Date = moment
          .unix(seconds)
          .add(nanoseconds / 1000000, "milliseconds");
        moment.locale("es-mx");
        const Fordate = Date.format("lll") || "";
        setDatePdf(Fordate);
        // console.log(Fordate);
      },
      [cotizaciones]
    );
  });

  const downloadExcel = () => {
    let table = [
      {
        A: "FOLIO",
        B: "CLIENTE",
        C: "FECHA",
        D: "VENDEDOR",
        E: "MERCANCÍA",
        F: "CANTIDAD",
        G: "EMPRESA",
        H: "EMAIL",
        I: "CELULAR",
        J: "TOTAL",
      },
    ];
    cotizaciones.forEach((cotizacion) => {
      console.log(cotizacion?.createdAt);
      table.push({
        A: cotizacion.folio,
        B: cotizacion.nombre,
        C: datePdf,
        D: cotizacion.emailValue,
        E: cotizacion.seleccione,
        F: cotizacion.cantidad,
        G: cotizacion.empresa,
        H: cotizacion.email,
        I: cotizacion.celular,
        J: (
          (((cotizacion.cantidad / 1) * cotizacion.precio.replace(/,/g, "")) /
            1 +
            cotizacion.entrega.replace(/,/g, "") / 1) *
            0.16 +
          (((cotizacion.cantidad / 1) * cotizacion.precio.replace(/,/g, "")) /
            1 +
            cotizacion.entrega.replace(/,/g, "") / 1)
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
    });

    const finalData = [...table];

    createFilter(finalData);
  };
  const createFilter = (finalData) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(finalData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cotizaciones");
    XLSX.writeFile(workbook, "Cotizaciones SOLUPATCH.xlsx");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/autenticacion");
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="cotizaciones__navbar">
        <div className="cotizador__navbar--vendedor">
          <span>Vendedor:</span> {emailValue}
        </div>
        <img
          className="cotizaciones__navbar--img"
          src={logoPrincipal}
          alt="Solupatch Logo"
        />
        <div className="navbar__buttons">
          <a href="/cotizador">
            <button className="navbar__button--cotizaciones">Cotizador</button>
          </a>
          <button
            className="navbar__button--cotizaciones"
            onClick={downloadExcel}
          >
            Exportar Excel
          </button>
          <button className="navbar__button--cotizaciones" onClick={logout}>
            Salir
          </button>
        </div>
      </div>

      <div className="cotizaciones__body">
        <Table striped>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Fecha de Creación</th>
              <th>Vendedor</th>
              <th>Mercancia</th>
              <th>Cantidad</th>
              <th>Total de Cotizacion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              // if the email logged is rvl@solupatch.com render this
              emailValue === "rvl@solupatch.com"
                ? cotizaciones
                    .map((cotizacion) => {
                      const { seconds, nanoseconds } =
                        cotizacion.createdAt || {};
                      const Date = moment
                        .unix(seconds)
                        .add(nanoseconds / 1000000, "milliseconds");
                      moment.locale("es-mx");
                      const Fordate = Date.format("lll") || "";
                      const {
                        nombre,
                        id,
                        emailValue,
                        cantidad,
                        precio,
                        entrega,
                        seleccione,
                        folio,
                        // empresa,
                        // celular,
                        // email,
                      } = cotizacion;
                      // console.log("</> → userID:", userID);

                      let importe =
                        cantidad * 1 * (precio.replace(/,/g, "") * 1);
                      let iva =
                        (importe + entrega.replace(/,/g, "") * 1) * 0.16;
                      let total = importe + iva + entrega.replace(/,/g, "") * 1;
                      let totalFormated = total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });

                      return (
                        <tr key={id}>
                          <td>{folio}</td>
                          <td>{nombre}</td>
                          <td>{Fordate}</td>
                          <td>{emailValue}</td>
                          <td>{seleccione}</td>
                          <td>
                            {cantidad}{" "}
                            {seleccione === "25kg Solupatch Bultos" && (
                              <span className="cotizador__input--placeholder">
                                Bultos
                              </span>
                            )}
                            {seleccione === "Solupatch a Granel" && (
                              <span className="cotizador__input--placeholder">
                                Toneladas
                              </span>
                            )}
                            {seleccione === "Debastado" && (
                              <span className="cotizador__input--placeholder">
                                M2
                              </span>
                            )}
                            {seleccione === "Suministro y tendido pg64" && (
                              <span className="cotizador__input--placeholder">
                                Toneladas
                              </span>
                            )}
                            {seleccione === "Suministro y tendido pg76" && (
                              <span className="cotizador__input--placeholder">
                                Toneladas
                              </span>
                            )}
                            {seleccione === "Impregnación" && (
                              <span className="cotizador__input--placeholder">
                                Litros
                              </span>
                            )}
                            {seleccione === "Suministro pg64" && (
                              <span className="cotizador__input--placeholder">
                                Toneladas
                              </span>
                            )}
                            {seleccione === "Traslado carpeta" && (
                              <span className="cotizador__input--placeholder">
                                Toneladas
                              </span>
                            )}
                            {seleccione === "Movimientos maquinaria" && (
                              <span className="cotizador__input--placeholder">
                                Flete
                              </span>
                            )}
                            {seleccione === "Emulsión aslfáltica" && (
                              <span className="cotizador__input--placeholder">
                                Litros
                              </span>
                            )}
                          </td>
                          <td>$ {totalFormated}</td>
                          <td>
                            <NavLink to={cotizacion?.id} target="_blank">
                              <button className="cotizador__button--descargar">
                                Ver PDF
                              </button>
                            </NavLink>
                          </td>
                        </tr>
                      );
                    })
                    .reverse()
                : // if other email render this
                  cotizaciones
                    ?.filter(
                      (cotizacion) => cotizacion?.emailValue === emailValue
                    )
                    .map((cotizacion) => {
                      console.log("</> → cotizacion:", cotizacion);
                      const { seconds, nanoseconds } =
                        cotizacion.createdAt || {};
                      const Date = moment
                        .unix(seconds)
                        .add(nanoseconds / 1000000, "milliseconds");
                      moment.locale("es-mx");
                      const Fordate = Date.format("lll") || "";
                      const {
                        nombre,
                        id,
                        emailValue,
                        cantidad,
                        precio,
                        entrega,
                        seleccione,
                        folio,
                        // empresa,
                        // celular,
                        // email,
                      } = cotizacion;
                      // console.log("</> → userID:", userID);

                      let importe =
                        cantidad * 1 * (precio.replace(/,/g, "") * 1);
                      let iva =
                        (importe + entrega.replace(/,/g, "") * 1) * 0.16;
                      let total = importe + iva + entrega.replace(/,/g, "") * 1;
                      let totalFormated = total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });

                      return (
                        <tr key={id}>
                          <td>{folio}</td>
                          <td>{nombre}</td>
                          <td>{Fordate}</td>
                          <td>{emailValue}</td>

                          <td>
                            {cantidad}{" "}
                            {seleccione === "25kg Solupatch Bultos"
                              ? "Bultos"
                              : "Toneladas"}
                          </td>
                          <td>$ {totalFormated}</td>
                          <td>
                            <NavLink to={cotizacion?.id} target="_blank">
                              <button className="cotizador__button--descargar">
                                Ver PDF
                              </button>
                            </NavLink>
                          </td>
                        </tr>
                      );
                    })
                    .reverse()
            }
          </tbody>
        </Table>
      </div>
    </div>
  );
};
