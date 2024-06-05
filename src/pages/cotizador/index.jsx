/* eslint-disable react/prop-types */
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
import { AddDynamicInputs } from "../../components/addDynamicInputs";

export const Cotizador = () => {
  // const [tipo, setTipo] = useState("");
  // const [precio, setPrecio] = useState("");
  const [entrega, setEntrega] = useState("");
  const [dataFromDynamicInputs, setDataFromDynamicInputs] = useState("");
  const [conceptoGuardado, setConceptoGuardado] = useState(false);
  const [sumImportes, setSumImportes] = useState("");

  const { addFolio } = useAddFolio();
  const { addCotizacion } = useAddCotizacion();

  // const { cotizaciones } = useGetCotizaciones();
  const { folios } = useGetFolio();

  // const handlePrecioChange = (e) => {
  //   const formattedNumber = Number(
  //     e.target.value.replace(/,/g, "").replace(/[A-Za-z]/g, "")
  //   ).toLocaleString();
  //   setPrecio(formattedNumber);
  // };

  // console.log(precio);

  const handleDataFromChild = (data) => {
    setDataFromDynamicInputs(data);
    let importesArr = data.dynamicForm.map((item) => {
      return Number(item.precio * item.cantidad);
    });
    let sumImportesArr = importesArr.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
    setSumImportes(sumImportesArr);
  };

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
      // total: "",
    },
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (folios?.length <= 9) {
      console.log(sumImportes);
      const dataObj = {
        folio: "00000" + folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    } else if (folios?.length <= 99) {
      console.log(sumImportes);
      const dataObj = {
        folio: "0000" + folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    } else if (folios?.length <= 999) {
      console.log(sumImportes);
      const dataObj = {
        folio: "000" + folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    } else if (folios?.length <= 9999) {
      console.log(sumImportes);
      const dataObj = {
        folio: "00" + folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    } else if (folios?.length <= 99999) {
      console.log(sumImportes);
      const dataObj = {
        folio: "0" + folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    } else {
      console.log(sumImportes);
      const dataObj = {
        folio: folios.length,
        status: "seguimineto",
        total: sumImportes,
        ...data,
        ...dataFromDynamicInputs,
      };
      addCotizacion(dataObj);
    }
    addFolio(folio);
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
          </div>
          <AddDynamicInputs
            getDataFromChild={handleDataFromChild}
            stateChanger={setConceptoGuardado}
          />
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
              type="text"
              value={entrega}
              onChange={handleEntregaChange}
              style={{ paddingLeft: "35px" }}
            />
            {errors?.entrega?.type === "required" && (
              <p className="cotizador__form--error-message">
                Este campo es requerido
              </p>
            )}

          </div>
          <button
            disabled={!isDirty || isSubmitting || !conceptoGuardado}
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
