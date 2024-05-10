import { useEffect, useRef, useState } from "react";

import { signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase-config";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import moment from "moment";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import * as XLSX from "xlsx";
import { Toaster, toast } from "sonner";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import "../cotizaciones/styles.scss";

export const Cotizaciones = () => {
  const [tempId, setTempId] = useState("");

  const {
    isAuth,
    // userID,
    emailValue,
  } = useGetUserInfo();

  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();

  const [datePdf, setDatePdf] = useState([]);

  useEffect(() => {
    cotizaciones.forEach(
      (cotizacion) => {
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

  const modalRef = useRef(null);

  const openModal = async (id) => {
    setTempId(id);
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
  };

  const closeModalOutside = (e) => {
    const dialogDimensions = modalRef.current.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modalRef.current.close();
    }
  };

  const onDelete = async () => {
    const docRef = doc(db, "cotizaciones", tempId);
    await deleteDoc(docRef);
    setTempId("");
    modalRef.current.close();
    toast.warning("Cotización eliminada");
  };

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="cotizaciones">
      {/* Delete Modal */}
      <dialog
        onClick={closeModalOutside}
        ref={modalRef}
        className="cotizaciones__modal"
      >
        <div>
          <h3>Eliminar Cotización</h3>
          <p>Si elimina esta cotización los datos no podrán ser recuperados.</p>

          <div className="cotizaciones__modal--buttons-container">
            <button
              className="cotizaciones__modal--delete-button"
              onClick={onDelete}
            >
              Eliminar
            </button>
            <button
              className="cotizaciones__modal--close-button"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      </dialog>
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
                        // Table Data
                        <tr key={id}>
                          <td>{folio}</td>
                          <td>{nombre}</td>
                          <td>{Fordate}</td>
                          <td>{emailValue}</td>
                          <td>{seleccione}</td>
                          {/* selects seleccione */}
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
                          <td>
                            {/* Boton para dialogo */}
                            <Button
                              onClick={() => openModal(id)}
                              className="cotizador__button--delete"
                            >
                              Eliminar
                            </Button>
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
                          <td>{seleccione}</td>
                          {/* selects seleccione */}
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
                          <td>
                            {/* Boton para dialogo */}
                            <Button
                              onClick={() => openModal(id)}
                              className="cotizador__button--delete"
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                    .reverse()
            }
          </tbody>
        </Table>
      </div>
      <Toaster position="bottom-center" richColors />
    </div>
  );
};
