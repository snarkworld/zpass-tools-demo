import { Form, Input, Row, Col, Button, Space } from 'antd';
import { useAccountProvider } from '../contexts/account';
import '../index.css';

export const AccountFromPrivateKey = () => {
  // Destructuring required values from account context
  const { aleo, loadAccount, generateAccount, account } = useAccountProvider();

  const onFinish = (values) => {
    // Call the loadAccount method to load the account from Private Key
    loadAccount(values.privateKey);
  };

  if (aleo !== null) {
    return (
      !account && (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Row justify="center">
            <Col>Load Account from Private Key</Col>
          </Row>
          <Form onFinish={onFinish}>
            <Form.Item
              label="Private Key"
              name="privateKey"
              rules={[{ required: true, message: 'Missing Private Key' }]}
            >
              <Input
                className="datepicker-hover"
                name="privateKey"
                placeholder="Private Key"
                allowClear
              />
            </Form.Item>
            <Row justify="center">
              <Space size="middle">
                <Col span={6}>
                  <Button
                    type="primary"
                    shape="round"
                    htmlType="button"
                    disabled={account}
                    onClick={generateAccount}
                  >
                    Generate
                  </Button>
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    disabled={account}
                  >
                    Load
                  </Button>
                </Col>
              </Space>
            </Row>
          </Form>
        </Space>
      )
    );
  } else {
    return (
      <h3>
        <center>Loading...</center>
      </h3>
    );
  }
};
