// import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
// import moment from "moment";
// import { useGetCotizaciones } from "./useGetCotizaciones";

export const useAddCotizacion = () => {
  // const [datePdf, setDatePdf] = useState("");

  const cotizacionCollectionRef = collection(db, "cotizaciones");

  const { userID, emailValue } = useGetUserInfo();
  // console.log("</> → userID:", userID);

  const createdAt = serverTimestamp();
  // console.log("</> → serverTimestamp:", serverTimestamp);

  // // const { cotizaciones } = useGetCotizaciones();
  // // useEffect(() => {
  // // cotizaciones.forEach(
  // // (cotizacion) => {
  // const { seconds, nanoseconds } = createdAt || {};
  // const Date = moment.unix(seconds).add(nanoseconds / 1000000, "milliseconds");
  // moment.locale("es-mx");
  // const Fordate = Date.format("lll") || "";
  // setDatePdf(Fordate);
  // // console.log(Fordate);
  // // },
  // // [cotizaciones]
  // // );
  // // });

  // console.log(datePdf);

  const addCotizacion = async ({
    nombre,
    empresa,
    celular,
    email,
    seleccione,
    cantidad,
    precio,
    entrega,
    folio,
    // total,
  }) => {
    await addDoc(cotizacionCollectionRef, {
      userID,
      emailValue,
      nombre,
      empresa,
      celular,
      email,
      seleccione,
      cantidad,
      precio,
      entrega,
      createdAt,
      folio,
      // total,
    });
  };

  return { addCotizacion };
};
