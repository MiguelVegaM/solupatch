// import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useGetUserInfo } from "../hooks/useGetUserInfo";

export const useAddCotizacion = () => {
  const cotizacionCollectionRef = collection(db, "cotizaciones");

  const { userID, emailValue } = useGetUserInfo();
  // console.log("</> → userID:", userID);

  const createdAt = serverTimestamp();

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
    status,
    dataFromDynamicInputs,
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
      status,
      dataFromDynamicInputs,
    });
  };

  return { addCotizacion };
};
