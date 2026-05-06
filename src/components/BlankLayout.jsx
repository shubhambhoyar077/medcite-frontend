import React from 'react';
import { Outlet } from 'react-router';

const BlankLayout = () => {

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default BlankLayout;
