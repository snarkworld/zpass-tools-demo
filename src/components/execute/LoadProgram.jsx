import { useState } from 'react';
import { Form, Input } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export const LoadProgram = ({ onResponse, clearSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const form = Form.useFormInstance();

  const onProgramSearch = (value) => {
    clearSelect();
    if (!value || value.trim() === '') {
      setError('Please input a program');
      return;
    }

    if (!value.endsWith('.aleo') && !value.includes('.')) {
      value += '.aleo';
      form.setFieldsValue({
        program_id: value,
      });
    }

    setIsLoading(true);
    const url = `https://api.explorer.aleo.org/v1/testnet3/program/${value}`;

    axios
      .get(url)
      .then((response) => {
        setIsLoading(false);
        setError(null);
        onResponse(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response?.data || error.message);
        onResponse('');
      });
  };

  return (
    <Form.Item
      label="Load Program"
      name="program_id"
      tooltip="Optionally load program from REST API"
      help={error || ''}
      validateStatus={error ? 'warning' : ''}
    >
      <Input.Search
        placeholder="Program ID"
        onSearch={onProgramSearch}
        disabled={isLoading}
        loading={isLoading}
      />
    </Form.Item>
  );
};

LoadProgram.propTypes = {
  onResponse: PropTypes.func.isRequired,
  clearSelect: PropTypes.func.isRequired,
};
