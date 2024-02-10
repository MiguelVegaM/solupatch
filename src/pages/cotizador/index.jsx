import { useForm } from "react-hook-form";

import "./styles.scss";

export const Cotizador = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      nombre: "",
      empresa: "",
      celular: "",
      correo: "",
      seleccione: "",
      cantidad: "",
      precio: "",
      entrega: "",
    },
  });
  const onSubmit = (data) => {
    // alert(JSON.stringify(data));
    console.log(data);
  };
  // console.log("errors:", errors, "isDirty:", isDirty);

  return (
    <div className="cotizador">
      <div className="cotizador__navbar">
        <img
          className="cotizador__navbar--img"
          src="/logo-solupatch.webp"
          alt="Solupatch Logo"
        />
      </div>
      <div className="cotizador__body">
        <div className="cotizador__hero">
          <h2 className="cotizador__header--title">COTIZADOR</h2>
          <p className="cotizador__header--paragraph">Solupatch Versión 1.0</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="cotizador__form">
          <div className="cotizador__form--inputs">
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Nombre</label>
              <input
                {...register("nombre", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {errors?.nombre?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Empresa</label>
              <input
                {...register("empresa", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {errors?.empresa?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Celular</label>
              <input
                {...register("celular", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="tel"
              />
              {errors?.celular?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Correo</label>
              <input
                {...register("correo", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {errors?.correo?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
              {errors?.correo?.type === "pattern" && (
                <p className="cotizador__form--error-message">
                  Ingrese un correo valido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair cotizador__input--pair--select">
              <label className="cotizador__inputs--label">
                Seleccione una cantidad
              </label>
              <select
                {...register("seleccione", {
                  required: true,
                })}
                className="cotizador__inputs--select"
              >
                <option value="25kg">Solupatch Bultos 25kgs</option>
              </select>
              {errors?.seleccione?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Cantidad</label>
              <input
                {...register("cantidad", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="number"
              />
              {errors?.cantidad?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Precio</label>
              <input
                {...register("precio", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="number"
              />
              {errors?.precio?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">
                Servicio de entrega
              </label>
              <input
                {...register("entrega", {
                  required: true,
                })}
                className="cotizador__inputs--input"
                type="number"
              />
              {errors?.entrega?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
          </div>
          <button
            disabled={!isDirty || isSubmitting}
            type="submit"
            className="cotizador__form--button"
          >
            COTIZAR
          </button>
        </form>
      </div>
    </div>
  );
};
