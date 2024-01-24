/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { AutoComplete, DatePicker, Divider, Form, Input, Select } from 'antd';
import moment from 'moment';
import * as wasm from '../../issuer/pkg/issuer';
import { nationalities } from './helpers/nationalities.js';
import { ToggleButton } from './issuer/ToggleButton';
import { SubmitSection } from './issuer/SubmitSection';
import { NewAccount } from './NewAccount';
import { AccountFromPrivateKey } from './AccountFromPrivateKey';
import { CopyButton } from './CopyButton.jsx';

const Issuer = ({ handleIssue, isSignatureGenerated, generatedSignature, nationalityfield, subjectfield, issuer }) => {
  const [showIssuer, setShowIssuer] = useState(true);
  const [form] = Form.useForm();
  useEffect(()=>{
    if(!isSignatureGenerated) form.resetFields();
  }, [form, generatedSignature, isSignatureGenerated])
  

  const onFinish = (values) => {
    handleIssue(values);
  };

  const toggleIssuerForm = () => {
    setShowIssuer(!showIssuer);
  };

  const hashOptions = Object.keys(wasm.HashAlgorithm)
    .filter((key) => isNaN(parseInt(key)))
    .map((key) => ({
      value: wasm.HashAlgorithm[key],
      label: key,
  }));


  return (
    <>
      <ToggleButton toggleIssuerForm={toggleIssuerForm} showIssuer={showIssuer} />
      {showIssuer && (
        <>
          <Divider />
          <AccountFromPrivateKey />
          <NewAccount generatedSignature={generatedSignature} />
        </>
      )}
      <Divider />

      <Form
        form={form}
        name="generate_signature_form"
        onFinish={onFinish}
        initialValues={{ hash: 0 }}
      >
        <Form.Item
          label="Hash type"
          name="hash_type"
          className="account-label-width"
          rules={[
              { required: true, message: 'Missing hash type' }
          ]}
        >
          <Select>
            {hashOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subject"
          className="account-label-width"
          rules={[
            { required: true, message: 'Missing subject' },
            { pattern: /^[a-zA-Z0-9_]{63,63}$/, message: 'Input should be an address type' },
          ]}
        >
          <Input 
            addonAfter={<CopyButton data={subjectfield} />} 
            disabled={isSignatureGenerated} 
            placeholder="Enter a subject (e.g., 'address')" 
          />
        </Form.Item>

        <Form.Item
          label="DOB"
          name="dob"
          className="account-label-width"
          rules={[{ required: true, message: 'Missing date of birth' }]}
        >
          <DatePicker
            className="datepicker-hover"
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            disabled={isSignatureGenerated}
            placeholder="Select DOB (e.g., YYYY-MM-DD)"
            disabledDate={(current) => current && current > moment().endOf('day')}
          />
        </Form.Item>

        <Form.Item
            label="Nationality"
            name="nationality"
            className="account-label-width"
          >
            <AutoComplete
              style={{ width: '100%', textAlign: 'left' }}
              disabled={isSignatureGenerated}
              placeholder="Enter a nationality (e.g., 'American')"
              filterOption={true}
              options={nationalities}
            >
              <Input
                addonAfter={<CopyButton data={wasm.get_field_from_value(nationalityfield)} />}
              />
            </AutoComplete>
          </Form.Item>

        <Form.Item
          label="Expiration"
          name="expiry"
          className="account-label-width"
        >
          <DatePicker
            className="datepicker-hover"
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            disabled={isSignatureGenerated}
            placeholder="Select expiration date (e.g., YYYY-MM-DD)"
            disabledDate={(current) => current && current < moment().endOf('day')}
          />
        </Form.Item>
        
        <SubmitSection
          isSignatureGenerated={isSignatureGenerated}
          generatedSignature={generatedSignature}
          issuer={issuer}
        />

      </Form>

    </>
  );
};

export default Issuer;
