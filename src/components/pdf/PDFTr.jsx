import { useParams } from "react-router-dom";
import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";

export const PDFTr = () => {
  let { cotizacionId } = useParams();

  const { cotizaciones } = useGetCotizaciones();

  let cotizacionSeleccionada = cotizaciones.find(
    (cotizacion) => cotizacion?.id === cotizacionId
  );

  console.log(cotizacionSeleccionada);

  // const cotizacionSeleccionada = {
  //   celular: "1234567890",
  //   createdAt: "May 29, 2024 at 1:05:17 PM UTC-6",
  //   email: "ejemplo1a2i@gmail.com",
  //   emailValue: "jlramos@solupatch.com",
  //   empresa: "Regiomuros",
  //   entrega: "500",
  //   folio: "000999",
  //   nombre: "Daniel Vega",
  //   status: "seguimiento",
  //   seleccione: "25kg Solupatch Bultos",
  //   cantidad: 1,
  //   precio: "1000",
  //   dynamicForm: [
  //     {
  //       seleccione: "Suministro y tendido pg64",
  //       cantidad: "1",
  //       precio: "1111",
  //     },
  //     { seleccione: "Emulsión aslfáltica", cantidad: "2", precio: "2222" },
  //   ],
  // };

  // NOTE:: Datos formateados
  let importe =
    cotizacionSeleccionada?.cantidad *
    cotizacionSeleccionada?.precio.replace(/,/g, "");
  let importeFormated = importe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let precio = cotizacionSeleccionada?.precio.replace(/,/g, "") * 1;
  let precioFormated = precio.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <table className="cotizacion__title__bar">
      <thead className="cotizacion__title__thead">
        <tr>
          <th className="cotizacion__title__th">CANTIDAD</th>
          <th className="cotizacion__title__th">DESCRIPCIÓN</th>
          <th className="cotizacion__title__th">V. UNITARIO</th>
          <th className="cotizacion__title__th">IMPORTE</th>
        </tr>
      </thead>
      {cotizacionSeleccionada.dynamicForm ? (
        cotizacionSeleccionada.dynamicForm.map((dynamicForm) => {
          // NOTE:: Datos formateados
          let importe =
            dynamicForm?.cantidad * dynamicForm?.precio.replace(/,/g, "");

          let importeFormated = importe.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          let precio = dynamicForm?.precio.replace(/,/g, "") * 1;

          let precioFormated = precio.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <tbody
              style={{ borderBottom: ".01rem solid gray" }}
              className="cotizacion__title__tbody"
              key={Math.random()}
            >
              <tr className="cotizacion__title__tr">
                <td className="cotizacion__title__td">
                  {dynamicForm?.cantidad}{" "}
                  {dynamicForm?.seleccione === "25kg Solupatch Bultos" && (
                    <span className="cotizador__input--placeholder">
                      Bultos
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Solupatch a Granel" && (
                    <span className="cotizador__input--placeholder">
                      Toneladas
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Debastado" && (
                    <span className="cotizador__input--placeholder">M2</span>
                  )}
                  {dynamicForm?.seleccione === "Suministro y tendido pg64" && (
                    <span className="cotizador__input--placeholder">
                      Toneladas
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Suministro y tendido pg76" && (
                    <span className="cotizador__input--placeholder">
                      Toneladas
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Impregnación" && (
                    <span className="cotizador__input--placeholder">
                      Litros
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Suministro pg64" && (
                    <span className="cotizador__input--placeholder">
                      Toneladas
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Traslado carpeta" && (
                    <span className="cotizador__input--placeholder">
                      Toneladas
                    </span>
                  )}
                  {dynamicForm?.seleccione === "Movimientos maquinaria" && (
                    <span className="cotizador__input--placeholder">Flete</span>
                  )}
                  {dynamicForm?.seleccione === "Emulsión aslfáltica" && (
                    <span className="cotizador__input--placeholder">
                      Litros
                    </span>
                  )}
                </td>
                <td className="cotizacion__title__td">
                  {dynamicForm?.seleccione}
                </td>
                <td className="cotizacion__title__td">$ {precioFormated}</td>
                <td className="cotizacion__title__td">$ {importeFormated}</td>
              </tr>
            </tbody>
          );
        })
      ) : (
        <tbody
          style={{ borderBottom: ".01rem solid gray" }}
          className="cotizacion__title__tbody"
          key={Math.random()}
        >
          <tr className="cotizacion__title__tr">
            <td className="cotizacion__title__td">
              {cotizacionSeleccionada?.cantidad}{" "}
              {cotizacionSeleccionada?.seleccione ===
                "25kg Solupatch Bultos" && (
                <span className="cotizador__input--placeholder">Bultos</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Solupatch a Granel" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Debastado" && (
                <span className="cotizador__input--placeholder">M2</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                "Suministro y tendido pg64" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                "Suministro y tendido pg76" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Impregnación" && (
                <span className="cotizador__input--placeholder">Litros</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Suministro pg64" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Traslado carpeta" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {cotizacionSeleccionada?.seleccione ===
                "Movimientos maquinaria" && (
                <span className="cotizador__input--placeholder">Flete</span>
              )}
              {cotizacionSeleccionada?.seleccione === "Emulsión aslfáltica" && (
                <span className="cotizador__input--placeholder">Litros</span>
              )}
            </td>
            <td className="cotizacion__title__td">
              {cotizacionSeleccionada?.seleccione}
            </td>
            <td className="cotizacion__title__td">$ {precioFormated}</td>
            <td className="cotizacion__title__td">$ {importeFormated}</td>
          </tr>
        </tbody>
      )}
    </table>
  );
};
