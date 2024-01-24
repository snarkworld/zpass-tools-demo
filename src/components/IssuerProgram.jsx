// import React, { useState, useContext } from 'react';
// import { Button, Modal, Space, Form, Input, Row, Col, Spin } from 'antd';
// import WorkerContext from "../workers/WorkerContext";
// // import { SIGVERIFY_PROGRAM } from '../consts';
//
// const IssuerProgram = ({ accountPrivateKey, onModalCancel }) => {
//     const workerObject = useContext(WorkerContext);
//
//     const issuer = SIGVERIFY_PROGRAM;
//     const [modalText, setModalText] = useState(issuer);
//     const [progrmResult, setProgrmResult] = useState('');
//     const [progrmResultOutput, setProgrmResultOutput] = useState('');
//
//     const handleOk = async () => {
//         onModalCancel();
//     };
//
//     const handleCancel = () => {
//         console.log('Clicked cancel button');
//         onModalCancel();
//     };
//
//     const execute = async (formValues) => {
//         setProgrmResult('');
//         setProgrmResultOutput(null);
//
//         const result = await workerObject.postMessagePromise({
//             type: "ALEO_EXECUTE_PROGRAM_LOCAL",
//             localProgram: issuer,
//             aleoFunction: "verify",
//             inputs: [
//                 {
//                     type: "signature",
//                     value: formValues.firstNumber,
//                 },
//                 {
//                     type: "address",
//                     value: formValues.secondNumber,
//                 },
//                 {
//                     type: "Message",
//                     value: {
//
//                     }
//                 }
//             ],
//
//             privateKey: accountPrivateKey,
//         });
//
//         setProgrmResult(JSON.stringify(result))
//         alert(`Result: ${result.outputs.outputs[0]}`)
//         setProgrmResultOutput(result.outputs.outputs[0])
//     }
//
//     const onFinish = async (values) => {
//         console.log('Success:', values);
//         await execute(values);
//     };
//
//
//     return (
//         <>
//           <Modal
//             title="EXECUTE Program"
//             visible={true}  // use 'visible' instead of 'open'
//             onOk={handleOk}  // keep only if it does something other than handleCancel
//             confirmLoading={false}
//             onCancel={handleCancel}
//           >
//             <Row gutter={16}>
//               {/* Program Text Column */}
//               <Col span={12}>
//                 <pre>{modalText}</pre>
//               </Col>
//
//               {/* Form Column */}
//               <Col span={12}>
//                 <Form
//                   name="basic"
//                   labelCol={{ span: 12 }}
//                   wrapperCol={{ span: 12 }}
//                   onFinish={onFinish}
//                   autoComplete="off"
//                 >
//                   {/* Input Fields */}
//                   <Form.Item
//                     label="First Number"
//                     name="firstNumber"
//                     rules={[{ required: true, message: 'Please input first number!' }]}
//                   >
//                     <Input />
//                   </Form.Item>
//
//                   <Form.Item
//                     label="Second Number"
//                     name="secondNumber"
//                     rules={[{ required: true, message: 'Please input second number!' }]}
//                   >
//                     <Input />
//                   </Form.Item>
//
//                   {/* Submit Button */}
//                   <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//                     <Space>
//                       <Button
//                         type="primary"
//                         htmlType="submit"
//                         disabled={workerObject ? workerObject.isLoading : true}
//                       >
//                         Execute Program
//                       </Button>
//                       {workerObject && workerObject.isLoading && (<Spin />)}
//                     </Space>
//                   </Form.Item>
//                 </Form>
//               </Col>
//             </Row>
//
//             {/* Program Result Column */}
//             {programResult && (
//               <Row>
//                 <Col span={24}>
//                   <code style={{ wordBreak: 'break-all' }}>{programResult}</code>
//                 </Col>
//               </Row>
//             )}
//           </Modal>
//         </>
//       );
//
// };
//
// export default IssuerProgram;
