import React from 'react';
import { Button } from 'antd';

export const ToggleButton = ({ toggleIssuerForm, showIssuer }) => {
  return (
    <Button
      onClick={toggleIssuerForm}
      style={{ backgroundColor: '#DDFF56', color: 'black' }}
    >
      {showIssuer ? 'Hide' : 'Account Info'}
    </Button>
  );
};
