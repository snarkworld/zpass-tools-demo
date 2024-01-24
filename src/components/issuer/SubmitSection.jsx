import React from 'react';
import { Row, Col, Button, Divider, Form, Input } from 'antd';
import { CopyButton } from '../CopyButton.jsx';

export const SubmitSection = ({
  isSignatureGenerated,
  generatedSignature,
  issuer,
}) => {
  return (
    <>
      {generatedSignature ? (
        <>
          <Form.Item className="account-label-width" label="Signature">
            <Input
              value={generatedSignature}
              addonAfter={<CopyButton data={generatedSignature} />}
              disabled={isSignatureGenerated}
            />
          </Form.Item>
          <Form.Item className="account-label-width" label="Issuer">
            <Input
              value={issuer}
              addonAfter={<CopyButton data={issuer} />}
              disabled={isSignatureGenerated}
            />
          </Form.Item>
        </>
      ) : null}
      <Divider />
      <Row justify="center">
        <Col>
          <Button
            style={{ backgroundColor: '#DDFF56', color: 'black' }}
            htmlType="submit"
            disabled={isSignatureGenerated || generatedSignature}
          >
            Issue zPass
          </Button>
        </Col>
      </Row>
    </>
  );
};
