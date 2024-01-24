import React from 'react';
import { Form, Input, Space, Row, Col, Tooltip, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const DynamicFields = ({ fields, add, remove, errors }) => {
  return (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item {...restField} name={[name, 'fieldName']} rules={[{ required: true, message: 'Missing field name' }]}>
            <Input placeholder="Field Name" />
          </Form.Item>
          <Form.Item {...restField} name={[name, 'fieldValue']} rules={[{ required: true, message: 'Missing field value' }]}>
            <Input placeholder="Field Value" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Form.Item>
        <Form.ErrorList errors={errors} />
        <Row justify="center">
          <Col>
            <Tooltip title="Add Field">
              <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => add()} />
            </Tooltip>
          </Col>
        </Row>
      </Form.Item>
    </>
  );
};
