import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Result,
  Select,
  Skeleton,
} from 'antd';
import { LoadProgram } from './LoadProgram.jsx';
import { CodeEditor } from './CodeEditor.jsx';
import { useEffect, useState } from 'react';
import { useAccountProvider } from '../../contexts/account';
import { useAleoWASM } from '../../hooks/aleo-wasm-hook';
import {
  SIGVERIFY_PROGRAM_KECCAK_256,
  SIGVERIFY_PROGRAM_SHA3_256,
  SIGVERIFY_PROGRAM,
} from '../../consts.ts';
import { useGlobalProvider } from '../../contexts/global.js';

const layout = { labelCol: { span: 4 }, wrapperCol: { span: 18 } };

export const Execute = () => {
  const { global } = useGlobalProvider();
  const { account } = useAccountProvider();
  const [aleoWASM] = useAleoWASM();

  const [form] = Form.useForm();

  const [selectValue, setSelectValue] = useState(null);
  useEffect(() => {
    if (selectValue) onLoadProgram('');
    if (selectValue) setFunctions([]);
    if (selectValue) demoSelect();
    if (selectValue) setSelectValue();
    form.setFieldValue('privateKey', global.privateKey);
  }, [global]);

  const PROGRAM_MAP = {
    offchain_verifier: SIGVERIFY_PROGRAM,
    offchain_verifier_keccak256: SIGVERIFY_PROGRAM_KECCAK_256,
    offchain_verifier_sha3_256: SIGVERIFY_PROGRAM_SHA3_256,
  };

  const demoSelect = async (value) => {
    try {
      const program = PROGRAM_MAP[value];

      if (program) {
        await onLoadProgram(program);
        form.setFieldValue('manual_input', false);
        form.setFieldValue('functionName', 'verify');
      } else {
        await onLoadProgram('');
      }

      if (value) setSelectValue(value);
    } catch (error) {
      console.error('Error in demoSelect:', error);
    }
  };

  const [worker, setWorker] = useState(null);
  useEffect(() => {
    if (worker === null) {
      const spawnedWorker = spawnWorker();
      setWorker(spawnedWorker);
      return () => {
        spawnedWorker.terminate();
      };
    }
  }, []);

  const execute = async (values) => {
    setModalModalOpen(true);
    setLoading(true);

    const {
      program,
      functionName,
      inputs,
      fee,
      fee_record,
      peer_url,
      execute_onchain,
      privateKey,
    } = values;

    const payload = {
      aleoFunction: functionName,
      inputs: JSON.parse(inputs),
      privateKey: execute_onchain
        ? privateKey
        : account.privateKey().to_string(),
    };

    if (execute_onchain) {
      Object.assign(payload, {
        type: 'ALEO_EXECUTE_PROGRAM_ON_CHAIN',
        remoteProgram: program,
        fee,
        feeRecord: fee_record,
        url: peer_url,
      });
    } else {
      Object.assign(payload, {
        type: 'ALEO_EXECUTE_PROGRAM_LOCAL',
        localProgram: program,
      });
    }

    try {
      await postMessagePromise(worker, payload);
    } catch (error) {
      setLoading(false);
      setModalResult({
        status: 'error',
        title: 'Function Execution Error',
        subTitle: `Error: ${error || 'Something went wrong...'}`,
      });
    }
  };

  function postMessagePromise(worker, message) {
    return new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        resolve(event.data);
      };
      worker.onerror = (error) => {
        reject(error);
      };
      worker.postMessage(message);
    });
  }

  function spawnWorker() {
    let worker = new Worker(
      new URL('../../workers/worker.js', import.meta.url),
      { type: 'module' }
    );
    worker.addEventListener('message', (ev) => {
      if (ev.data.type == 'OFFLINE_EXECUTION_COMPLETED') {
        setLoading(false);
        setModalResult({
          title: 'Execution Successsful!',
          status: 'success',
          subTitle: `Outputs: ${ev.data.outputs.outputs}`,
        });
      } else if (ev.data.type == 'EXECUTION_TRANSACTION_COMPLETED') {
        const transactionId = ev.data.executeTransaction;
        setLoading(false);
        setModalResult({
          title: 'On-Chain Execution Successsful!',
          status: 'success',
          subTitle: `Transaction ID: ${transactionId}`,
        });
      } else if (ev.data.type == 'ERROR') {
        setLoading(false);
        setModalResult({
          status: 'error',
          title: 'Function Execution Error',
          subTitle: `Error: ${
            ev.data.errorMessage || 'Something went wrong...'
          }`,
        });
      }
    });
    return worker;
  }

  const [functions, setFunctions] = useState([]);
  const onLoadProgram = async (value) => {
    if (value) {
      form.setFieldsValue({
        program: value,
      });
      await onProgramChange(value);
    } else {
      form.setFieldsValue({
        program: '',
      });
    }
  };
  const onProgramEdit = async (value) => {
    await onProgramChange(value);
  };

  const onProgramChange = async (value) => {
    let processedProgram;
    try {
      processedProgram = await aleoWASM.Program.fromString(value);
    } catch (e) {
      alert('error');
      setFunctions([]);
      return;
    }
    //offchain_verifier.aleo verify
    const functionNames = processedProgram.getFunctions();
    const functionItems = functionNames.map((func) => {
      const functionInputs = processedProgram.getFunctionInputs(func);
      return {
        key: func,
        label: func,
        children: functionForm(func, functionInputs, global, processedProgram),
      };
    });
    setFunctions(functionItems);
  };

  const [modalOpen, setModalModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalResult, setModalResult] = useState({
    status: 'warning',
    subTitle: 'Sorry, something went wrong.',
  });
  const handleOk = () => {
    setModalModalOpen(false);
  };

  return (
    <Card title="Execute Program">
      <Modal
        title="Executing program..."
        open={modalOpen}
        onOk={handleOk}
        confirmLoading={loading}
        cancelButtonProps={{ style: { display: 'none' } }}
        closeIcon={false}
        maskClosable={false}
      >
        {loading ? <Skeleton active /> : <Result {...modalResult} />}
      </Modal>

      <Form.Provider
        onFormFinish={(name, info) => {
          if (name !== 'execute') {
            form.setFieldValue('functionName', name);
            let translatedArray = info.values.inputs.map((item) => {
              return JSON.stringify(item).replaceAll('"', '');
            });
            form.setFieldValue('inputs', JSON.stringify(translatedArray));
            form.submit();
          }
        }}
      >
        <Form
          form={form}
          name="execute"
          {...layout}
          onFinish={execute}
          autoComplete="off"
          scrollToFirstError="true"
        >
          <Select
            placeholder="Select a demo"
            onChange={demoSelect}
            value={selectValue}
            style={{ width: '250px' }}
            options={[
              {
                value: 'offchain_verifier',
                label: 'offchain_verifier.aleo',
              },
              {
                value: 'offchain_verifier_sha3_256',
                label: 'offchain_verifier_sha3_256.aleo',
              },
              {
                value: 'offchain_verifier_keccak256',
                label: 'offchain_verifier_keccak256.aleo',
              },
            ]}
          />
          <Divider dashed />
          <LoadProgram
            clearSelect={() => setSelectValue()}
            onResponse={onLoadProgram}
          />
          <Form.Item
            style={{ textAlign: 'justify' }}
            label="Program"
            name="program"
            rules={[
              {
                required: true,
                message: 'Please input or load an Aleo program',
              },
            ]}
          >
            <CodeEditor onChange={onProgramEdit} />
          </Form.Item>

          <Divider dashed />

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.manual_input !== currentValues.manual_input
            }
          >
            {({ getFieldValue }) => (
              <>
                <Form.Item
                  label="Function"
                  name="functionName"
                  hidden={!getFieldValue('manual_input')}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Inputs"
                  name="inputs"
                  hidden={!getFieldValue('manual_input')}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    xs: {
                      offset: 0,
                    },
                    sm: {
                      offset: 4,
                    },
                  }}
                  hidden={!getFieldValue('manual_input')}
                >
                  <Button type="primary" htmlType="submit">
                    Run
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.Item>
        </Form>
        <Divider dashed>Program Functions</Divider>
        {functions.length > 0 ? (
          <Collapse bordered={true} items={functions} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Form.Provider>
    </Card>
  );
};

const renderInput = (
  input,
  inputIndex,
  nameArray = [],
  func,
  global,
  selectedProgram
) => {
  if (input.members) {
    const members = input.members;
    return (
      <div key={inputIndex}>
        <Divider orientation="left" dashed plain>
          {input.struct_id} {input.name || input.register}:
        </Divider>
        {members.map((member, memberIndex) =>
          renderInput(
            member,
            memberIndex,
            [].concat(nameArray).concat(input.name || inputIndex),
            func,
            global,
            selectedProgram
          )
        )}
      </div>
    );
  } else {
    let label = input.name ? input.name : input.register;
    let name = [].concat(nameArray).concat(input.name || inputIndex);
    const getValue = (label) => {
      if (!selectedProgram) return null;

      const { signature, hash_type } = global;
      // Define default scope as a shallow copy of global
      let scope = { ...global };

      // Check if selectedProgram matches any of the conditions
      if (
        selectedProgram.includes('offchain') ||
        selectedProgram.includes('onchain_issuer')
      ) {
        scope.r0 = signature;
        scope.r1 =
          typeof hash_type !== 'undefined' ? `${hash_type}u8` : undefined;
      }
      return scope[label] || undefined;
    };
    return (
      <Form.Item
        key={inputIndex}
        label={label}
        name={name}
        rules={[{ required: true, message: 'Please input a value' }]}
        initialValue={getValue(label)}
      >
        <Input placeholder={`${input.type}`} />
      </Form.Item>
    );
  }
};

const functionForm = (func, funcInputs, global, processedProgram) => {
  return (
    <Form name={func} autoComplete="off" scrollToFirstError="true" {...layout}>
      {funcInputs.length > 0 ? (
        funcInputs.map((input, inputIndex) =>
          renderInput(
            input,
            inputIndex,
            ['inputs'],
            func,
            global,
            processedProgram.id()
          )
        )
      ) : (
        <Form.Item
          wrapperCol={{
            xs: {
              offset: 0,
            },
            sm: {
              offset: 4,
              span: 18,
            },
          }}
        >
          <Alert
            message={`The \`${func}\` function does not take any inputs.`}
            type="info"
            showIcon
          />
        </Form.Item>
      )}
      <Form.Item
        wrapperCol={{
          xs: {
            offset: 0,
          },
          sm: {
            offset: 4,
          },
        }}
      >
        <Button type="primary" htmlType="submit">
          Run
        </Button>
      </Form.Item>
    </Form>
  );
};
