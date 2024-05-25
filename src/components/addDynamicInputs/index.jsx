// NOTE: Aquí lo que estoy tratando de hacer es agregar un input dinamico desde otro componente, estoy batallando para pasar las props desde el componente AddDynamicInputFields a el componente Cotizador

// NOTE: En cuanto a los inputs ya están funcionando independientes solo falta el placeholder del input 'Cantidad' ya que se renderea por estado y al seleccionar el segundo input, se cambia el estado y tambien se cambia el primer input

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const AddDynamicInputs = () => {
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //     navigate("/cotizaciones");
  //   }
  // }, [isSubmitSuccessful, navigate, reset]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors,
      // isSubmitting, isDirty,
      isSubmitSuccessful,
    },
  } = useForm({
    defaultValues: {
      test: [
        {
          seleccione: '',
          cantidad: '',
          precio: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'test',
  });

  const handlePrecioChange = (e) => {
    const formattedNumber = Number(
      e.target.value.replace(/,/g, '').replace(/[A-Za-z]/g, '')
    ).toLocaleString();
    setPrecio(formattedNumber);
    // setValue("precio", { formattedNumber });
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log('data', data);
  };

  // if you want to control your fields with watch
  // const watchResult = watch("test");
  // console.log(watchResult);

  // The following is useWatch example
  // console.log(useWatch({ name: "test", control }));

  return (
    <div>
      <ul>
        {fields.map((item, index) => {
          const selectValue = getValues(`test.${index}.seleccione`);
          return (
            <li key={item.id} style={{ listStyle: 'none' }}>
              {/* <input
                {...register(`test.${index}.firstName`, { required: true })}
              /> */}
              <div
                className='input_container cotizador__form--inputs'
                key={index}
                style={{
                  marginLeft: '-20px',
                  width: '90%',
                  position: 'relative',
                }}
              >
                {/* NOTE: Seleccione */}
                <div className='cotizador__input--pair cotizador__input--pair--select'>
                  <label className='cotizador__inputs--label'>
                    Seleccione un tipo
                  </label>
                  <select
                    {...register(`test.${index}.seleccione`, {
                      required: true,
                    })}
                    className='cotizador__inputs--select'
                    // onChange={() => fnchange()}
                  >
                    <option value='25kg Solupatch Bultos'>
                      25kgs Solupatch Bultos
                    </option>
                    <option value='Solupatch a Granel'>
                      Solupatch a Granel
                    </option>
                    <option value='Debastado'>Debastado</option>
                    <option value='Suministro y tendido pg64'>
                      Suministro y tendido pg64
                    </option>
                    <option value='Suministro y tendido pg76'>
                      Suministro y tendido pg76
                    </option>
                    <option value='Impregnación'>Impregnación</option>
                    <option value='Suministro pg64'>Suministro pg64</option>
                    <option value='Traslado carpeta'>Traslado carpeta</option>
                    <option value='Movimientos maquinaria'>
                      Movimientos maquinaria
                    </option>
                    <option value='Emulsión aslfáltica'>
                      Emulsión aslfáltica
                    </option>
                  </select>
                  {errors?.seleccione?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                {/* NOTE: Cantidad */}
                <div className='cotizador__input--pair'>
                  <label className='cotizador__inputs--label'>Cantidad</label>
                  <input
                    {...register(`test.${index}.cantidad`, {
                      required: true,
                    })}
                    className='cotizador__inputs--input cantidad'
                    type='number'
                  />

                  {selectValue === '25kg Solupatch Bultos' && (
                    <span className='cotizador__input--placeholder'>
                      Bultos
                    </span>
                  )}
                  {selectValue === 'Solupatch a Granel' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Debastado' && (
                    <span className='cotizador__input--placeholder'>M2</span>
                  )}
                  {selectValue === 'Suministro y tendido pg64' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Suministro y tendido pg76' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Impregnación' && (
                    <span className='cotizador__input--placeholder'>
                      Litros
                    </span>
                  )}
                  {selectValue === 'Suministro pg64' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Traslado carpeta' && (
                    <span className='cotizador__input--placeholder'>
                      Toneladas
                    </span>
                  )}
                  {selectValue === 'Movimientos maquinaria' && (
                    <span className='cotizador__input--placeholder'>Flete</span>
                  )}
                  {selectValue === 'Emulsión aslfáltica' && (
                    <span className='cotizador__input--placeholder'>
                      Litros
                    </span>
                  )}
                  {errors?.cantidad?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                {/* NOTE: Precio */}

                <div className='cotizador__input--pair'>
                  <label className='cotizador__inputs--label'>Precio</label>
                  <span>$</span>
                  <input
                    {...register(`test.${index}.precio`, {
                      required: true,
                    })}
                    className='cotizador__inputs--input precio'
                    type='text'
                    // value={precio}
                    onChange={handlePrecioChange}
                  />
                  {errors?.precio?.type === 'required' && (
                    <p className='cotizador__form--error-message'>
                      Este campo es requerido
                    </p>
                  )}
                </div>
                <button
                  className='cotizador__form--agregar-button'
                  type='button'
                  onClick={() => {
                    append({ seleccione: '', cantidad: '', precio: '' });
                  }}
                >
                  Agregar concepto
                </button>

                {index > 0 && (
                  <button
                    style={{
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '50px',
                      right: '-85px',
                      padding: '0px 8px 2px 8px',
                      borderRadius: '50%',
                      backgroundColor: '#cc1a1a',
                      border: 'none',
                    }}
                    type='button'
                    onClick={() => remove(index)}
                  >
                    x
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <section></section>
      <button onClick={handleSubmit(onSubmit)}>Guardar Conceptos</button>
    </div>
  );
};
