import { Row, Col, Button, Form, Input, Divider, Spin, Space } from 'antd';
import { useAccountProvider } from '../contexts/account';
import { CopyButton } from './CopyButton.jsx';

// Ant Design layout configuration for form
const layout = {
  labelCol: { span: 30 },
  wrapperCol: { span: 20 },
};

export const NewAccount = () => {
  // Destructuring required values from account context
  const { account, clear, isLoading } = useAccountProvider();

  // Prepare account-related strings
  const privateKey = account ? account.privateKey().to_string() : '';
  const viewKey = account ? account.viewKey().to_string() : '';
  const address = account ? account.address().to_string() : '';

  // Render loading spinner or account information
  return (
    <>
      {isLoading ? (
        <Row justify="center">
          <Spin />
        </Row>
      ) : (
        <>
          {account && (
            <Form {...layout}>
              <Divider>Issuer Account Information</Divider>
              <Form.Item label="Private Key" className="account-label-width">
                <Input
                  size="small"
                  placeholder="SK"
                  value={privateKey}
                  addonAfter={<CopyButton data={privateKey} />}
                  disabled
                />
              </Form.Item>
              <Form.Item label="View Key" className="account-label-width">
                <Input
                  size="small"
                  placeholder="VK"
                  value={viewKey}
                  addonAfter={<CopyButton data={viewKey} />}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Address" className="account-label-width">
                <Input
                  size="small"
                  placeholder="PK"
                  value={address}
                  addonAfter={<CopyButton data={address} />}
                  disabled
                />
              </Form.Item>
              <Divider />
            </Form>
          )}

          <Row justify="center" gutter={16}>
            {/* Generate and Clear Buttons */}
            {account ? (
              <Col>
                <Space direction="horizontal">
                  <Button type="primary" shape="round" onClick={clear}>
                    Clear
                  </Button>
                </Space>
              </Col>
            ) : null}
          </Row>

          {/* Display account information if available */}
        </>
      )}
    </>
  );
};
