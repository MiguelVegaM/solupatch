import {
  // useEffect,
  useRef,
  useState,
} from 'react';

import { signOut } from 'firebase/auth';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';

import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import * as XLSX from 'xlsx';
import { Toaster, toast } from 'sonner';
import Dropdown from 'react-bootstrap/Dropdown';

import logoPrincipal from '../../assets/imgs/logo-solupatch.webp';
import {
  FaCircleCheck,
  FaCircleMinus,
  FaCircleXmark,
  FaFilePdf,
  FaRegPenToSquare,
  FaTrash,
} from 'react-icons/fa6';
import '../cotizaciones/styles.scss';
import { MdSave } from 'react-icons/md';

export const Cotizaciones = () => {
  const [tempDeleteId, setTempDeleteId] = useState('');
  const [tempUpdateId, setTempUpdateId] = useState('');
  const [nuevoStatus, setNuevoStatus] = useState('');
  const [showSaveBtn, setShowSaveBtn] = useState(false);

  const {
    isAuth,
    // userID,
    emailValue,
  } = useGetUserInfo();

  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();

  // console.log(cotizaciones);

  // NOTE: Excel sheet
  const downloadExcel = () => {
    let table = [
      {
        A: 'FOLIO',
        B: 'CLIENTE',
        C: 'FECHA',
        D: 'VENDEDOR',
        E: 'MERCANCÍA',
        F: 'CANTIDAD',
        G: 'EMPRESA',
        H: 'EMAIL',
        I: 'CELULAR',
        J: 'TOTAL',
      },
    ];
    cotizaciones.forEach((cotizacion) => {
      const formatedDate = () => {
        const { seconds, nanoseconds } = cotizacion?.createdAt || {};
        const Date = moment
          .unix(seconds)
          .add(nanoseconds / 1000000, 'milliseconds');
        moment.locale('es');
        const Fordate = Date.format('DD MM YYYY, h:mm a') || '';
        return Fordate;
      };

      table.push({
        A: cotizacion.folio,
        B: cotizacion.nombre,
        C: formatedDate(),
        D: cotizacion.emailValue,
        E: cotizacion.seleccione,
        F: cotizacion.cantidad,
        G: cotizacion.empresa,
        H: cotizacion.email,
        I: cotizacion.celular,
        J: (
          (((cotizacion.cantidad / 1) * cotizacion.precio.replace(/,/g, '')) /
            1 +
            cotizacion.entrega.replace(/,/g, '') / 1) *
            0.16 +
          (((cotizacion.cantidad / 1) * cotizacion.precio.replace(/,/g, '')) /
            1 +
            cotizacion.entrega.replace(/,/g, '') / 1)
        ).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
    });

    const finalData = [...table];

    createFilter(finalData);
  };
  const createFilter = (finalData) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(finalData, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cotizaciones');
    XLSX.writeFile(workbook, 'Cotizaciones SOLUPATCH.xlsx');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/autenticacion');
    } catch (error) {
      console.log(error);
    }
  };

  const modalRef = useRef(null);

  const closeModal = () => {
    console.log(tempDeleteId);
    modalRef.current.close();
  };

  const closeModalOutside = (e) => {
    const dialogDimensions = modalRef.current.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modalRef.current.close();
    }
  };

  // NOTE: DELETE

  const openModal = async (id) => {
    setTempDeleteId(id);
    // console.log(tempDeleteId);
    modalRef.current.showModal();
  };
  const onDelete = async () => {
    const docRef = doc(db, 'cotizaciones', tempDeleteId);
    await deleteDoc(docRef);
    setTempDeleteId('');
    // console.log(tempDeleteId);
    modalRef.current.close();
    toast.warning('Cotización eliminada');
  };

  // NOTE: UPDATE

  const onClickUpdate = (id) => {
    setTempUpdateId(id);
    console.log('</> → id:', id);
  };
  console.log(tempUpdateId);

  const onUpdate = async (e, statusFromDropdown) => {
    setNuevoStatus(statusFromDropdown);
    console.log(statusFromDropdown);
    setShowSaveBtn(true);
  };

  const onUpdateSave = async () => {
    // console.log(nuevoStatus);
    try {
      // console.log(tempUpdateId);
      const docRef = doc(db, 'cotizaciones', tempUpdateId);
      await updateDoc(docRef, {
        status: nuevoStatus,
      });
    } catch (error) {
      console.log(error);
    }
    toast.success('Estado actualizado');
    setShowSaveBtn(false);
  };

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <div className='cotizaciones'>
      {/* Delete Modal */}
      <dialog
        onClick={closeModalOutside}
        ref={modalRef}
        className='cotizaciones__modal'
      >
        <div>
          <h3>Eliminar Cotización</h3>
          <p>Si elimina esta cotización los datos no podrán ser recuperados.</p>

          <div className='cotizaciones__modal--buttons-container'>
            <button
              className='cotizaciones__modal--delete-button'
              onClick={onDelete}
            >
              Eliminar
            </button>
            <button
              className='cotizaciones__modal--close-button'
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      </dialog>
      <div className='cotizaciones__navbar'>
        <div className='cotizador__navbar--vendedor'>
          <span>Vendedor:</span> {emailValue}
        </div>
        <img
          className='cotizaciones__navbar--img'
          src={logoPrincipal}
          alt='Solupatch Logo'
        />
        <div className='navbar__buttons'>
          <a href='/cotizador'>
            <button className='navbar__button--cotizaciones'>Cotizador</button>
          </a>
          <button
            className='navbar__button--cotizaciones'
            onClick={downloadExcel}
          >
            Exportar Excel
          </button>
          <button className='navbar__button--cotizaciones' onClick={logout}>
            Salir
          </button>
        </div>
      </div>

      <div className='cotizaciones__body'>
        <Table striped>
          <thead>
            <tr>
              <th>Folio</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Vendedor</th>
              {/* <th>Mercancia</th> */}
              {/* <th>Cantidad</th> */}
              <th>Total de Cotizacion</th>
              <th>Estado</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              // if the email logged is rvl@solupatch.com render this
              emailValue === 'rvl@solupatch.com'
                ? cotizaciones
                    .map((cotizacion) => {
                      const { seconds, nanoseconds } =
                        cotizacion.createdAt || {};
                      const Date = moment
                        .unix(seconds)
                        .add(nanoseconds / 1000000, 'milliseconds');
                      moment.locale('es');
                      const Fordate = Date.format('DD/MM/YYYY') || '';
                      const {
                        nombre,
                        id,
                        emailValue,
                        entrega,
                        folio,
                        status,
                        cantidad,
                        precio,
                        total,
                        // seleccione,
                        // empresa,
                        // celular,
                        // email,
                      } = cotizacion;
                      // console.log("</> → userID:", userID);

                      let importe =
                        cantidad * 1 * (precio.replace(/,/g, '') * 1);
                      let iva =
                        (importe + entrega.replace(/,/g, '') * 1) * 0.16;
                      let totalImporte =
                        importe + iva + entrega.replace(/,/g, '') * 1;
                      let totalFormated = totalImporte.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });

                      let importeDy = total;
                      let ivaDy =
                        (importeDy + entrega.replace(/,/g, '') * 1) * 0.16;
                      let totalImporteDy =
                        importeDy + ivaDy + entrega.replace(/,/g, '') * 1;
                      let totalFormatedDy = totalImporteDy.toLocaleString(
                        'en-US',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      );

                      return (
                        // Table Data
                        <tr key={id}>
                          <td>{folio}</td>
                          <td>{nombre}</td>
                          <td>{Fordate}</td>
                          <td>
                            {emailValue === 'aclarrea@solupatch.com'
                              ? 'Ana Larrea'
                              : emailValue === 'jlramos@solupatch.com'
                              ? 'José Ramos'
                              : emailValue === 'rvl@solupatch.com'
                              ? 'Rodolfo Villalobos'
                              : emailValue === 'lblanco@solupatch.com'
                              ? 'Luis Blanco'
                              : 'Invitado'}
                          </td>
                          <td>
                            ${' '}
                            {cotizacion.dynamicForm
                              ? totalFormatedDy
                              : totalFormated}
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'flex',
                                position: 'relative',
                              }}
                            >
                              <Dropdown onClick={() => onClickUpdate(id)}>
                                <Dropdown.Toggle
                                  variant='warning'
                                  id='dropdown-basic'
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid black',
                                    borderRadius: '50px',
                                    padding: '1px 6px 1px 0px',
                                  }}
                                >
                                  {status === 'cancelado' ? (
                                    <FaCircleXmark
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: 'red',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  ) : status === 'vendido' ? (
                                    <FaCircleCheck
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: 'green',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  ) : (
                                    <FaCircleMinus
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: '#FBC512',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'seguimiento')}
                                    value='seguimiento'
                                  >
                                    Seguimiento
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'cancelado')}
                                    value='cancelado'
                                  >
                                    Cancelado
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'vendido')}
                                    value='vendido'
                                  >
                                    Vendido
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              {showSaveBtn && id === tempUpdateId && (
                                <MdSave
                                  onClick={onUpdateSave}
                                  style={{
                                    width: '25px',
                                    height: '25px',
                                    color: 'white',
                                    backgroundColor: 'black',
                                    borderRadius: '50px',
                                    padding: '3px',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '15px',
                                    top: '1.5px',
                                  }}
                                />
                              )}
                            </span>
                          </td>
                          <td></td>
                          <td>
                            <NavLink
                              to={`/pdf/${cotizacion?.id}`}
                              target='_blank'
                            >
                              <button className='cotizador__button--descargar'>
                                <FaFilePdf />
                              </button>
                            </NavLink>
                          </td>
                          <td>
                            <NavLink
                              to={`/cotizador-actualizar/${cotizacion?.id}`}
                            >
                              <button className='cotizador__button--edit'>
                                <FaRegPenToSquare />
                              </button>
                            </NavLink>
                          </td>
                          <td>
                            {/* Boton para dialogo */}
                            <Button
                              onClick={() => openModal(id)}
                              className='cotizador__button--delete'
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                    .reverse()
                : // if other email render this
                  cotizaciones
                    .filter(
                      (cotizacion) => cotizacion?.emailValue === emailValue
                    )
                    .map((cotizacion) => {
                      const { seconds, nanoseconds } =
                        cotizacion.createdAt || {};
                      const Date = moment
                        .unix(seconds)
                        .add(nanoseconds / 1000000, 'milliseconds');
                      moment.locale('es');
                      const Fordate = Date.format('DD/MM/YYYY') || '';
                      const {
                        nombre,
                        id,
                        emailValue,
                        entrega,
                        folio,
                        status,
                        cantidad,
                        precio,
                        total,
                        // seleccione,
                        // empresa,
                        // celular,
                        // email,
                      } = cotizacion;
                      // console.log("</> → userID:", userID);

                      let importe =
                        cantidad * 1 * (precio.replace(/,/g, '') * 1);
                      let iva =
                        (importe + entrega.replace(/,/g, '') * 1) * 0.16;
                      let totalImporte =
                        importe + iva + entrega.replace(/,/g, '') * 1;
                      let totalFormated = totalImporte.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });

                      let importeDy = total;
                      let ivaDy =
                        (importeDy + entrega.replace(/,/g, '') * 1) * 0.16;
                      let totalImporteDy =
                        importeDy + ivaDy + entrega.replace(/,/g, '') * 1;
                      let totalFormatedDy = totalImporteDy.toLocaleString(
                        'en-US',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      );

                      return (
                        // Table Data
                        <tr key={id}>
                          <td>{folio}</td>
                          <td>{nombre}</td>
                          <td>{Fordate}</td>
                          <td>
                            {emailValue === 'aclarrea@solupatch.com'
                              ? 'Ana Larrea'
                              : emailValue === 'jlramos@solupatch.com'
                              ? 'José Ramos'
                              : emailValue === 'rvl@solupatch.com'
                              ? 'Rodolfo Villalobos'
                              : emailValue === 'lblanco@solupatch.com'
                              ? 'Luis Blanco'
                              : 'Invitado'}
                          </td>
                          <td>
                            ${' '}
                            {cotizacion.dynamicForm
                              ? totalFormatedDy
                              : totalFormated}
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'flex',
                                position: 'relative',
                              }}
                            >
                              <Dropdown onClick={() => onClickUpdate(id)}>
                                <Dropdown.Toggle
                                  variant='warning'
                                  id='dropdown-basic'
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid black',
                                    borderRadius: '50px',
                                    padding: '1px 6px 1px 0px',
                                  }}
                                >
                                  {status === 'cancelado' ? (
                                    <FaCircleXmark
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: 'red',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  ) : status === 'vendido' ? (
                                    <FaCircleCheck
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: 'green',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  ) : (
                                    <FaCircleMinus
                                      style={{
                                        fontSize: '1.5rem',
                                        color: 'black',
                                        backgroundColor: '#FBC512',
                                        borderRadius: '50px',
                                        marginLeft: '6px',
                                      }}
                                    />
                                  )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'seguimiento')}
                                    value='seguimiento'
                                  >
                                    Seguimiento
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'cancelado')}
                                    value='cancelado'
                                  >
                                    Cancelado
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(e) => onUpdate(e, 'vendido')}
                                    value='vendido'
                                  >
                                    Vendido
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                              {showSaveBtn && id === tempUpdateId && (
                                <MdSave
                                  onClick={onUpdateSave}
                                  style={{
                                    width: '25px',
                                    height: '25px',
                                    color: 'white',
                                    backgroundColor: 'black',
                                    borderRadius: '50px',
                                    padding: '3px',
                                    cursor: 'pointer',
                                    marginLeft: '5px',
                                    fontSize: '20px',
                                    position: 'absolute',
                                    right: '15px',
                                    top: '1.5px',
                                  }}
                                />
                              )}
                            </span>
                          </td>
                          <td></td>
                          <td>
                            <NavLink to={cotizacion?.id} target='_blank'>
                              <button className='cotizador__button--descargar'>
                                <FaFilePdf />
                              </button>
                            </NavLink>
                          </td>
                          <td>
                            <FaRegPenToSquare />
                          </td>
                          <td>
                            {/* Boton para dialogo */}
                            <Button
                              onClick={() => openModal(id)}
                              className='cotizador__button--delete'
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                    .reverse()
            }
          </tbody>
        </Table>
      </div>
      <Toaster position='bottom-center' richColors />
    </div>
  );
};
