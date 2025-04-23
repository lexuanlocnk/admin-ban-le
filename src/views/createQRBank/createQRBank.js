// import React from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { InputGroup, Input, Button, Card, CardBody, Row, Col } from 'reactstrap';
// import { Search } from 'lucide-react';

// const validationSchema = Yup.object().shape({
//   mapx: Yup.string().required('Vui lòng nhập mã phiếu xuất')
// });

// const QRCodeOrderPage = () => {
//   return (
//     <div className="qrcode-page">
//       <h2 className="qrcode-page__title">Tạo mã QRcode cho đơn hàng NKC</h2>

//       <Formik
//         initialValues={{ mapx: '' }}
//         validationSchema={validationSchema}
//         onSubmit={(values) => {
//           console.log('Tra cứu với mã:', values.mapx);
//         }}
//       >
//         {({ handleSubmit }) => (
//           <Form onSubmit={handleSubmit} className="qrcode-page__form">
//             <InputGroup className="qrcode-page__input-group">
//               <Field
//                 name="mapx"
//                 as={Input}
//                 placeholder="Nhập mã phiếu xuất"
//                 className="qrcode-page__input"
//               />
//               <Button type="submit" color="success">
//                 <Search size={16} />
//               </Button>
//             </InputGroup>
//             <ErrorMessage name="mapx" component="div" className="qrcode-page__error" />
//           </Form>
//         )}
//       </Formik>

//       <div className="qrcode-layout">
//         <h4 className="qrcode-layout__title">
//           Thanh toán qua Banking cho đơn hàng (X250422100-N)
//         </h4>

//         <Row className="qrcode-layout__content">
//           <Col md={6}>
//             <Card>
//               <CardBody>
//                 <div className="qrcode-box">
//                   <div className="qrcode-box__qrcode">
//                     <image src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_1280.png" alt="QR Code" />
//                   </div>
//                   <p>Số tiền: <strong>10,980,000 VND</strong></p>
//                   <p>Đơn hàng: <strong>X250422100-N</strong></p>
//                   <p>Tên cửa hàng: <strong>Test Momo</strong></p>
//                   <p className="qrcode-box__note">
//                     Sử dụng App Banking hoặc ứng dụng camera hỗ trợ QR code để quét mã
//                   </p>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>

//           <Col md={6}>
//             <Card>
//               <CardBody>
//                 <h5>Thông tin đơn hàng</h5>
//                 <div className="order-info">
//                   <p>Tên Khách hàng: <strong>CÔNG TY TNHH MTV TINH TOÀN PHÚC</strong></p>
//                   <p>MST: <strong>2100670969</strong></p>
//                   <p>Liên hệ: <strong>Ông Toàn - 0963676076</strong></p>
//                   <p>Địa chỉ giao hàng: <strong>Chành xe Thành Thơ, 274 Trần Phú, TP Trà Vinh</strong></p>
//                   <p>Ghi chú: <strong>GH chờ cọc GH</strong></p>

//                   <div className="order-info__product-list">
//                     <p><strong>Hàng hóa đã mua:</strong></p>
//                     <ul>
//                       <li>1x NOTEBOOK HP 15-FD0306TU / I3-1315U / 8GB / 256GB / 15.6 FHD / WIN11 + SILVER - 9,981,818 VND</li>
//                       <li>1x SSD SILICON POWER 256GB SATA III SP512GAB26M28 - 0 VND</li>
//                       <li>1x Túi laptop 15 inch - 0 VND</li>
//                     </ul>
//                     <p>Tổng SL: <strong>3</strong></p>
//                     <p>Thành tiền: <strong>10,980,000 VND (đã VAT)</strong></p>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default QRCodeOrderPage;
