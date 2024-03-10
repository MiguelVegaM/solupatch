import { useParams } from "react-router-dom";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";

import "../pdf/styles.scss";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
// import moment from "moment";

export const PDF = () => {
  let { cotizacionId } = useParams();
  // console.log("</> → cotizacionId:", cotizacionId);

  const { cotizaciones } = useGetCotizaciones();
  console.log("</> → cotizaciones:", cotizaciones);

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  console.log("</> → cotizacionSeleccionada:", cotizacionSeleccionada);

  let subtotal =
    cotizacionSeleccionada?.cantidad * cotizacionSeleccionada?.precio;

  let iva = subtotal * 0.16;

  let total = subtotal + iva;

  const styles = StyleSheet.create({
    pdf: {
      paddingInline: "150px",
    },

    // PDF Header
    pdf__header: {
      display: "flex",
      justifyContent: "space-between",
      paddingBlock: "100px 50px",
    },
    pdf__header__img: {
      height: "120px",
    },
    pdf__header__datos: {
      marginLeft: "-150px",
      fontSize: "0.75rem",
    },
    pdf__header__datos1: {
      fontSize: "1.2rem",
      fontWeight: "700",
    },
    pdf__header__datos2: {
      fontSize: "1.2rem",
    },
    pdf__header__title: {
      paddingTop: "15px",
      maxWidth: "350px",
    },
    pdf__header__title1: {
      backgroundColor: "#414245",
      color: "#fff",
      fontSize: "1.2rem",
      fontWeight: "700",
      textAlign: "center",
    },

    // PDF Cliente
    cliente: {
      paddingBottom: "20px",
    },
    cliente__title__bar: {
      backgroundColor: "#fde802",
      fontSize: "1rem",
      fontWeight: "700",
      textAlign: "center",
    },
    cliente__datos: {
      display: "flex",
      justifyContent: "space-between",
    },

    // PDF Cotizacion
    // cotizacion :{
    // },
    cotizacion__title__bar: {
      width: "100%",
    },

    cotizacion__title__thead: {
      backgroundColor: "#fde802",
    },
    cotizacion__title__th: {
      paddingLeft: "30px",
    },
    cotizacion__title__td: {
      paddingTop: "15px",
      paddingLeft: "30px",
    },

    // PDF Total
    total: {
      fontSize: "0.9rem",
      width: "300px",
      marginLeft: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
    },
    cotizacion__total__div: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
    },
    cotizacion__total__span: {
      fontWeight: "700",
    },
  });

  return (
    <Document>
      <Page size="A4">
        <View style={styles.pdf}>
          <View style={styles.pdf__header}>
            <img
              style={styles.pdf__header__img}
              src={logoPrincipal}
              alt="Solupatch Logo"
            />
            <View style={styles.pdf__header__datos}>
              <div style={styles.pdf__header__datos1}>SOLUPATCH</div>
              <div style={styles.pdf__header__datos2}>SOL231030DX0</div>
              <div>(601) General de Ley Personas Morales</div>
              <div>
                AV REVOLUCIÓN 4055 LOCAL 15, CONTRY C.P. 64860
                <br />
                MONTERREY, Nuevo León, México
                <br />
                Tel. 8261299100, 8123691537
              </div>
            </View>
            <View style={styles.pdf__header__title}>
              <div style={styles.pdf__header__title1}>COTIZACIÓN</div>
              {/* TODO: */}
              <div>
                {/* {(cotizacionSeleccionada) => {
              const { seconds, nanoseconds } = cotizacionSeleccionada.createdAt;
              const Date = moment
                .unix(seconds)
                .add(nanoseconds / 1000000, "milliseconds");
              moment.locale("es-mx");
              const Fordate = Date.format("lll") || "";

              return { Fordate };
            }} */}
                09/03/2024
              </div>
            </View>
          </View>
          <View style={styles.cliente}>
            <div style={styles.cliente__title__bar}>DATOS DEL CLIENTE</div>
            <hr />
            <View style={styles.cliente__datos}>
              <View>
                <div>{cotizacionSeleccionada?.nombre}</div>
                <div>{cotizacionSeleccionada?.empresa}</div>
              </View>
              <div>
                <div>{cotizacionSeleccionada?.celular}</div>
                <div>{cotizacionSeleccionada?.email}</div>
              </div>
            </View>
          </View>
          <View style={styles.cotizacion}>
            <table style={styles.cotizacion__title__bar}>
              <thead style={styles.cotizacion__title__thead}>
                <tr>
                  <th style={styles.cotizacion__title__th}>CANTIDAD</th>
                  <th style={styles.cotizacion__title__th}>DESCRIPCIÓN</th>
                  <th style={styles.cotizacion__title__th}>V. UNITARIO</th>
                  <th style={styles.cotizacion__title__th}>IMPORTE</th>
                </tr>
              </thead>
              <tbody style={styles.cotizacion__title__tbody}>
                <tr style={styles.cotizacion__title__tr}>
                  <td style={styles.cotizacion__title__td}>
                    {cotizacionSeleccionada?.cantidad}{" "}
                    {cotizacionSeleccionada?.seleccione === "Solupatch a Granel"
                      ? "Toneladas"
                      : "Bultos"}
                  </td>
                  <td style={styles.cotizacion__title__td}>
                    {cotizacionSeleccionada?.seleccione}
                  </td>
                  <td style={styles.cotizacion__title__td}>
                    $ {cotizacionSeleccionada?.precio}.00
                  </td>
                  <td style={styles.cotizacion__title__td}>
                    ${subtotal}
                    .00
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
          </View>
          <View style={styles.total}>
            <View style={styles.cotizacion__total__div}>
              <span style={styles.cotizacion__total__span}>SUB-TOTAL: </span>${" "}
              {subtotal}.00
            </View>
            <View style={styles.cotizacion__total__div}>
              <span style={styles.cotizacion__total__span}>IVA 16%: </span>${" "}
              {iva}
            </View>
            <View style={styles.cotizacion__total__div}>
              <span style={styles.cotizacion__total__span}>TOTAL: </span>$
              {total}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
