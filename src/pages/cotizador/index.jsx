import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase-config";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAddFolio } from "../../hooks/useAddFolio";
import { useAddCotizacion } from "../../hooks/useAddCotizacion";
// import { useGetCotizaciones } from "../../hooks/useGetCotizaciones";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useGetFolio } from "../../hooks/useGetFolio";

import logoPrincipal from "../../assets/imgs/logo-solupatch.webp";
import "./styles.scss";

export const Cotizador = () => {
  const [tipo, setTipo] = useState("");

  const { addFolio } = useAddFolio();
  const { addCotizacion } = useAddCotizacion();

  // const { cotizaciones } = useGetCotizaciones();
  const { folios } = useGetFolio();

  const [precio, setPrecio] = useState("");
  const [entrega, setEntrega] = useState("");

  const handlePrecioChange = (e) => {
    const formattedNumber = Number(
      e.target.value.replace(/,/g, "").replace(/[A-Za-z]/g, "")
    ).toLocaleString();
    setPrecio(formattedNumber);
    // setValue("precio", { formattedNumber });
  };

  // console.log(precio);
  const handleEntregaChange = (e) => {
    const formattedNumber = Number(
      e.target.value.replace(/,/g, "").replace(/[A-Za-z]/g, "")
    ).toLocaleString();
    setEntrega(formattedNumber);
  };

  const { isAuth, emailValue } = useGetUserInfo();
  const navigate = useNavigate();

  const folio = { num: Math.random() };

  const {
    register,
    handleSubmit,
    reset,
    // setValue,
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
    if (folios?.length <= 9) {
      const dataObj = {
        folio: "00010" + folios.length,
        status: "progreso",
        // total:
        //   (data.cantidad * data.precio * 1 + data.entrega * 1 * 1) * 0.16 +
        //   data.cantidad * data.precio * 1 +
        //   data.entrega * 1 * 1,
        ...data,
      };
      addCotizacion(dataObj);
    } else {
      const dataObj = {
        folio: "0001" + folios?.length,
        status: "progreso",
        // total:
        //   (data.cantidad * data.precio * 1 + data.entrega * 1 * 1) * 0.16 +
        //   data.cantidad * data.precio * 1 +
        //   data.entrega * 1 * 1,
        ...data,
      };
      addCotizacion(dataObj);
    }
    addFolio(folio);

    // console.log("</> → data:", data);
    // console.log("</> → folio:", folio);
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

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      navigate("/cotizaciones");
    }
  }, [isSubmitSuccessful, navigate, reset]);

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  // console.log(emailValue);

  return (
    <div className="cotizador">
      <div className="cotizador__navbar">
        <div className="cotizador__navbar--vendedor">
          <span>Vendedor:</span> {emailValue}
        </div>
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
                  required: false,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {/* {errors?.empresa?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )} */}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Celular</label>
              <input
                {...register("celular", {
                  // required: true,
                })}
                className="cotizador__inputs--input"
                type="tel"
              />
              {/* {errors?.celular?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )} */}
            </div>
            <div className="cotizador__input--pair">
              <label className="cotizador__inputs--label">Correo</label>
              <input
                {...register("email", {
                  // required: true,
                  // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="cotizador__inputs--input"
                type="text"
              />
              {/* {errors?.email?.type === "required" && (
                <p className="cotizador__form--error-message">
                  Este campo es requerido
                </p>
              )}
              {errors?.email?.type === "pattern" && (
                <p className="cotizador__form--error-message">
                  Ingrese un correo valido
                </p>
              )} */}
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
                <option value="25kg Solupatch Bultos">
                  25kgs Solupatch Bultos
                </option>
                <option value="Solupatch a Granel">Solupatch a Granel</option>
                <option value="Debastado">Debastado</option>
                <option value="Suministro y tendido pg64">
                  Suministro y tendido pg64
                </option>
                <option value="Suministro y tendido pg76">
                  Suministro y tendido pg76
                </option>
                <option value="Impregnación">Impregnación</option>
                <option value="Suministro pg64">Suministro pg64</option>
                <option value="Traslado carpeta">Traslado carpeta</option>
                <option value="Movimientos maquinaria">
                  Movimientos maquinaria
                </option>
                <option value="Emulsión aslfáltica">Emulsión aslfáltica</option>
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
              {tipo === "25kg Solupatch Bultos" && (
                <span className="cotizador__input--placeholder">Bultos</span>
              )}
              {tipo === "Solupatch a Granel" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {tipo === "Debastado" && (
                <span className="cotizador__input--placeholder">M2</span>
              )}
              {tipo === "Suministro y tendido pg64" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {tipo === "Suministro y tendido pg76" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {tipo === "Impregnación" && (
                <span className="cotizador__input--placeholder">Litros</span>
              )}
              {tipo === "Suministro pg64" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {tipo === "Traslado carpeta" && (
                <span className="cotizador__input--placeholder">Toneladas</span>
              )}
              {tipo === "Movimientos maquinaria" && (
                <span className="cotizador__input--placeholder">Flete</span>
              )}
              {tipo === "Emulsión aslfáltica" && (
                <span className="cotizador__input--placeholder">Litros</span>
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
              {/* <span>.00</span> */}
              <input
                {...register("precio", {
                  required: true,
                })}
                className="cotizador__inputs--input precio"
                type="text"
                value={precio}
                onChange={handlePrecioChange}
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
              {/* <span>.00</span> */}

              <input
                {...register("entrega", {
                  required: true,
                })}
                className="cotizador__inputs--input precio"
                type="text"
                value={entrega}
                onChange={handleEntregaChange}
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
