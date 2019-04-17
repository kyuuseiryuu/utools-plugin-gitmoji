import React from 'react';

const BasicLayout: React.FC = props => {
  return (
    <div style={{ padding: '1em' }}>
      {props.children}
    </div>
  );
};

export default BasicLayout;
