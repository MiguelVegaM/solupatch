import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase-config';
import {
  NavLink,
  Navigate,
  useNavigate,
  // useParams
} from 'react-router-dom';
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { useGetCotizaciones } from '../../hooks/useGetCotizaciones';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import moment from 'moment';
import Table from 'react-bootstrap/Table';

import logoPrincipal from '../../assets/imgs/logo-solupatch.webp';
import '../cotizaciones/styles.scss';

export const Cotizaciones = () => {
  const { isAuth } = useGetUserInfo();
  const navigate = useNavigate();

  const { cotizaciones } = useGetCotizaciones();

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  // let { cotizacionId } = useParams();

  // let cotizacionSeleccionada = cotizaciones.find(
  //   (cotizacion) => cotizacion?.id === cotizacionId
  // );

  // const downloadPDF = () => {
  //   const input = pdfRef.current;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     const imgY = 0;
  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imgWidth * ratio,
  //       imgHeight * ratio
  //     );
  //     pdf.save(`${cotizacionSeleccionada?.empresa}-Cotizacion.pdf`);
  //   });
  // };

  if (!isAuth) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      {/* <PDF pdfRef={pdfRef} /> */}
      <div className='cotizaciones__navbar'>
        <div className='cotizaciones__navbar--space'></div>
        <img
          className='cotizaciones__navbar--img'
          src={logoPrincipal}
          alt='Solupatch Logo'
        />
        <div className='navbar__buttons'>
          <a href='/cotizador'>
            <button className='navbar__button--cotizaciones'>Cotizador</button>
          </a>
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
              <th>Fecha de Creación</th>
              <th>Vendedor</th>
              <th>Cantidad</th>
              <th>Total de Cotizacion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones
              ?.map((cotizacion) => {
                const { seconds, nanoseconds } = cotizacion.createdAt || {};
                const Date = moment
                  .unix(seconds)
                  .add(nanoseconds / 1000000, 'milliseconds');
                moment.locale('es-mx');
                const Fordate = Date.format('lll') || '';
                const {
                  nombre,
                  id,
                  emailValue,
                  cantidad,
                  precio,
                  entrega,
                  seleccione,
                  folio,
                  // empresa,
                  // celular,
                  // email,
                } = cotizacion;

                let importe = cantidad * 1 * (precio.replace(/,/g, '') * 1);
                let iva = (importe + entrega.replace(/,/g, '') * 1) * 0.16;
                let total = importe + iva + entrega.replace(/,/g, '') * 1;
                let totalFormated = total.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

                return (
                  <tr key={id}>
                    <td>{folio}</td>
                    <td>{nombre}</td>
                    <td>{Fordate}</td>
                    <td>{emailValue}</td>

                    <td>
                      {cantidad}{' '}
                      {seleccione === 'Solupatch Bultos 25kg'
                        ? 'Bultos'
                        : 'Toneladas'}
                    </td>
                    <td>$ {totalFormated}</td>
                    <td>
                      <NavLink to={cotizacion?.id} target='_blank'>
                        <button className='cotizador__button--descargar'>
                          Ver PDF
                        </button>
                      </NavLink>
                      {/* <button
                        // onClick={downloadPDF}
                        className="cotizador__button--descargar"
                      >
                        Descargar PDF
                      </button> */}
                    </td>
                  </tr>
                );
              })
              .reverse()}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
