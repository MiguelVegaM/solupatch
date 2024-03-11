import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAddCotizacion } from "../../hooks/useAddCotizacion";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import "./styles.scss";

export const Cotizador = () => {
  const [tipo, setTipo] = useState("");
  // console.log("</> → tipo:", tipo);

  const { isAuth } = useGetUserInfo();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      nombre: "",
      empresa: "",
      celular: "",
      email: "",
      seleccione: "",
      cantidad: "",
      precio: "",
      entrega: "",
    },
  });
  const onSubmit = async (data, e) => {
    e.preventDefault();
    addCotizacion(data);
    // console.log(data);
  };
  // console.log("</> → errors:", errors);
  // console.log("errors:", errors, "isDirty:", isDirty);

  const { addCotizacion } = useAddCotizacion();

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      // setTimeout(() => navigate("/cotizaciones"), 4000);
      // navigate("/cotizaciones");
    }
  }, [isSubmitSuccessful, navigate, reset]);

  if (!isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <div className="cotizador">
      <div className="cotizador__navbar">
        <div className="cotizador__navbar--space"></div>
        <img
          className="cotizador__navbar--img"
          src={logoPrincipal}
          alt="Solupatch Logo"
        />
        <div className="navbar__buttons">
          <a href="/cotizaciones">
            <button className="navbar__button--cotizador">Cotizaciones</button>
          </a>
          <button className="navbar__button--cotizador" onClick={logout}>
            Salir
          </button>
        </div>
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
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {errors?.email?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
              {errors?.email?.type === "pattern" && (
                <p className="cotizador__form--error-message">
                  Ingrese un correo valido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair cotizador__input--pair--select">
              <label className="cotizador__inputs--label">
                Seleccione un tipo
              </label>
              <select
                {...register("seleccione", {
                  required: true,
                })}
                className="cotizador__inputs--select"
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="Solupatch Bultos 25kg">
                  Solupatch Bultos 25kgs
                </option>
                <option value="Solupatch a Granel">Solupatch a Granel</option>
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
                className="cotizador__inputs--input cantidad"
                type="number"
              />
              {tipo === "Solupatch Bultos 25kg" && (
                <span className="cotizador__input--placeholder">Bultos</span>
              )}
              {tipo === "Solupatch a Granel" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {errors?.cantidad?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Precio</label>
              <span>$</span>
              <input
                {...register("precio", {
                  // required: true,
                })}
                className="cotizador__inputs--input precio"
                type="number"
                value={
                  (tipo === "Solupatch Bultos 25kg" && 219) ||
                  (tipo === "Solupatch a Granel" && 1500)
                }
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
              <span>$</span>
              <input
                {...register("entrega", {
                  required: true,
                })}
                className="cotizador__inputs--input precio"
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
