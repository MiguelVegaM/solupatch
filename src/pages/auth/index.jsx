import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import "./styles.scss";

export const Auth = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const tooglePasswordShow = (e) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };
  console.log("passwordShown:", passwordShown);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  console.log("errors:", errors, "isDirty:", isDirty);

  return (
    <div className="auth">
      <div className="auth__navbar">
        <img
          className="auth__navbar--img"
          src="../../../public/logo-solupatch.webp"
          alt="Solupatch Logo"
        />
      </div>
      <div className="auth__body">
        <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
          <div className="auth__form--inputs">
            <div className="auth__input--pair">
              <label className="auth__inputs--label">Correo</label>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                className="auth__inputs--input"
                type="text"
              />
              {errors?.email?.type === "required" && (
                <p className="auth__form--error-message">
                  Este campo es requerido
                </p>
              )}
              {errors?.email?.type === "pattern" && (
                <p className="auth__form--error-message">
                  Ingrese un correo valido
                </p>
              )}
              {/* // todo message error email no valid */}
              {/* {errors?.email?.type === "pattern" && (
                <p className="auth__form--error-message">
                  Este correo no está registrado en la base de datos
                </p>
              )} */}
              {/* //todo ------------------------- */}
            </div>
            <div className="auth__input--pair">
              <label className="auth__inputs--label">Contraseña</label>
              <span
                onClick={tooglePasswordShow}
                className="auth__password--icon"
              >
                {passwordShown ? <FaEyeSlash /> : <FaEye />}
              </span>
              <input
                {...register("password", {
                  required: true,
                })}
                className="auth__inputs--input"
                type={passwordShown ? "text" : "password"}
              />
            </div>
          </div>
          <button
            disabled={!isDirty || isSubmitting}
            type="submit"
            className="auth__form--button"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
