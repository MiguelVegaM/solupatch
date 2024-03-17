import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const useGetCotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);

  const cotizacionCollectionRef = collection(db, "cotizaciones");

  const getCotizaciones = async () => {
    let unsubscribe;
    try {
      const queryCotizaciones = query(
        cotizacionCollectionRef,
        orderBy("createdAt")
      );
      unsubscribe = onSnapshot(queryCotizaciones, (snapshot) => {
        let docs = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          // const createdAt = doc.createdAt;
          console.log("</> → doc:", doc, "id", id);

          docs.push({ ...data, id });

          // console.log("</> → createdAt:", createdAt);
          console.log("</> → docs:", docs);
        });
        setCotizaciones(docs);
      });
    } catch (error) {
      console.error(error);
    }

    return () => unsubscribe;
  };

  useEffect(() => {
    getCotizaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cotizaciones };
};
