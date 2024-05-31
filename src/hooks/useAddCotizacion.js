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

  const addCotizacion = async ({
    nombre,
    empresa,
    celular,
    email,
    // seleccione,
    // cantidad,
    // precio,
    entrega,
    folio,
    status,
    dynamicForm,
  }) => {
    await addDoc(cotizacionCollectionRef, {
      userID,
      emailValue,
      nombre,
      empresa,
      celular,
      email,
      // seleccione,
      // cantidad,
      // precio,
      entrega,
      createdAt,
      folio,
      status,
      dynamicForm,
    });
  };

  return { addCotizacion };
};
