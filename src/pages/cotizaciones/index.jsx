import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { PDFDownloadLink } from "@react-pdf/renderer";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import "../cotizaciones/styles.scss";
import { PDF } from "../../components/PDF/PDF";

export const Cotizaciones = () => {
  const { isAuth } = useGetUserInfo();
  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();
  // console.log("</> → cotizaciones:", cotizaciones);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  let { cotizacionId } = useParams();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="cotizaciones__navbar">
        <div className="cotizaciones__navbar--space"></div>
        <img
          className="cotizaciones__navbar--img"
          src={logoPrincipal}
          alt="Solupatch Logo"
        />
        <div className="navbar__buttons">
          <a href="/cotizador">
            <button className="navbar__button--cotizaciones">Cotizador</button>
          </a>
          <button className="navbar__button--cotizaciones" onClick={logout}>
            Salir
          </button>
        </div>
      </div>

      <div className="cotizaciones__body">
        <Table striped>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fecha de Creación</th>
              <th>Empleado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones
              ?.map((cotizacion) => {
                const { seconds, nanoseconds } = cotizacion.createdAt;
                const Date = moment
                  .unix(seconds)
                  .add(nanoseconds / 1000000, "milliseconds");
                moment.locale("es-mx");
                const Fordate = Date.format("lll") || "";
                const {
                  nombre,
                  id,
                  emailValue,
                  // empresa,
                  // celular,
                  // email,
                  // seleccione,
                  // cantidad,
                  // precio,
                  // entrega,
                } = cotizacion;

                return (
                  <tr key={id}>
                    <td>{nombre}</td>
                    <td>{Fordate}</td>
                    <td>{emailValue}</td>

                    <td>
                      <NavLink to={cotizacion?.id}>
                        <PDFDownloadLink
                          document={
                            <PDF
                              cotizacionSeleccionada={cotizacionSeleccionada}
                            />
                          }
                          fileName={`${cotizacion?.id}.pdf`}
                        >
                          <button className="cotizador__button--descargar">
                            Descargar
                          </button>
                        </PDFDownloadLink>
                      </NavLink>
                    </td>
                  </tr>
                );
              })
              .reverse()}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
